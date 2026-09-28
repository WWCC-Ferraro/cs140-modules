// parse.js — reading the log. The one module that knows what a log line looks like.
//
// Changes when: the log format changes.
// Promises (its exports): parseLog, and nothing else.

/**
 * Reads a study log and returns one entry per session, in file order.
 *
 * A session line is:   <date> <course> <duration> [note ...]
 *   date      YYYY-MM-DD
 *   course    one word
 *   duration  whole minutes above 0, such as 45   (task 5 widens this)
 *   note      the rest of the line, words joined by single spaces; may be empty
 *
 * Blank lines, and lines whose first non-space character is #, are skipped.
 *
 * @param {string} text  the whole log
 * @returns {{ date: string, course: string, minutes: number, note: string }[]}
 * @throws {Error} for a line it cannot read. The message starts with
 *   "line N:" — N counts every line of the file from 1, skipped ones included —
 *   and quotes the part it could not read.
 */
export function parseLog(text) {
  throw new Error("not implemented");
}
