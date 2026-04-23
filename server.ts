import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

// Load Firebase Config
let firebaseConfig: any = {};
try {
  const configContent = fsSync.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf-8");
  firebaseConfig = JSON.parse(configContent);
} catch (e) {
  console.log("Firebase config not found. AI Gateway will not be able to save UTRs to db.");
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "sterro-cloud-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // Required for SameSite=None
    sameSite: 'none',  // Required for cross-origin iframe
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

// Proxy trust for secure cookies behind nginx/proxy
app.set("trust proxy", 1);

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Configure Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "dummy" 
});

// Pterodactyl Config
const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY || 'ptla_yDDZ3d0e8Gn4tpZ4h9pGveVxIFcahxrI97VgVDO29hU';
const PTERODACTYL_PANEL_URL = process.env.PTERODACTYL_PANEL_URL || "https://panel.sterro.cloud"; 
const DefaultEggId = parseInt(process.env.PTERODACTYL_EGG_ID || "1", 10);
const DefaultNestId = parseInt(process.env.PTERODACTYL_NEST_ID || "1", 10);
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "MTQ5Njc0MjgxODA0MTgyNzM0OQ.GzvkKq.Y4zukBTPocc1tka3pSkVebzoIcmHlzIstRbP-c";

// Discord OAuth Config
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || `${process.env.APP_URL}/api/auth/callback`;

// Mapping plans to Pterodactyl limits
const PLAN_LIMITS: Record<string, any> = {
  "1 Hour Free Trial": { memory: 4096, disk: 10000, cpu: 150, ports: 1, backups: 0, databases: 0 },
  "Plan One": { memory: 2048, disk: 75000, cpu: 100, ports: 2, backups: 1, databases: 1 },
  "Plan Two": { memory: 4096, disk: 100000, cpu: 150, ports: 2, backups: 1, databases: 1 },
  "Plan Three": { memory: 6144, disk: 125000, cpu: 200, ports: 2, backups: 2, databases: 2 },
  "Plan Four": { memory: 8192, disk: 150000, cpu: 300, ports: 3, backups: 3, databases: 3 },
  "Plan Five": { memory: 12288, disk: 175000, cpu: 400, ports: 4, backups: 4, databases: 4 },
  "Plan Six": { memory: 16384, disk: 200000, cpu: 600, ports: 4, backups: 4, databases: 4 },
  "Plan Seven": { memory: 24576, disk: 250000, cpu: 0, ports: 5, backups: 5, databases: 5 },
  // Adding base VPS limits mapping for fallback
  "VPS Plan 1": { memory: 4096, disk: 50000, cpu: 200, ports: 1, backups: 0, databases: 0 },
  "VPS Plan 2": { memory: 8192, disk: 80000, cpu: 400, ports: 1, backups: 0, databases: 0 },
  "VPS Plan 3": { memory: 16384, disk: 120000, cpu: 800, ports: 1, backups: 0, databases: 0 },
};

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Discord OAuth Routes
app.get("/api/auth/url", (req, res) => {
  if (!DISCORD_CLIENT_ID) {
    return res.status(500).json({ error: "DISCORD_CLIENT_ID not configured" });
  }

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
  });

  const authUrl = `https://discord.com/api/oauth2/authorize?${params}`;
  res.json({ url: authUrl });
});

app.get(["/api/auth/callback", "/api/auth/callback/"], async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Login failed: No code provided");
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Discord Token Error:", errorData);
      return res.status(500).send("Failed to exchange code for token");
    }

    const { access_token } = (await tokenResponse.json()) as any;

    // 2. Fetch user data
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userResponse.ok) {
      return res.status(500).send("Failed to fetch user data");
    }

    const userData = (await userResponse.json()) as any;

    // 3. Save to session
    (req.session as any).user = {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      global_name: userData.global_name,
      avatar: userData.avatar,
      email: userData.email,
    };

    // 4. Return success page to close popup
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. Accessing Sterro Clouds...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("OAuth Error:", err);
    res.status(500).send("Internal server error during authentication");
  }
});

