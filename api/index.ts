// @ts-ignore
import serverless from 'serverless-http';
import app from '../server';

export default serverless(app);

// Vercel specific configurations
export const config = {
  api: {
    // We handle our own body parsing in server.ts to avoid hangs
    bodyParser: false,
    externalResolver: true,
  },
};

// Set maximum duration for automation tasks (especially Pterodactyl calls)
export const maxDuration = 55; 
