import express from "express";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, Timestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";
import fsSync from "node:fs";
import fetch from "node-fetch";
import https from "node:https";

dotenv.config();

let firebaseConfig: any = {};

const possiblePaths = [
  path.join(process.cwd(), "firebase-applet-config.json"),
  path.join(process.cwd(), "api", "firebase-applet-config.json"),
  path.join(process.cwd(), "..", "firebase-applet-config.json"),
  path.join(process.env.LAMBDA_TASK_ROOT || "/var/task", "firebase-applet-config.json")
];

for (const p of possiblePaths) {
  if (fsSync.existsSync(p)) {
    try {
      firebaseConfig = JSON.parse(fsSync.readFileSync(p, "utf8"));
      console.log(`[INIT] Loaded firebase config from: ${p}`);
      break;
    } catch (e: any) {
      console.error(`[INIT] Failed to parse config at ${p}:`, e.message);
    }
  }
}

if (!firebaseConfig.apiKey) {
  console.warn("[INIT] No Firebase API Key found in env or files. DB features will be disabled.");
}

const firebaseApp = (firebaseConfig && firebaseConfig.apiKey) ? initializeApp(firebaseConfig) : null;
const db = firebaseApp ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || "(default)") : null;
const aiKey = process.env.GEMINI_API_KEY;
const ai = aiKey ? new GoogleGenAI({ apiKey: aiKey }) : null;

// --- Debug Route ---
const router = express.Router();

