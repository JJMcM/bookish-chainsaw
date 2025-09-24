import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));

const readHtml = async () => {
  return readFile(path.join(ROOT, "index.html"), "utf8");
};

test("shell provides accessible live regions", async () => {
  const html = await readHtml();
  assert.ok(html.includes("aria-live=\"polite\""), "aria-live should be present for meta updates");
  assert.ok(html.includes("role=\"status\""), "warnings banner should expose status role");
});

test("shell avoids remote font references", async () => {
  const html = await readHtml();
  assert.ok(!/https?:\/\/fonts.googleapis\.com/.test(html), "remote font providers should be removed");
});
