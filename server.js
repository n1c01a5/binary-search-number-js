const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const app = express();

const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let entries = [];
fs.readFile("entries.txt", "utf-8", (err, data) => {
  if (err) throw err;
  entries = data
    .split("\n")
    .filter((entry) => entry)
    .map(Number);
});

app.get("/entries", (req, res) => {
  res.json(entries);
});

app.post("/add-entry", (req, res) => {
  const entry = req.body.entry;
  const position = findInsertionPosition(entry, entries);

  if (entries[position] === entry) {
    res.status(409).send("Entry already exists"); // 409 Conflict
    return;
  }

  entries.splice(position, 0, entry);

  fs.writeFile("entries.txt", entries.join("\n"), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    res.status(200).send("Entry added successfully");
  });
});

function findInsertionPosition(value, array) {
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    if (array[middle] === value) return middle;
    if (array[middle] < value) {
      start = middle + 1;
    } else {
      end = middle - 1;
    }
  }
  return start;
}

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
