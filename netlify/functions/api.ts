import serverless from "serverless-http";
import app from "../../server";

export const handler = serverless(app, {
  request: (req: any, event: any) => {
    // Rewrite path to match express routes if accessing via Netlify internal function path
    let url = event.path || req.url;
    if (url.startsWith('/.netlify/functions/api')) {
      url = url.replace('/.netlify/functions/api', '/api');
    }
    // Netlify 200 rewrites sometimes place the original url in event.headers['x-nf-request-id'] 
    // but the safest way is to just ensure it starts with /api
    req.url = url;
  }
});
