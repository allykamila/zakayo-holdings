// Environment checker function
exports.handler = async (event) => {
  // Safe public environment variables
  // (Note: Don't expose sensitive environment variables)
  const environment = process.env.NODE_ENV || "development";
  const deployContext = process.env.CONTEXT || "unknown";
  const deployUrl = process.env.DEPLOY_URL || "localhost";
  const netlifyEnv = process.env.NETLIFY || "false";

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "Active",
      deploymentInfo: {
        environment,
        deployContext,
        isNetlifyEnvironment: netlifyEnv === "true",
        timestamp: new Date().toISOString(),
      },
      message: "Zakayo Holdings system is operational",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
