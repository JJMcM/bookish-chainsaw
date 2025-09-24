#!/usr/bin/env node
import { readFile, readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_DIRS = ["assets"];

const walkCss = async (dir) => {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dir, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      files.push(...(await walkCss(fullPath)));
    } else if (path.extname(fullPath) === ".css") {
      files.push(fullPath);
    }
  }

  return files;
};

const REMOTE_PATTERN = /url\(\s*(['"]?)(https?:)?\/\//gi;
const IMPORT_PATTERN = /@import\s+['"]https?:/gi;

const main = async () => {
  const files = [];
  for (const dir of TARGET_DIRS) {
    const abs = path.join(ROOT, dir);
    try {
      files.push(...(await walkCss(abs)));
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  if (!files.length) {
    console.log("No CSS files found to validate.");
    return;
  }

  let hasError = false;
  for (const file of files) {
    const contents = await readFile(file, "utf8");
    const remoteMatches = [...contents.matchAll(REMOTE_PATTERN)];
    const importMatches = [...contents.matchAll(IMPORT_PATTERN)];
    if (remoteMatches.length || importMatches.length) {
      hasError = true;
      console.error(`✖ Remote resource reference found in ${path.relative(ROOT, file)}`);
    } else {
      console.log(`✔ CSS offline-safe in ${path.relative(ROOT, file)}`);
    }
  }

  if (hasError) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