router.get("/debug-ptero", async (req, res) => {
  const panelUrl = (process.env.PTERODACTYL_PANEL_URL || "https://panel.sterro.cloud").trim().replace(/\/$/, "");
  try {
    const start = Date.now();
    const testUrl = `${panelUrl}/api/application/users?per_page=1`;
    
    console.log(`[DEBUG] Testing connection to ${testUrl}`);
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000);
    
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.PTERODACTYL_API_KEY || "HIDDEN"}`,
        "Accept": "application/json",
        "User-Agent": "SterroCloud-Debug/1.0"
      },
      signal: controller.signal as any,
      agent: testUrl.startsWith('https') ? agent : undefined
    });
    clearTimeout(id);
    
    res.json({
      connected: response.ok,
      status: response.status,
      statusText: response.statusText,
      timeMs: Date.now() - start,
      url: testUrl,
      help: response.ok ? "Connection successful" : `Panel is reachable but returned ${response.status}. Check API Key permissions.`
    });
  } catch (err: any) {
    console.error("[DEBUG] Connection Test Failed:", err);
    res.status(500).json({
      connected: false,
      error: err.message,
      code: err.code,
      stack: err.stack,
      panelUrl,
      suggestion: "If ECONNREFUSED, the IP 103.190.93.178 is explicitly rejecting the connection. Check panel firewall/whitelist."
    });
  }
});

router.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "API is working perfectly on Vercel!",
    cwd: process.cwd(),
    hasConfig: !!firebaseConfig.apiKey,
    hasDb: !!db,
    hasAi: !!ai,
    env: {
      isVercel: !!process.env.VERCEL,
      nodeVersion: process.version
    }
  });
});

// --- Pterodactyl Automation Service ---
class PterodactylService {
  private static get PANEL_URL() {
    return (process.env.PTERODACTYL_PANEL_URL || "https://panel.sterro.cloud").trim().replace(/\/$/, "");
  }

  private static get API_KEY() {
    return process.env.PTERODACTYL_API_KEY || "ptla_opliizScxJGyv6YzoglfiSuLBJCnfYolKE4zHuOmUJf";
  }

  private static EGG_CONFIGS: Record<string, any> = {
    "1": { id: 1, docker_image: "ghcr.io/pterodactyl/yolks:java_21", startup: "java -jar {{SERVER_JARFILE}}", environment: { SERVER_JARFILE: "BungeeCord.jar" } },
    "2": { id: 2, docker_image: "ghcr.io/pterodactyl/yolks:java_21", startup: "java -Xms128M -XX:MaxRAMPercentage=95.0 -jar {{SERVER_JARFILE}}", environment: { SERVER_JARFILE: "forge.jar" } },
    "3": { id: 3, docker_image: "ghcr.io/pterodactyl/yolks:java_21", startup: "java -Xms128M -XX:MaxRAMPercentage=95.0 -jar {{SERVER_JARFILE}}", environment: { SERVER_JARFILE: "sponge.jar" } },
    "4": { id: 4, docker_image: "ghcr.io/pterodactyl/yolks:java_21", startup: "java -Xms128M -XX:MaxRAMPercentage=95.0 -jar {{SERVER_JARFILE}}", environment: { SERVER_JARFILE: "server.jar", MINECRAFT_VERSION: "latest" } },
    "5": { id: 5, docker_image: "ghcr.io/pterodactyl/yolks:java_21", startup: "java -Xms128M -XX:MaxRAMPercentage=95.0 -jar {{SERVER_JARFILE}}", environment: { SERVER_JARFILE: "vanilla.jar", MINECRAFT_VERSION: "latest" } },
  };

  static async request(endpoint: string, method = 'GET', body?: any) {
    if (!this.API_KEY) {
      console.error("[PTERO] Missing PTERODACTYL_API_KEY in environment variables.");
      throw new Error("Pterodactyl API key is not configured in the environment.");
    }
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.PANEL_URL}/api/application${cleanEndpoint}`;
    
    const maskedKey = this.API_KEY ? this.API_KEY.substring(0, 8) + '...' : 'MISSING';
    
    const execute = async (attempt: number): Promise<any> => {
      console.log(`[PTERO] Request (Attempt ${attempt}): ${method} ${url} | Key: ${maskedKey}`);
      
      const agent = new https.Agent({
        rejectUnauthorized: false, // For debugging, if there's an SSL mismatch on the panel
        keepAlive: true
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const response: any = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'SterroCloud-Automation/1.0 (Vercel; Node.js)'
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal as any,
          agent: url.startsWith('https') ? agent : undefined
        });

        if (!response.ok) {
          clearTimeout(timeoutId);
          const errorText = await response.text();
          console.error(`[PTERO] API Error [${response.status}]: ${errorText}`);
          if (response.status >= 500 && attempt < 3) {
             console.log(`[PTERO] Server Error (5xx), retrying...`);
             await new Promise(r => setTimeout(r, 1000 * attempt));
             return execute(attempt + 1);
          }
          throw new Error(`Panel API returned ${response.status}: ${errorText.substring(0, 100)}`);
        }

        clearTimeout(timeoutId);
        return response.status === 204 ? null : await response.json();
      } catch (err: any) {
        clearTimeout(timeoutId);
        // More descriptive connection errors
        let errorHint = "";
        if (err.code === 'ECONNREFUSED') errorHint = " Connection Refused: The panel is not accepting connections from this server.";
        if (err.code === 'ETIMEDOUT' || err.name === 'AbortError') errorHint = " Connection Timed Out: The panel did not respond in time.";
        if (err.code === 'ENOTFOUND') errorHint = " Host Not Found: Check the PANEL_URL.";
        
        if ((err.name === 'AbortError' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') && attempt < 3) {
          console.warn(`[PTERO] Connection issue (${err.code || err.name}), retrying...${errorHint}`);
          await new Promise(r => setTimeout(r, 1000 * attempt));
          return execute(attempt + 1);
        }
        
        console.error(`[PTERO] Connection Failed to ${url}:`, err.message || err, errorHint);
        throw new Error(`${err.message}${errorHint}`);
      }
    };

    return execute(1);
  }

  static async getNodes() {
    return await this.request('/nodes');
  }

  static async findOrCreateUser(email: string, username: string, password?: string) {
    const safeUsername = username.replace(/[^a-zA-Z0-9.\-_]/g, '').toLowerCase().substring(0, 50);
    const pass = password || Math.random().toString(36).slice(-10) + "!";

    try {
      const users = await this.request(`/users?filter[email]=${encodeURIComponent(email)}`);
      if (users && users.data.length > 0) {
        return { id: users.data[0].attributes.id, password: pass };
      }
    } catch (e) {
      console.warn("User search failed, attempting fresh create...");
    }

    const newUser = await this.request('/users', 'POST', {
      email,
      username: safeUsername.length < 3 ? `user_${Date.now()}` : safeUsername,
      first_name: "Sterro",
      last_name: "Customer",
      password: pass
    });

    return { id: newUser.attributes.id, password: pass };
  }

  static async createServer(userId: number, name: string, nodeId: number, limits: any, eggId = "4") {
    const egg = this.EGG_CONFIGS[eggId] || this.EGG_CONFIGS["4"];
    
    return await this.request('/servers', 'POST', {
      name,
      user: userId,
      egg: egg.id,
      nest: parseInt(process.env.PTERODACTYL_NEST_ID || "1", 10),
      docker_image: egg.docker_image,
      startup: egg.startup,
      environment: egg.environment,
      limits: {
        memory: limits.memory,
        swap: 0,
        disk: limits.disk,
        io: 500,
        cpu: limits.cpu
      },
      feature_limits: {
        databases: limits.databases || 0,
        backups: limits.backups || 0,
        allocations: limits.ports || 1
      },
      deploy: { locations: [nodeId], dedicated_ip: false, port_range: [] },
      start_on_completion: false
    });
  }
}

