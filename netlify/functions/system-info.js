// A simple Netlify serverless function that returns system info
export async function handler(event, context) {
  const timestamp = new Date().toISOString();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Welcome to Zakayo Holdings API",
      system: "Zakayo Holdings Management System",
      version: "1.0.0",
      timestamp,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
