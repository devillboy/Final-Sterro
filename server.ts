import app from "./api/index.ts";
import express from "express";
import path from "node:path";
import fsSync from "node:fs";

const PORT = process.env.PORT || 3000;

// --- Dynamic Frontend Serving ---
async function mountFrontend() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fsSync.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
    }
  }
}

// In local dev/AI Studio environment, we listen on the port
if (!process.env.VERCEL && !process.env.NETLIFY) {
  mountFrontend().then(() => {
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`[SERVER] Started on port ${PORT}`);
    });
  });
} else {
  mountFrontend();
}

export default app;
