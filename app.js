const path = require("path")
const express = require('express')
const app = express()
const publicDirectoryPath = path.join(__dirname, "public")

let scores = []

app.use(express.json())
app.use(express.static(publicDirectoryPath))

app.get("/scores", (req, res) => {
  res.send(scores)
});

app.post("/scores", (req, res) => {
  scores.push(req.body);
  scores.sort((b,a) => (a.finalscore - b.finalscore));
  scores.splice(3);  
  res.status(201);
  res.send(scores);
});

app.listen(3000);