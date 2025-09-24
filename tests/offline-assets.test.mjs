import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const TARGET_EXTENSIONS = new Set([".html", ".js", ".mjs"]);

const gatherFiles = async (entry) => {
  const results = [];
  const entryStat = await stat(entry);
  if (entryStat.isDirectory()) {
    const entries = await readdir(entry);
    for (const child of entries) {
      const childPath = path.join(entry, child);
      const childStat = await stat(childPath);
      if (childStat.isDirectory()) {
        results.push(...(await gatherFiles(childPath)));
      } else if (TARGET_EXTENSIONS.has(path.extname(child))) {
        results.push(childPath);
      }
    }
  } else if (TARGET_EXTENSIONS.has(path.extname(entry))) {
    results.push(entry);
  }
  return results;
};

const REMOTE_PATTERN = /https?:\/\/[^\s"']+/gi;
const LOCAL_ALLOWLIST = [/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?/i];

const isAllowed = (url) => LOCAL_ALLOWLIST.some((pattern) => pattern.test(url));

test("runtime assets avoid remote network dependencies", async () => {
  const roots = [path.join(ROOT, "index.html"), path.join(ROOT, "src"), path.join(ROOT, "tests")];
  const files = [];
  for (const root of roots) {
    files.push(...(await gatherFiles(root)));
  }

  const offenders = [];
  for (const file of files) {
    const contents = await readFile(file, "utf8");
    const matches = contents.match(REMOTE_PATTERN);
    if (matches) {
      const disallowed = matches.filter((match) => !isAllowed(match));
      if (disallowed.length > 0) {
        offenders.push({ file: path.relative(ROOT, file), sample: disallowed[0] });
      }
    }
  }

  assert.equal(
    offenders.length,
    0,
    offenders.length
      ? `Remote URL detected in: ${offenders
          .map((offender) => `${offender.file} (${offender.sample})`)
          .join(", ")}`
      : ""
  );
});
