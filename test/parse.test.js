// Tasks 1 and 5 — parse.js: reading the log.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as parse from "../src/parse.js";

const { parseLog } = parse;

// Runs parseLog and returns the error it throws, or fails if it throws nothing.
function errorFrom(text) {
  try {
    parseLog(text);
  } catch (err) {
    return err;
  }
  assert.fail(`parseLog(${JSON.stringify(text)}) returned normally. It should throw for a line it cannot read.`);
}

// ---- task 1: the seam ------------------------------------------------------

test("task 1: parse.js exports parseLog and nothing else", () => {
  assert.deepEqual(
    Object.keys(parse).sort(),
    ["parseLog"],
    `parse.js exports ${JSON.stringify(Object.keys(parse))}. Its promise is parseLog alone. ` +
      "A helper such as parseLine can live in the file without being exported — every export is " +
      "a promise someone may start depending on (lesson: What a module promises).",
  );
});

test("task 1: reads one line into a date, course, minutes and note", () => {
  const entries = parseLog("2026-09-28 cs140 45 read the lesson");
  assert.deepEqual(
    entries,
    [{ date: "2026-09-28", course: "cs140", minutes: 45, note: "read the lesson" }],
    "One session line should become one entry. Check the field names and that minutes is a number, not a string.",
  );
});

test("task 1: a line with no note gets an empty note", () => {
  const [entry] = parseLog("2026-09-28 math 60");
  assert.equal(entry?.note, "", `note came back as ${JSON.stringify(entry?.note)}. With nothing after the duration, the note is "".`);
});

test("task 1: skips blank lines and # comments, and keeps file order", () => {
  const text = "# header\n\n2026-09-29 math 30\n   \n  # indented comment\n2026-09-28 cs140 20";
  const entries = parseLog(text);
  assert.deepEqual(
    entries.map((e) => e.course),
    ["math", "cs140"],
    `Got courses ${JSON.stringify(entries.map((e) => e.course))}. Blank lines and lines starting with # ` +
      "(after any spaces) are skipped; the rest come back in the order they appear.",
  );
});

test("task 1: an empty log is an empty list", () => {
  assert.deepEqual(parseLog(""), [], "No session lines means no entries — an empty array, not an error.");
});

test("task 1: a bad duration names its line, counting skipped lines too", () => {
  const err = errorFrom("# comment\n\n2026-09-28 cs140 lots");
  assert.match(
    err.message,
    /^line 3:/,
    `The message was "${err.message}". The bad line is the file's third line, so the message starts "line 3:" — skipped lines still count.`,
  );
  assert.match(err.message, /lots/, `The message was "${err.message}". Quote the part that could not be read, so the reader can find it.`);
});

test("task 1: a bad date, and a line too short, are both errors", () => {
  assert.match(errorFrom("28/09/2026 cs140 45").message, /^line 1:.*28\/09\/2026/, "A date must be YYYY-MM-DD; the message should name line 1 and quote the date.");
  assert.match(errorFrom("2026-09-28 cs140").message, /^line 1:/, "A line needs a date, a course and a duration; with two parts it is an error that names its line.");
});

test("task 1: zero minutes is not a session", () => {
  assert.match(errorFrom("2026-09-28 cs140 0").message, /^line 1:/, "A duration must be above 0. A zero-minute session should be reported as an error on line 1.");
});

// ---- task 5: the format grows ----------------------------------------------

test("task 5: reads the report's own notation — 1h40m, 2h, 45m", () => {
  const entries = parseLog("2026-09-28 a 1h40m\n2026-09-28 b 2h\n2026-09-28 c 45m\n2026-09-28 d 0h05m\n2026-09-28 e 90");
  assert.deepEqual(
    entries.map((e) => e.minutes),
    [100, 120, 45, 5, 90],
    `Got minutes ${JSON.stringify(entries.map((e) => e.minutes))}. A duration may be bare minutes (90), minutes (45m), ` +
      "hours (2h), or both (1h40m). Whatever reads the notation should agree with whatever writes it in the report.",
  );
});

test("task 5: 1h75m is not a duration", () => {
  assert.match(
    errorFrom("2026-09-28 cs140 1h75m").message,
    /^line 1:.*1h75m/,
    "After the hours, the minutes are 0–59: the report would never write 1h75m. Reject it, naming the line and quoting it.",
  );
});

test("task 5: half-written durations are not durations", () => {
  for (const bad of ["h", "1h30", "m", "1.5h", "-30"]) {
    assert.match(errorFrom(`2026-09-28 cs140 ${bad}`).message, /^line 1:/, `"${bad}" is not in the notation, so it should be an error on line 1.`);
  }
});
