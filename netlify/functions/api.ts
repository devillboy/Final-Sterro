import serverless from "serverless-http";
import app from "../../server.js";

const handler = serverless(app, {
  request: (req: any, event: any) => {
    req.netlifyEvent = event;
    
    // Path rewriting: ensure it starts with /api if it's being proxied to this function
    let path = event.path || req.url;
    
    // If it comes through the function path directly, strip the function prefix but keep /api
    if (path.startsWith('/.netlify/functions/api')) {
      path = path.replace('/.netlify/functions/api', '/api');
    }
    
    // Ensure it's never empty
    if (!path || path === '') path = '/';
    
    req.url = path;
  }
});

export const api = async (event: any, context: any) => {
  return await handler(event, context);
};

// Netlify uses 'handler' export by default
export { api as handler };
