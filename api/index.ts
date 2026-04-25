import app from '../server';

export default app;

// Disable Vercel's default body parser so Express (multer, express.json) can handle the raw request streams
export const config = {
  api: {
    bodyParser: false,
  },
};

export const maxDuration = 60; // Set max duration for Vercel Hobby to 60s

