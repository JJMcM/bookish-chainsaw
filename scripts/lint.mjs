#!/usr/bin/env node
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_DIRS = ["src", "tests", "scripts"];
const JS_EXTENSIONS = new Set([".js", ".mjs"]);

const execFileAsync = (file, args) =>
  new Promise((resolve, reject) => {
    execFile(file, args, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });

const walk = async (dir) => {
  const files = await readdir(dir);
  const collected = [];

  for (const file of files) {
    if (file === "node_modules" || file.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dir, file);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      collected.push(...(await walk(fullPath)));
    } else if (JS_EXTENSIONS.has(path.extname(fullPath))) {
      collected.push(fullPath);
    }
  }

  return collected;
};

const gatherFiles = async () => {
  const files = [];
  for (const dir of TARGET_DIRS) {
    const fullDir = path.join(ROOT, dir);
    try {
      const dirFiles = await walk(fullDir);
      files.push(...dirFiles);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
  return files;
};

const main = async () => {
  const files = await gatherFiles();
  if (!files.length) {
    console.log("No JavaScript files found to lint.");
    return;
  }

  let hasError = false;
  for (const file of files) {
    const relative = path.relative(ROOT, file);
    try {
      await execFileAsync(process.execPath, ["--check", file]);
      console.log(`✔ Syntax OK \`${relative}\``);
    } catch (result) {
      hasError = true;
      console.error(`✖ Syntax error in \`${relative}\``);
      if (result.stderr) {
        console.error(result.stderr.trim());
      } else if (result.error) {
        console.error(result.error.message);
      }
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
