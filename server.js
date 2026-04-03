const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const app = express();

app.use(express.text());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.post("/route", (req, res) => {
  const dijkstraPath = path.join(__dirname, "dijkstra");
  const child = exec(dijkstraPath, (err, stdout, stderr) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).send("Error running dijkstra");
    }
    res.send(stdout);
  });
  child.stdin.write(req.body);
  child.stdin.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
