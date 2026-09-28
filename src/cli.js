// cli.js — the program you run. Node only: it reads a file from disk.
//
//   node src/cli.js sample.log      (or: npm run report)
//
// It imports the public face, studylog.js, and nothing else from src/.

import { readFileSync } from "node:fs";
import { summarize } from "./studylog.js";

const file = process.argv[2];
if (!file) {
  console.error("usage: node src/cli.js <log file>");
  process.exit(2);
}

try {
  console.log(summarize(readFileSync(file, "utf8")));
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
