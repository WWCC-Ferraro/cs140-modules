// Tasks 3 and 6 — report.js: writing the report.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as report from "../src/report.js";

const { formatReport } = report;

const week = () => ({
  sessions: 6,
  range: { first: "2026-09-28", last: "2026-10-01" },
  totals: [
    { course: "cs140", minutes: 100 },
    { course: "math", minutes: 100 },
    { course: "english", minutes: 50 },
  ],
});

const expected = [
  "Study log · 2026-09-28 to 2026-10-01 · 6 sessions",
  "cs140     1h40m",
  "math      1h40m",
  "english   0h50m",
  "total     4h10m",
].join("\n");

test("task 3: report.js exports formatReport and nothing else", () => {
  assert.deepEqual(
    Object.keys(report).sort(),
    ["formatReport"],
    `report.js exports ${JSON.stringify(Object.keys(report))}. Its promise is formatReport alone. If another ` +
      "module needs one of its helpers, exporting the helper from here widens this promise — see task 5 " +
      "for where a shared helper can go instead.",
  );
});

test("task 3: formats a week's summary", () => {
  assert.equal(formatReport(week()), expected, "Compare line by line with the example in report.js's comment: header, one line per course, total; labels padded to 10.");
});

test("task 3: one session is '1 session'", () => {
  const out = formatReport({ sessions: 1, range: { first: "2026-09-28", last: "2026-09-28" }, totals: [{ course: "math", minutes: 5 }] });
  assert.equal(out.split("\n")[0], "Study log · 2026-09-28 to 2026-09-28 · 1 session", "With exactly one session, the header says '1 session', not '1 sessions'.");
  assert.equal(out.split("\n")[1], "math      0h05m", "Minutes are always two digits: 5 minutes is 0h05m.");
});

test("task 3: no sessions is one line", () => {
  assert.equal(formatReport({ sessions: 0, range: null, totals: [] }), "Study log · no sessions", "With no sessions there is no range to print; the whole report is 'Study log · no sessions'.");
});

test("task 3: the header counts what it is given, not what was read before", () => {
  const first = formatReport(week());
  const again = formatReport({ ...week(), sessions: 2 });
  assert.match(first, /· 6 sessions$/m, "The header should use summary.sessions — 6 here.");
  assert.match(
    again,
    /· 2 sessions$/m,
    "Given sessions: 2, the header still said something else. report.js should print the number it is " +
      "handed. If it reads a count kept by another module, that count is shared state that survives between calls.",
  );
});

// ---- task 6: style handed in from the edge ---------------------------------

test("task 6: a style's bold wraps the header and the total line, and nothing else", () => {
  const style = { bold: (text) => `<${text}>` };
  const lines = formatReport(week(), style).split("\n");
  assert.equal(lines[0], "<Study log · 2026-09-28 to 2026-10-01 · 6 sessions>", "The header line should be passed through style.bold.");
  assert.equal(lines[4], "<total     4h10m>", "The whole total line — label and duration — should be passed through style.bold.");
  assert.deepEqual(lines.slice(1, 4), expected.split("\n").slice(1, 4), "Course lines are not bold.");
});

test("task 6: leaving the style out still gives plain text", () => {
  assert.equal(formatReport(week(), undefined), expected, "With no style, the report is plain text — the same as task 3. Give the parameter a default that leaves text unchanged.");
});
