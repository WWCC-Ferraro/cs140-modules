// loans.js — library loans. Illustrative code for review: an AI assistant
// wrote it when asked to "split the library code into loans and fines".
//
// It also proposed two setup changes, which are in the pull request too:
//
//   package.json   "dependencies": { "dayjs": "latest" }
//   .gitignore     node_modules/
//                  package-lock.json

import { fineFor } from "./fines.js";

export const DAY_MS = 24 * 60 * 60 * 1000;

export const loans = [];

export function checkOut(title, borrower, today) {
  if (!title || !borrower) throw new Error("a loan needs a title and a borrower");
  const loan = { title, borrower, due: today + 14 * DAY_MS };
  loans.push(loan);
  return loan;
}

export function overdue(today, options = {}) {
  return loans
    .filter((loan) => loan.due < today)
    .map((loan) => ({ ...loan, fine: fineFor(loan, today, options) }));
}
