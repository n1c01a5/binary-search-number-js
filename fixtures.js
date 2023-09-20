const fs = require("fs");
const path = require("path");

const ENTRIES_COUNT = 10000;
const MAX_RANDOM_NUMBER = 1000000;
const entriesSet = new Set();

while (entriesSet.size < ENTRIES_COUNT) {
  const randomNumber = Math.floor(Math.random() * MAX_RANDOM_NUMBER) + 1;
  entriesSet.add(randomNumber);
}

const entries = [...entriesSet];
entries.sort((a, b) => a - b);

const outputPath = path.join(__dirname, "entries.txt");
fs.writeFileSync(outputPath, entries.join("\n"), "utf-8");

console.log(
  `${ENTRIES_COUNT} random entries have been written to entries.txt.`
);