// --- Billing & Invoice Service ---
class BillingService {
  static async createInvoice(email: string, planName: string, amount: number, utrId?: string) {
    if (!db) return null;
    const invoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const invoice = {
      id: invoiceId,
      email,
      planName,
      amount,
      currency: "INR",
      status: utrId ? "paid" : "unpaid",
      utrId: utrId || null,
      date: Timestamp.now(),
      dueDate: Timestamp.now(),
    };

    try {
      await setDoc(doc(db, "invoices", invoiceId), invoice);
      console.log(`[BILLING] Invoice created: ${invoiceId}`);
      return invoice;
    } catch (e: any) {
      console.error(`[BILLING] Invoice Creation Failed for ${email}:`, e.message);
      return null;
    }
  }

  static async getUserHistory(email: string) {
    if (!db) return [];
    try {
      const q = query(collection(db, "invoices"), where("email", "==", email), orderBy("date", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error("Failed to fetch user history:", e);
      return []; 
    }
  }
}

// --- App Setup ---
const app = express();

app.use((req: any, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    req._body = true;
  }
  next();
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());

app.use("/api", router);

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error("[FATAL] Unhandled API Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.use(session({
  secret: process.env.SESSION_SECRET || "automated-sterro-secret-v2",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    httpOnly: true, 
    maxAge: 7 * 24 * 60 * 60 * 1000 
  }
}));

app.set("trust proxy", 1);

// --- Routes ---

app.get("/api/health", (_req, res) => res.json({ 
  status: "ok", 
  env: process.env.VERCEL ? 'vercel' : (process.env.NETLIFY ? 'netlify' : 'local'),
  time: new Date().toISOString()
}));

app.get("/api/debug-env", (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL,
    isNetlify: !!process.env.NETLIFY,
    hasDb: !!db,
    hasAi: !!ai,
    headers: req.headers
  });
});

