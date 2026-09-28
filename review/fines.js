// fines.js — what a late loan costs. Written with loans.js; see its header.

import { DAY_MS } from "./loans.js";

const GRACE_MS = 2 * DAY_MS; // two days' grace before a fine starts

// options.rate is dollars per day late; the library's usual rate is 0.25.
export function fineFor(loan, today, options = {}) {
  const rate = options.rate || 0.25;
  const late = today - loan.due - GRACE_MS;
  if (late <= 0) return 0;
  return Math.ceil(late / DAY_MS) * rate;
}
