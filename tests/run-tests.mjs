#!/usr/bin/env node
import { performance } from "perf_hooks";

const tests = [];

globalThis.test = (name, fn) => {
  tests.push({ name, fn });
};

const loadTests = async () => {
  const { readdir } = await import("node:fs/promises");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");

  const dirPath = fileURLToPath(new URL("./", import.meta.url));
  const files = await readdir(dirPath);
  const testFiles = files.filter((file) => file.endsWith(".test.mjs"));
  for (const file of testFiles) {
    await import(path.join(dirPath, file));
  }
};

const run = async () => {
  await loadTests();

  let failures = 0;
  for (const { name, fn } of tests) {
    const start = performance.now();
    try {
      await fn();
      const duration = (performance.now() - start).toFixed(2);
      console.log(`✔ ${name} (${duration}ms)`);
    } catch (error) {
      failures += 1;
      console.error(`✖ ${name}`);
      console.error(error.stack ?? error.message);
    }
  }

  if (!tests.length) {
    console.warn("No tests were executed.");
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
