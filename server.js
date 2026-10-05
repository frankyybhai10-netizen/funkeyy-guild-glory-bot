const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

const SUPPORTED_REGIONS = [
  "IND", "BR", "SG", "RU", "ID", "TW", "US",
  "VN", "TH", "ME", "PK", "CIS", "BD"
];

app.use(express.json());
app.use(express.static(__dirname));

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "FUNKEYY GUILD GLORY BOT"
  });
});

app.get("/api/guild", async (req, res) => {
  try {
    const region = String(req.query.region || "").toUpperCase();
    const guildID = String(req.query.guildID || "").trim();

    if (!SUPPORTED_REGIONS.includes(region)) {
      return res.status(400).json({
        error: "Unsupported region"
      });
    }

    if (!/^\d{5,15}$/.test(guildID)) {
      return res.status(400).json({
        error: "Invalid Guild UID"
      });
    }

    const url =
      "https://free-ff-api-src-5plp.onrender.com/api/v1/guildInfo" +
      "?region=" + encodeURIComponent(region) +
      "&guildID=" + encodeURIComponent(guildID);

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        error: "Upstream Guild API error",
        status: response.status
      });
    }

    const data = await response.json();

    if (!data || !data.clanId) {
      return res.status(404).json({
        error: "Guild not found",
        data
      });
    }

    res.json(data);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Guild API request failed"
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/funkeyy-index.html");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FUNKEYY server running on port ${PORT}`);
});
