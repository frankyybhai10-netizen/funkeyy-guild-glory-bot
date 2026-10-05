const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

const SUPPORTED_REGIONS = [
  "IND", "BR", "SG", "RU", "ID", "TW", "US",
  "VN", "TH", "ME", "PK", "CIS", "BD"
];

app.use(express.json());
app.use(express.static(__dirname));

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "FUNKEYY GUILD GLORY BOT" });
});

app.get("/api/guild", (req, res) => {
  const region = String(req.query.region || "").toUpperCase();
  const guildID = String(req.query.guildID || "").trim();

  if (!SUPPORTED_REGIONS.includes(region)) {
    return res.status(400).json({ error: "Unsupported region" });
  }

  if (!/^\d{5,15}$/.test(guildID)) {
    return res.status(400).json({ error: "Invalid Guild UID" });
  }

  let guilds;
  try {
    guilds = JSON.parse(
      fs.readFileSync(path.join(__dirname, "guilds.json"), "utf8")
    );
  } catch (error) {
    console.error("guilds.json error:", error.message);
    return res.status(500).json({ error: "Guild data file error" });
  }

  const guild = guilds[guildID];

  if (!guild) {
    return res.status(404).json({ error: "Guild not found" });
  }

  res.json(guild);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`FUNKEYY server running on port ${PORT}`);
});
