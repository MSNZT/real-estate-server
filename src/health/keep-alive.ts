const INTERVAL = 13 * 60 * 1000;

setInterval(() => {
  fetch(`${process.env.SERVER_URL}/api/health`)
    .then(() => console.log("Keep-alive ping sent"))
    .catch((err) => console.error("Keep-alive error:", err.message));
}, INTERVAL);
