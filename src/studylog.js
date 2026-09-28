// studylog.js — the whole program in one file.
//
// It works, mostly. Everything in it is exported "in case something needs it",
// so every name below is, today, something another file could depend on.
//
// Your job (README, tasks 1–4) is to move this code into parse.js, totals.js
// and report.js, and leave this file as the program's public face: the one
// thing cli.js imports.

export const MINUTES_PER_HOUR = 60;
export const COLUMN = 10;

// How many sessions parseLog has read. summarize uses it for the header.
export let sessionsRead = 0;

// ---- reading the log -------------------------------------------------------

export function parseLine(line, lineNumber) {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 3) {
    throw new Error(`line ${lineNumber}: expected a date, a course and a duration, got "${line.trim()}"`);
  }
  const [date, course, durationText, ...note] = parts;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`line ${lineNumber}: "${date}" is not a date (YYYY-MM-DD)`);
  }
  const minutes = Number(durationText);
  if (!Number.isInteger(minutes) || minutes <= 0) {
    throw new Error(`line ${lineNumber}: "${durationText}" is not a duration`);
  }
  return { date, course, minutes, note: note.join(" ") };
}

export function parseLog(text) {
  const entries = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) return;
    entries.push(parseLine(line, i + 1));
    sessionsRead++;
  });
  return entries;
}

// ---- adding it up ----------------------------------------------------------

export function totalsByCourse(entries) {
  const byCourse = new Map();
  for (const entry of entries) {
    byCourse.set(entry.course, (byCourse.get(entry.course) ?? 0) + entry.minutes);
  }
  return [...byCourse]
    .map(([course, minutes]) => ({ course, minutes }))
    .sort((a, b) => b.minutes - a.minutes || a.course.localeCompare(b.course));
}

export function dateRange(entries) {
  if (entries.length === 0) return null;
  entries.sort((a, b) => a.date.localeCompare(b.date));
  return { first: entries[0].date, last: entries[entries.length - 1].date };
}

// ---- writing the report ----------------------------------------------------

export function formatMinutes(minutes) {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  return `${hours}h${String(rest).padStart(2, "0")}m`;
}

export function pad(text) {
  return text.padEnd(COLUMN);
}

export function summarize(text) {
  const entries = parseLog(text);
  const totals = totalsByCourse(entries);
  const range = dateRange(entries);

  if (sessionsRead === 0) return "Study log · no sessions";

  const plural = sessionsRead === 1 ? "session" : "sessions";
  const lines = [`Study log · ${range.first} to ${range.last} · ${sessionsRead} ${plural}`];
  let total = 0;
  for (const { course, minutes } of totals) {
    lines.push(pad(course) + formatMinutes(minutes));
    total += minutes;
  }
  lines.push(pad("total") + formatMinutes(total));
  return lines.join("\n");
}
