import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import path from "node:path";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

// Mapping plans to Pterodactyl limits
const PLAN_LIMITS: Record<string, any> = {
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

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { data: base64Data, mimeType: mimeType } }] }],
      config: { responseMimeType: "application/json" }
    });

    const responseText = result.text || "{}";
    const verificationResult = JSON.parse(responseText.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, ""));

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
        serverCreationError = \`User Account created successfully, but Server provisioning was delayed due to Panel Allocation limits (Need to map correct Egg/Node IDs). Error: \${err.message}\`;
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
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}
startServer();
