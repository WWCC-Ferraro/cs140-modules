// Tasks 4, 5 and 6 — studylog.js: the public face, and the whole program through it.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as studylog from "../src/studylog.js";

const { summarize } = studylog;

const log = [
  "# a week",
  "2026-09-28 cs140 45 read the lesson",
  "2026-09-28 math 60 problem set",
  "2026-09-29 cs140 30",
  "",
  "2026-09-30 english 50 essay",
  "2026-09-30 cs140 25",
  "2026-10-01 math 40",
].join("\n");

const report = [
  "Study log · 2026-09-28 to 2026-10-01 · 6 sessions",
  "cs140     1h40m",
  "math      1h40m",
  "english   0h50m",
  "total     4h10m",
].join("\n");

test("task 4: studylog.js exports summarize and nothing else", () => {
  assert.deepEqual(
    Object.keys(studylog).sort(),
    ["summarize"],
    `studylog.js exports ${JSON.stringify(Object.keys(studylog))}. It is the program's public face: cli.js ` +
      "imports summarize and nothing else, so that is the whole promise. Importing parseLog here to use it " +
      "does not export it; re-exporting it does.",
  );
});

test("task 4: summarize turns a log into its report", () => {
  assert.equal(summarize(log), report, "The whole pipeline — parse, add up, format — through the public face. Check each module's own tests first.");
});

test("task 4: summarize gives the same report the second time", () => {
  const first = summarize(log);
  const second = summarize(log);
  assert.equal(
    second,
    first,
    "The second call's report differs from the first. Something outlives a call: a count kept at the top " +
      "level of a module is shared by every call, and an exported `let` is visible, live, to every importer. " +
      "Count the entries you were handed instead (lesson: Where to put the seam, live bindings).",
  );
});

test("task 4: an empty log after a full one is still 'no sessions'", () => {
  summarize(log);
  assert.equal(summarize("# nothing yet\n"), "Study log · no sessions", "After an earlier call, an empty log should still report no sessions. Is a count from the earlier call still around?");
});

test("task 4: summarize passes on parse errors, with the line number", () => {
  assert.throws(() => summarize("2026-09-28 cs140 45\n2026-09-29 cs140 soon"), /^Error: line 2:/, "A bad line should reach the caller as parseLog's error, starting 'line 2:'.");
});

test("task 5: a log may use the report's own notation", () => {
  const out = summarize("2026-09-28 cs140 1h05m\n2026-09-29 cs140 55m\n2026-09-29 math 2h");
  assert.equal(
    out,
    ["Study log · 2026-09-28 to 2026-09-29 · 3 sessions", "cs140     2h00m", "math      2h00m", "total     4h00m"].join("\n"),
    "A log written in the report's notation should read back: 1h05m + 55m is 2h00m.",
  );
});

test("task 6: summarize hands a style through to the report", () => {
  const out = summarize(log, { bold: (text) => `*${text}*` });
  assert.ok(out.startsWith("*Study log"), "summarize(text, style) should pass style on to formatReport, so the header comes back bold.");
});
