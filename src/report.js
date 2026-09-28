// report.js — writing the report. Knows how the output looks, and nothing about
// where the numbers came from.
//
// Changes when: the output's design changes.
// Promises (its exports): formatReport, and nothing else.

/**
 * The report, as text.
 *
 *   Study log · 2026-09-28 to 2026-10-01 · 6 sessions
 *   cs140     1h40m
 *   math      1h40m
 *   english   0h50m
 *   total     4h10m
 *
 * Line 1 names the date range and the number of sessions ("1 session" for one).
 * With no sessions the whole report is the one line "Study log · no sessions".
 * Then one line per course, in the order given, and a total line. Each label is
 * padded with spaces to 10 characters; a duration is hours, "h", minutes as two
 * digits, "m".
 *
 * @param {{ sessions: number,
 *           range: { first: string, last: string } | null,
 *           totals: { course: string, minutes: number }[] }} summary
 * @param {{ bold: (text: string) => string }} [style]  task 6: applied to the
 *   first line and the total line. Leaving it out means plain text.
 * @returns {string}  lines joined with "\n", no trailing newline
 */
export function formatReport(summary, style) {
  throw new Error("not implemented");
}
