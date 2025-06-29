// Simple hello world serverless function
exports.handler = async (event) => {
  const currentTime = new Date().toISOString();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from Zakayo Holdings!",
      time: currentTime,
      application: "Zakayo Holdings Management System",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
