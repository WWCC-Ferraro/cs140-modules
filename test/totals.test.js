// Task 2 — totals.js: adding it up.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as totals from "../src/totals.js";

const { totalsByCourse, dateRange } = totals;

const entries = () => [
  { date: "2026-09-30", course: "english", minutes: 50, note: "" },
  { date: "2026-09-28", course: "math", minutes: 60, note: "" },
  { date: "2026-10-01", course: "cs140", minutes: 45, note: "" },
  { date: "2026-09-29", course: "cs140", minutes: 15, note: "" },
];

test("task 2: totals.js exports totalsByCourse and dateRange, and nothing else", () => {
  assert.deepEqual(
    Object.keys(totals).sort(),
    ["dateRange", "totalsByCourse"],
    `totals.js exports ${JSON.stringify(Object.keys(totals))}. Its promise is those two functions. ` +
      "Anything else it needs can stay in the file, unexported (lesson: What a module promises).",
  );
});

test("task 2: one total per course, most minutes first", () => {
  assert.deepEqual(
    totalsByCourse(entries()),
    [
      { course: "cs140", minutes: 60 },
      { course: "math", minutes: 60 },
      { course: "english", minutes: 50 },
    ],
    "cs140 appears twice (45 + 15) and should be added into one total. Most minutes first; " +
      "cs140 and math tie at 60, so they go alphabetically.",
  );
});

test("task 2: no entries, no totals", () => {
  assert.deepEqual(totalsByCourse([]), [], "An empty list of entries has an empty list of totals.");
});

test("task 2: dateRange finds the first and last date, whatever the order", () => {
  assert.deepEqual(dateRange(entries()), { first: "2026-09-28", last: "2026-10-01" }, "The entries are not in date order; the range should still be the earliest and latest date.");
});

test("task 2: dateRange of nothing is null", () => {
  assert.equal(dateRange([]), null, "With no entries there is no range. The contract says null.");
});

test("task 2: dateRange leaves the entries in the order it was given them", () => {
  const given = entries();
  const before = given.map((e) => e.date);
  dateRange(given);
  assert.deepEqual(
    given.map((e) => e.date),
    before,
    "After dateRange, the caller's array came back reordered. The array the caller passed is the " +
      "caller's, not a copy — sorting it sorts theirs. Find the earliest and latest without changing " +
      "it (lesson: What a function can change).",
  );
});

test("task 2: totalsByCourse leaves the entries alone", () => {
  const given = entries();
  const before = structuredClone(given);
  totalsByCourse(given);
  assert.deepEqual(given, before, "totalsByCourse changed the entries it was handed. It should only read them.");
});
