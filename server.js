const express = require("express");
const { exec } = require("child_process");
const app = express();
app.use(express.text());
app.use(express.static("public"));
app.post("/route", (req, res) => {
    const process = exec("dijkstra.exe", (err, stdout) => {
        if (err) return res.send("Error");
        res.send(stdout);
    });
    process.stdin.write(req.body);
    process.stdin.end();
});
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});