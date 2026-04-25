import serverless from "serverless-http";
import app from "../../server";

const serverlessHandler = serverless(app, {
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

export const handler = async (event: any, context: any) => {
  try {
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error("Netlify Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function invocation failed", message: (error as any).message })
    };
  }
};
