# Study log, in modules

You are taking a small working program and giving it seams. It reads a study
log — one line per session — and prints how long you spent on each course:

```text
Study log · 2026-09-28 to 2026-10-01 · 6 sessions
cs140     1h40m
math      1h40m
english   0h50m
total     4h10m
```

Today the whole program is one file, `src/studylog.js`, and every name in it is
exported. You will split it into modules that each change for one reason. Each
module will promise only what its callers need. Then you will add one
third-party package and pin it, read the lockfile to see what you got, and
answer a question from the package's own documentation.

Very little is new. The program works when you start, and it works when you
finish. What changes is how much each part has to know about the
others. That is what this module is about.

## Getting started

1. Open **your repository**. It is made for you: private, and named for this
   homework, the term and your username — `<term>-cs140-modules-<you>`. On
   [this homework's page](https://wwcc.dev/#/lesson/modules-assignment), type your GitHub
   username and click **Open my Codespace**. On your own computer, clone it
   with GitHub Desktop (**Code**, then **Open with GitHub Desktop**) and check
   that `node --version` prints 22 or later. The lesson *How a homework works*
   walks through both.
2. Run the tests:

   ```bash
   npm test
   ```

   Most fail at first. A few pass already, because the empty modules already
   export the right names. To run one module's tests only, name the file:

   ```bash
   node --test test/parse.test.js
   ```

3. Run the program itself:

   ```bash
   npm run report
   ```

   That runs `node src/cli.js sample.log`. Run it after every task. It should
   print the same report each time.

Tasks 1–5 need nothing installed. Task 6 is where you install a package.

The tests also run on every push; the **Actions** tab on your repository shows
the result. Each failing test says what it expected, what came back, and which
lesson to look at. It does not say what to write.

## What is in the repository

| File | What it is |
|---|---|
| `src/studylog.js` | The whole program, in one file. It becomes the public face. |
| `src/parse.js`, `src/totals.js`, `src/report.js` | Empty modules, each with a comment saying what it promises. |
| `src/cli.js` | The program you run. Node only: it reads a file. |
| `sample.log` | A week of study sessions. |
| `test/` | The tests, one file per module. They are part of the spec. |
| `review/` | Someone else's code, for the review. |
| `REVIEW.md` | Where your review goes. |

## The seams

Your team has already agreed where the seams go. There are three reasons this
program changes, and each gets its own module:

| Module | Changes when | Promises |
|---|---|---|
| `parse.js` | the log's format changes | `parseLog` |
| `totals.js` | what we count changes | `totalsByCourse`, `dateRange` |
| `report.js` | the output's design changes | `formatReport` |
| `studylog.js` | never, ideally | `summarize` |

"Promises" means exports: each module exports those names and **nothing else**.
The tests check that. A module may hold as many other functions and constants as
it likes, as long as it does not export them.

Read the comment above each function in `src/` before you write it. It is the
contract. The old code does not meet every contract, so moving it is not always
enough.

## Using an AI assistant

`AGENTS.md` in this repository tells AI coding assistants how this course wants
them to help: as a tutor who explains errors, asks questions and gives hints,
not by writing your answers. Most assistants read it automatically. It is in
the open, so read it too. It says what good AI help looks like.

## The tasks

### 1. Cut out the parser

Move the log-reading code into `src/parse.js`. `parseLog` is the only export;
`parseLine` comes too, as a private helper.

Tests: `test/parse.test.js`, the tests named `task 1`.

### 2. Cut out the arithmetic

Move `totalsByCourse` and `dateRange` into `src/totals.js`. Check both against
their contracts. One of them breaks a promise its contract makes. Nothing
throws when it does.

Tests: `test/totals.test.js`.

### 3. Cut out the report

Write `formatReport` in `src/report.js`, from the old `summarize`. It takes a
summary object — how many sessions, the date range, the totals — and returns
text. It does not parse, and it does not add anything up. Its helpers stay
private. For now you can ignore the `style` parameter. That is task 6.

Tests: `test/report.test.js`, the tests named `task 3`.

### 4. Leave one face

Now rewrite `src/studylog.js` so it holds only `summarize`. It calls the other
three modules and exports nothing else. `cli.js` imports `summarize` and nothing
else, so it keeps working.

The old `summarize` has a bug that only shows on a second call. Find it before
you move it. Then watch for it coming back in a new form: a count kept in one
module and read by another. An exported `let` is a live binding, so every
importer sees whatever the owner last did to it (*Where to put the seam*). Hand
the number across as a value instead.

Tests: `test/studylog.test.js`, the tests named `task 4`. Run `npm run report`
again. Same report?

### 5. The format grows

People want to write durations the way the report prints them. From now on a
log line may give its duration in any of these forms:

| Written | Minutes |
|---|---|
| `90` | 90 |
| `45m` | 45 |
| `2h` | 120 |
| `1h40m` | 100 |

After the `h`, the minutes are 0 to 59. Anything else is an error that names
its line, as before.

The reading goes in `parse.js`. But the notation now lives in two places. The
report writes it and the parser reads it, and if one changes, the other must
too. **Decide where that knowledge goes.** The export tests still hold, so
`report.js` cannot start exporting a helper for `parse.js` to borrow. You could:

- put the notation in a small module of its own, which both import;
- keep writing in `report.js` and reading in `parse.js`, each private;
- or something else you can defend.

There is no single right answer. There is a wrong one: a cycle, or a promise
that grew just so another module could reach in. Explain your choice in
**Your answers**, question 1.

Add a line in the new notation to `sample.log`, and run the program.

Tests: the tests named `task 5`.

### 6. Add a dependency, and pin it

The report should be easier to read in a terminal: header and total in **bold**.
You will use [picocolors](https://www.npmjs.com/package/picocolors), a small
package with no dependencies of its own.

1. Add `picocolors` as a dependency with npm, **pinned to one exact version**.
   In `package.json` it must be a bare version, with no `^` or `~`. If you have
   already installed it with a range, install it again, pinned. Do not edit
   `package.json` by hand; let npm write it and the lockfile together.
2. Commit **both** `package.json` and `package-lock.json`. `node_modules/` stays
   out, and `.gitignore` already says so.
3. Make the report bold without `report.js` knowing picocolors exists.
   `formatReport(summary, style)` takes a `style` object with a `bold`
   function. It passes the first line and the total line through `style.bold`.
   With no style, the text stays plain. `summarize(text, style)` passes the
   style on. Only `cli.js` imports picocolors, and hands it inward — the
   picocolors object has a `bold` function, so it fits.
4. Give `cli.js` a `--plain` flag, so `node src/cli.js sample.log --plain`
   prints no colour codes, even in a terminal. Find how in **picocolors' own documentation**, for the version your lockfile
   says you have. Not a forum, not an AI answer: the package's README. Then
   answer question 3 below.

Tests: `test/dependency.test.js`, and the tests named `task 6`. The dependency
tests read `package.json`, `package-lock.json` and `.gitignore` as files. None of
them loads picocolors, so they give the same answer with or without
`node_modules/`.

Once a `package-lock.json` is committed, the workflow runs `npm ci` before the
tests. It installs exactly what the lockfile says, and stops with an error if
the lockfile and `package.json` disagree. After the tests it runs the program
on `sample.log`, so a dependency you use but never installed shows up there
too.

## Your answers

Answer each in two to four sentences, under its question. A person reads these.

**1. Where did the duration notation go, and why there?** Name one change to the
notation someone might ask for, and say which files it would touch in your
version.

> Your answer.

**2. Which version of picocolors did you get?** Copy the lockfile entry that
says so: the key and its `"version"` line. Then: a teammate clones your
repository a year from now, after a newer picocolors is out, and runs `npm ci`.
Which version do they get, and which file decides it?

> Your answer.

**3. How does `--plain` turn colour off?** Quote the line of picocolors'
documentation you used, and link to it. Say how you know that page describes
the version in your lockfile, and not only the newest one.

> Your answer.

**4. Why does `report.js` take a style instead of importing picocolors?** Say
what would change about testing `report.js`, and about its promise, if it
imported the package itself.

> Your answer.

## The review

`review/loans.js` and `review/fines.js` are code an AI assistant wrote when
asked to split some library code into two modules. The header of `loans.js`
also shows two setup changes it proposed. It is illustrative code, written for
this review.

It has problems, of the kinds this module is about, and at least one from
earlier in the course. Find at least three. For each one, write in `REVIEW.md`:

- **where** — the file and the lines;
- **what goes wrong** — in terms of what the code does, not only what it looks
  like;
- **a concrete input or command that shows it** — something the author could
  run and see fail;
- **the fix**.

You can run the review code yourself. This is a start:

```bash
node -e 'import("./review/loans.js")'
```

Finish with a short summary for the author. The tests do not check `REVIEW.md`.
A person reads it.

## What done means

- `npm test` passes, locally and in the **Actions** tab.
- `npm run report` prints the report, and `node src/cli.js sample.log --plain`
  prints it with no colour codes.
- `package.json` and `package-lock.json` are both committed, and agree.
- The four answers above are filled in.
- `REVIEW.md` has at least three problems and a summary.
