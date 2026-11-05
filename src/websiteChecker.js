const axios = require("axios");

async function checkWebsite(url) {
  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        "User-Agent": "Khabri-Website-Monitor/1.0",
      },
    });

    const responseTime = Date.now() - startTime;

    return {
      status: response.status >= 200 && response.status < 400
        ? "ONLINE"
        : "HTTP_ERROR",
      statusCode: response.status,
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      status: "DOWN",
      statusCode: null,
      responseTime,
      error: error.code || error.message,
    };
  }
}

module.exports = checkWebsite;