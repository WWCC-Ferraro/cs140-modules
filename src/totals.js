// totals.js — adding it up. Knows nothing about text: entries in, numbers out.
//
// Changes when: what we count changes.
// Promises (its exports): totalsByCourse and dateRange, and nothing else.

/**
 * Total minutes per course.
 *
 * @param {{ course: string, minutes: number }[]} entries
 * @returns {{ course: string, minutes: number }[]} one item per course, most
 *   minutes first; courses with equal minutes in alphabetical order. An empty
 *   array for no entries.
 * Does not change `entries`.
 */
export function totalsByCourse(entries) {
  throw new Error("not implemented");
}

/**
 * The first and last date that appear in the entries.
 *
 * @param {{ date: string }[]} entries  in any order
 * @returns {{ first: string, last: string } | null}  null for no entries
 * Does not change `entries` — not their contents, and not their order.
 */
export function dateRange(entries) {
  throw new Error("not implemented");
}