app.get("/api/auth/me", (req, res) => {
  const user = (req.session as any).user;
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

async function createPterodactylUser(email: string, username: string, firstName: string, lastName: string) {
  const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "!";
  const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/users`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email, username, first_name: firstName, last_name: lastName, password })
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes('has already been taken')) {
       // Ideally we fetch the user, but for now randomly mutate username/email if collision to succeed creating the server
       const rnd = Math.floor(Math.random()*1000);
       return createPterodactylUser(`${rnd}${email}`, `${username}${rnd}`, firstName, lastName);
    }
    throw new Error(`Failed to create Pterodactyl User: ${errorText}`);
  }

  const data = await response.json() as any;
  return { id: data.attributes.id, password };
}

async function createPterodactylServer(userId: number, planName: string, serverName: string, nodeIdStr?: string) {
  const limits = PLAN_LIMITS[planName] || PLAN_LIMITS["Plan One"];
  const nodeId = parseInt(nodeIdStr || "1", 10);
  
  const response = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/servers`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${PTERODACTYL_API_KEY}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name: serverName,
      user: userId,
      egg: DefaultEggId, 
      nest: DefaultNestId, 
      docker_image: "ghcr.io/pterodactyl/yolks:java_17",
      startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
      environment: { SERVER_JARFILE: "server.jar", BUILD_NUMBER: "latest" },
      limits: { memory: limits.memory, swap: 0, disk: limits.disk, io: 500, cpu: limits.cpu },
      feature_limits: { databases: limits.databases, backups: limits.backups, allocations: limits.ports },
      allocation: {
        default: 1 // Note: Some panels allow omitting default allocation and using deploy: { locations: [1], port_range: [], dedicated_ip: false }
      },
      deploy: { // Attempt auto-deploy if specific allocation 1 fails
        locations: [nodeId],
        dedicated_ip: false,
        port_range: []
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Server: ${errorText}`);
  }

  const data = await response.json() as any;
  return data.attributes;
}

app.post("/api/discord/send-otp", async (req, res) => {
  const { discordId } = req.body;
  if (!discordId) {
    res.status(400).json({ error: "Discord User ID is required" });
    return;
  }

  try {
    try {
      const trialDoc = await getDoc(doc(db, 'trials', discordId));
      if (trialDoc.exists()) {
        res.status(400).json({ error: "You have already claimed a free trial!" });
        return;
      }
    } catch(e) { 
      console.warn("DB check fail", e);
    }

    const dmRes = await fetch("https://discord.com/api/v10/users/@me/channels", {
      method: "POST",
      headers: { "Authorization": `Bot ${DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ recipient_id: discordId })
    });

    if (!dmRes.ok) {
        res.status(400).json({ error: "Could not DM user. Ensure Developer Mode is on, you provided a valid 18-digit User ID, and your privacy settings allow DMs from server members." });
        return;
    }
    const dmData = await dmRes.json() as any;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const msgRes = await fetch(`https://discord.com/api/v10/channels/${dmData.id}/messages`, {
      method: "POST",
      headers: { "Authorization": `Bot ${DISCORD_BOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content: `👋 Hey! Your Sterro Cloud 1-Hour Free Trial Verification Code is: **${otp}**\n\nThis code expires in 10 minutes. Do not share this code with anyone.` })
    });

    if (!msgRes.ok) {
      res.status(400).json({ error: "Failed to send OTP message to your DM." });
      return;
    }

    try {
        await setDoc(doc(db, 'otps', discordId), { otp, expiresAt: Date.now() + 10*60*1000 });
    } catch(e) {
        (global as any).memOtps = (global as any).memOtps || {};
        (global as any).memOtps[discordId] = otp;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/discord/claim-trial", async (req, res) => {
  const { discordId, otp, email, username, nodeId } = req.body;

  let isValid = false;
  try {
      const otpDoc = await getDoc(doc(db, 'otps', discordId));
      if (otpDoc.exists() && otpDoc.data().otp === otp) isValid = true;
  } catch(e) {
      if ((global as any).memOtps && (global as any).memOtps[discordId] === otp) isValid = true;
  }

  if (!isValid) {
    res.status(400).json({ error: "Invalid or expired OTP." });
    return;
  }

  try {
      const userRes = await createPterodactylUser(email, username || email.split("@")[0], "Trial", "User");
      let serverRes = null;
      let extError = null;
      try {
          serverRes = await createPterodactylServer(userRes.id, "1 Hour Free Trial", "Sterro Trial Server", nodeId);
          // Automatically suspend after 1 hour to enforce trial limits
          if (serverRes && serverRes.id) {
              setTimeout(async () => {
                  console.log(`[Trial] Auto-suspension triggered for server ID: ${serverRes.id}`);
                  try {
                      // 1. Fetch current server status to see if it's already suspended
                      const getRes = await fetch(`${PTERODACTYL_PANEL_URL}/api/application/servers/${serverRes.id}`, {
                          headers: { "Authorization": `Bearer ${PTERODACTYL_API_KEY}`, "Accept": "application/json" }
                      });
                      
                      if (getRes.ok) {
                          const serverData = await getRes.json() as any;
                          // only suspend if not already suspended
                          if (!serverData.attributes.suspended) {
                              await fetch(`${PTERODACTYL_PANEL_URL}/api/application/servers/${serverRes.id}/suspend`, {
                                  method: "POST",
                                  headers: { 
                                      "Authorization": `Bearer ${PTERODACTYL_API_KEY}`, 
                                      "Accept": "application/json", 
                                      "Content-Type": "application/json" 
                                  }
                              });
                              console.log(`[Trial] Server ${serverRes.id} has been suspended after 1 hour.`);
                          } else {
                              console.log(`[Trial] Server ${serverRes.id} was already suspended.`);
                          }
                      }
                  } catch (error) {
                      console.error(`[Trial] Failed to auto-suspend server ${serverRes.id}:`, error);
                  }
              }, 60 * 60 * 1000); // 1 Hour delay
          }
      } catch(e: any) { extError = e.message; }

      try { await setDoc(doc(db, 'trials', discordId), { claimedAt: new Date().toISOString(), serverId: serverRes?.id || 'unknown' }); } catch(e) {}

      res.json({
          success: true,
          credentials: { panelUrl: PTERODACTYL_PANEL_URL, username: username || email.split("@")[0], email: email, password: userRes.password },
          serverStatus: extError || "Trial Server provisioned! It will automatically suspend in 1 Hour."
      });
  } catch (e: any) {
      res.status(500).json({error: e.message});
  }
});

app.post("/api/verify-payment", upload.single("screenshot"), async (req, res) => {
  try {
    const { utrId, upiId, date, planName, email, username, nodeId } = req.body;
    const file = req.file;

    if (!file || !utrId || !date || !planName || !email) {
      res.status(400).json({ error: "Missing required fields or screenshot." });
      return;
    }

    try {
      const utrRef = doc(db, 'payments', utrId);
      const utrDoc = await getDoc(utrRef);
      if (utrDoc.exists()) {
        res.status(400).json({ error: "Duplicate payment detected. This UTR/Transaction ID has already been used." });
        return;
      }
    } catch (dbErr) {
       console.warn("DB check skipped/failed. Proceeding...", dbErr);
       // If db fails (like missing security rules), we don't strictly block them to prevent total lockout
    }

    const mimeType = file.mimetype;
    const base64Data = file.buffer.toString("base64");

    const prompt = `
      You are a strict payment verification AI for a UPI payment gateway.
      I have uploaded a screenshot of a UPI payment.
      
      Extract the following information from the image and verify it matches the user's provided input:
      - Claimed UTR / Transaction ID: ${utrId}
      - Claimed UPI ID paid from: ${upiId}
      - Claimed Date: ${date}

      Perform these checks:
      1. Is it a real payment screenshot (not photoshopped or fake)? Look for tampered text, misaligned fonts, or mismatched timestamps.
      2. Does the UTR/Transaction ID in the image match '${utrId}' exactly?
      3. Is it a recent payment or an old screenshot?
      4. Does the payment appear successful?

      Respond in JSON format only block:
      \`\`\`json
      {
        "isVerified": true/false,
        "extractedUtr": "string",
        "reason": "Explanation of verification result",
        "isFakeOrTampered": true/false
      }
      \`\`\`
    `;

    const textPart = { text: prompt };
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, textPart] },
      config: { 
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const verificationResult = JSON.parse(cleanJson);

    // LOG TRANSACTION
    try {
      await addDoc(collection(db, 'transactions'), {
        utrId,
        upiId,
        email,
        username,
        planName,
        date: Timestamp.now(),
        status: verificationResult.isVerified ? 'success' : 'failed',
        reason: verificationResult.reason,
        isVerified: verificationResult.isVerified
      });
    } catch (logErr) {
      console.error("Failed to log transaction:", logErr);
    }

    if (!verificationResult.isVerified || verificationResult.isFakeOrTampered) {
      res.status(400).json({ error: "Verification failed.", reason: verificationResult.reason });
      return;
    }

    try {
      await setDoc(doc(db, 'payments', utrId), { utrId, upiId, date, planName, email, verifiedAt: new Date().toISOString() });
    } catch(e) { console.warn("Failed recording to DB", e); }

    try {
      const userRes = await createPterodactylUser(email, username || email.split("@")[0], "New", "User");
      
      let serverRes = null;
      let serverCreationError = null;
      try {
        serverRes = await createPterodactylServer(userRes.id, planName, `${planName} Server`, nodeId);
      } catch (err: any) {
        console.error("Server Creation Failed: ", err);
        serverCreationError = `User Account created successfully, but Server provisioning was delayed due to Panel Allocation limits (Need to map correct Egg/Node IDs). Error: ${err.message}`;
      }

      res.json({
        success: true,
        message: "Payment verified successfully!",
        credentials: { panelUrl: PTERODACTYL_PANEL_URL, username: username || email.split("@")[0], email: email, password: userRes.password },
        serverStatus: serverCreationError || "Server deployed! Check panel."
      });
    } catch (panelErr: any) {
      res.status(500).json({ error: "Panel Error: " + panelErr.message });
    }
  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: "Internal server error during verification: " + error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

// Only start the server natively if we are not running in a Vercel Serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
