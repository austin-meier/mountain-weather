// backend.js
import http from "node:http";

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === "/forecast" && req.method === "GET") {
    const externalUrl =
      "https://www.mountain-forecast.com/peaks/Grays-Peak/forecasts/data?elev=4350&period_types=h&date=2025-06-15";

    try {
      const response = await fetch(externalUrl, {
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Enable CORS
      });
      res.end(JSON.stringify(data));
    } catch (error) {
      res.writeHead(500, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(
        JSON.stringify({
          error: "Failed to fetch forecast data",
          details: error.message,
        })
      );
    }
  } else {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