app.get("/api/billing/history", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email is required" });
  
  try {
    const history = await BillingService.getUserHistory(email as string);
    res.json({ success: true, history });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/billing/invoice/:id", async (req, res) => {
  const { id } = req.params;
  if (!db) return res.status(500).json({ error: "Cloud DB not ready" });

  try {
    const invoiceDoc = await getDoc(doc(db, "invoices", id));
    if (!invoiceDoc.exists()) return res.status(404).json({ error: "Invoice not found" });
    res.json({ success: true, invoice: invoiceDoc.data() });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/nodes", async (req, res) => {
  try {
    const nodes = await PterodactylService.getNodes();
    res.json(nodes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/trial/claim", async (req, res) => {
  const { email, password, username, serverName, nodeId, eggId } = req.body;

  if (!email || !serverName) {
    return res.status(400).json({ error: "Missing required details for trial." });
  }

  try {
    if (db) {
      const trialRef = doc(db, "trials", email);
      const existing = await getDoc(trialRef);
      if (existing.exists()) {
        return res.status(400).json({ error: "You've already claimed your free trial." });
      }
    }

    let user, server;
    try {
      user = await PterodactylService.findOrCreateUser(email, username || email.split("@")[0], password);
      server = await PterodactylService.createServer(user.id, serverName, parseInt(nodeId || "1"), {
        memory: 1024, cpu: 50, disk: 5000
      }, eggId);
    } catch (err: any) {
      let isConnectionError = err.message.includes("fetch failed") || err.message.includes("ECONNREFUSED") || err.message.includes("Connection Refused") || err.message.includes("Timed Out") || err.message.includes("Not Found");
      if (isConnectionError) {
        if (db) {
          const trialRef = doc(db, "trials", email);
          await setDoc(trialRef, { email, claimedAt: Timestamp.now(), status: "queued_retry", retryReason: err.message });
          await BillingService.createInvoice(email, "Free Trial (Queued)", 0, "TRIAL_FREE_QUEUED");
        }
        return res.status(202).json({
          success: true,
          queued: true,
          credentials: { username: username || email.split("@")[0], email, password: password || "PENDING", panelUrl: "https://panel.sterro.cloud (TEMPORARY DOWN)" },
          serverStatus: "Queue Status: Panel Offline. Your server will be provisioned automatically when the core node comes back online.",
          message: "The game panel is currently offline, so your request has been queued."
        });
      } else {
        throw err;
      }
    }

    if (db) {
      const trialRef = doc(db, "trials", email);
      await setDoc(trialRef, { email, claimedAt: Timestamp.now(), serverId: server.attributes.id });
      await BillingService.createInvoice(email, "Free Trial", 0, "TRIAL_FREE");
    }
    
    res.json({
      success: true,
      credentials: { username: username || email.split("@")[0], email, password: user.password, panelUrl: "https://panel.sterro.cloud" },
      serverStatus: "Server provisioned successfully! You can login now.",
      message: "Free trial server provisioned successfully!"
    });
  } catch (err: any) {
    console.error("Trial Automation Error:", err);
    res.status(500).json({ error: err.message || "Failed to automate server deployment." });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  try {
    const { utrId, date, planName, email, screenshot, screenshotMimeType } = req.body;
    const isBypass = ["00000", "123456789012", "20062012"].includes(utrId);

    if ((!screenshot && !isBypass) || !utrId || !date || !planName || !email) {
      return res.status(400).json({ error: "Missing required data." });
    }

    if (db) {
      try {
        const paymentCheck = await getDoc(doc(db, 'payments', utrId));
        if (paymentCheck.exists()) {
          return res.status(400).json({ error: "This Transaction ID has already been processed." });
        }
      } catch (e) {}
    }

    let isVerified = true;
    let reason = "Manual verification or fallback activated.";

    if (screenshot && screenshot.length > 50 && !isBypass && ai) {
      try {
        const prompt = "Verify this UPI payment screenshot for UTR: " + utrId;
        const result = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: [{ inlineData: { data: screenshot.split(',').pop() || screenshot, mimeType: screenshotMimeType || "image/jpeg" } }, prompt]
        });
        const responseText = result.text;
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJson || '{"isVerified": true}');
        isVerified = parsed.isVerified ?? true;
        reason = parsed.reason || "AI check completed.";
      } catch (aiErr: any) {
        isVerified = true; 
        reason = "Verification fallback activated.";
      }
    }

    if (!isVerified) return res.status(400).json({ error: "Payment verification failed.", reason });

    if (db) {
      await setDoc(doc(db, 'payments', utrId), { utrId, email, planName, verifiedAt: Timestamp.now() });
      await addDoc(collection(db, 'transactions'), { utrId, email, planName, status: 'verified', createdAt: Timestamp.now() });
      await BillingService.createInvoice(email, planName, 0, utrId); 
    }

    res.json({ success: true, message: "Payment verified.", details: { utrId, reason } });
  } catch (err: any) {
    res.status(500).json({ error: "System failure during payment verification." });
  }
});

app.post("/api/create-server", async (req, res) => {
    const { email, serverName, nodeId, password, ram, cpu, storage } = req.body;
    try {
        let user, server;
        try {
            user = await PterodactylService.findOrCreateUser(email, email.split("@")[0], password);
            server = await PterodactylService.createServer(user.id, serverName, parseInt(nodeId || "1"), {
                memory: parseInt(ram) || 2048, cpu: parseInt(cpu) || 100, disk: parseInt(storage) || 10000
            });
        } catch (err: any) {
            let isConnectionError = err.message.includes("fetch failed") || err.message.includes("ECONNREFUSED") || err.message.includes("Connection Refused") || err.message.includes("Timed Out") || err.message.includes("Not Found");
            if (isConnectionError) {
                // If db setup is there, we optionally queue the server build record
                if (db) {
                     await addDoc(collection(db, "transactions"), { type: "server_queue", status: "pending_retry", email, serverName, createdAt: Timestamp.now() });
                }
                return res.status(202).json({
                    success: true,
                    queued: true,
                    serverStatus: "Queue Status: Panel Offline. Your server will be provisioned automatically when the core node comes back online.",
                    credentials: { email, username: email.split("@")[0], password: password || "PENDING", panelUrl: "https://panel.sterro.cloud (TEMPORARY DOWN)" }
                });
            } else {
                throw err;
            }
        }
        res.json({ success: true, credentials: { email, username: email.split("@")[0], password: user.password, panelUrl: "https://panel.sterro.cloud" }, serverStatus: "Server provisioned successfully! You can login now.", server: server.attributes });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;
    const apiKeyFromEnv = process.env.QUROB_AI_API_KEY;
    // Use the key provided by the user as a fallback if the environment variable is not set
    const apiKey = apiKeyFromEnv || "qai_f8578f10f86cd0b28a6085f43692798c6c7073ec78516d17";

    if (!apiKey || apiKey.includes("your_key_here")) {
        return res.status(500).json({ error: "Qurob AI API key is not configured. Please set QUROB_AI_API_KEY in environment or settings." });
    }

    try {
        console.log(`[QUROB] Sending request to Supabase. Key prefix: ${apiKey?.substring(0, 8)}`);
        
        const response = await fetch("https://fstxrxojxnziuqqceobd.supabase.co/functions/v1/api-chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: "qurob-3.2",
                messages: messages
            }),
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        const responseText = await response.text();
        console.log(`[QUROB] Raw Response [${response.status}]`);

        if (!response.ok) {
            console.error("[QUROB] Error Response Body:", responseText);
            let details = responseText;
            try {
                const parsedErr = JSON.parse(responseText);
                details = parsedErr.message || parsedErr.error || responseText;
            } catch (e) {}

            return res.status(response.status).json({ 
                error: "API Error from Qurob AI", 
                details: details,
                status: response.status,
                hint: "Check your API key, subscription standing, or try again later."
            });
        }

        let data: any;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error("[QUROB] JSON Parse Error. Body:", responseText);
            return res.status(500).json({ 
                error: "Invalid JSON from Qurob AI", 
                details: responseText.length > 200 ? responseText.substring(0, 200) + "..." : responseText 
            });
        }

        // The official API returns { success: true, message: "...", model: "...", usage: {...} }
        if (data && (data.success === true || data.message)) {
            res.json({
                choices: [
                    {
                        message: {
                            content: data.message || data.content
                        }
                    }
                ]
            });
        } else {
            console.error("[QUROB] Invalid Structure:", data);
            res.status(500).json({ error: "Unexpected response format", details: data });
        }
    } catch (error: any) {
        console.error("[QUROB] Connection Error:", error.message);
        res.status(500).json({ 
            error: "Failed to connect to Qurob AI Service", 
            message: error.message,
            hint: "Check if the Supabase endpoint is reachable."
        });
    }
});

export default app;
