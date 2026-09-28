// Task 6 — the dependency. These tests read package.json, package-lock.json and
// .gitignore as files. They never load picocolors, so they pass or fail the
// same with or without node_modules/.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const file = (name) => new URL(`../${name}`, import.meta.url);
const readJson = (name) => JSON.parse(readFileSync(file(name), "utf8"));

const pkg = readJson("package.json");
const asked = pkg.dependencies?.picocolors;

test("task 6: package.json lists picocolors under dependencies", () => {
  const where = pkg.devDependencies?.picocolors ? " It is under devDependencies — but cli.js needs it to run, not only to develop." : "";
  assert.ok(asked, `package.json has no "picocolors" under "dependencies".${where} Add it with npm, not by editing the file, so the lockfile is written too.`);
});

test("task 6: picocolors is pinned to one exact version, not a range", () => {
  assert.match(
    String(asked),
    /^\d+\.\d+\.\d+$/,
    `package.json asks for picocolors as ${JSON.stringify(asked)}. A pin is a bare version like 4.5.6; ` +
      "a ^ or ~ in front is a range that a future resolve may move within. Typing a version after @ " +
      "chooses what is installed today but still writes a range — which flag stops that? " +
      "(lesson: Adding and pinning a dependency, 'Pin a version exactly').",
  );
});

test("task 6: .gitignore keeps node_modules out and the lockfile in", () => {
  const ignored = readFileSync(file(".gitignore"), "utf8").split(/\r?\n/).map((line) => line.trim());
  assert.ok(ignored.some((line) => /^\/?node_modules\/?$/.test(line)), ".gitignore should list node_modules/ — it is rebuilt from the two files, never committed.");
  assert.ok(!ignored.some((line) => /package-lock\.json/.test(line)), ".gitignore lists package-lock.json. The lockfile is the record of what you got; it has to be committed for anyone else to get the same.");
});

test("task 6: package-lock.json exists", () => {
  assert.ok(existsSync(file("package-lock.json")), "There is no package-lock.json next to package.json. npm writes it when you install; commit it with package.json.");
});

test("task 6: the lockfile records the same request as package.json", () => {
  assert.ok(existsSync(file("package-lock.json")), "No package-lock.json yet — see the test above.");
  const lock = readJson("package-lock.json");
  assert.ok(lock.packages, 'The lockfile has no "packages" section. It was written by a very old npm; install again with the npm that comes with Node 22 or later.');
  const recorded = lock.packages[""]?.dependencies?.picocolors;
  assert.equal(
    recorded,
    asked,
    `package.json says ${JSON.stringify(asked)}, but the lockfile's own-project entry ("") says ${JSON.stringify(recorded)}. ` +
      "The two files were written at different times — was package.json edited by hand? Let npm write both, " +
      "then commit both.",
  );
});

test("task 6: the lockfile installed exactly the pinned version", () => {
  assert.ok(existsSync(file("package-lock.json")), "No package-lock.json yet — see the test above.");
  const lock = readJson("package-lock.json");
  const got = lock.packages?.["node_modules/picocolors"]?.version;
  assert.equal(
    got,
    asked,
    `package.json asks for ${JSON.stringify(asked)}; the lockfile says the version installed was ${JSON.stringify(got)}. ` +
      'Read "version" under "node_modules/picocolors" — that is what you got. Once package.json pins one ' +
      "exact version and npm has written both files, the two agree.",
  );
});
