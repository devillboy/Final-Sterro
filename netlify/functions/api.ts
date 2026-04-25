import serverless from "serverless-http";
import app from "../../server";

const handler = serverless(app, {
  request: (req: any, event: any) => {
    // Inject Netlify event context into the request if needed
    req.netlifyEvent = event;
    
    // Path rewriting for clean routing
    const path = event.path || req.url;
    req.url = path.replace(/^\/\.netlify\/functions\/api/, '');
    if (!req.url.startsWith('/')) req.url = '/' + req.url;
  }
});

export const api = async (event: any, context: any) => {
  return await handler(event, context);
};

// Netlify uses 'handler' export by default
export { api as handler };
