import assert from "node:assert/strict";
import { initializeDashboard } from "../src/main.js";
import { buildDocument } from "./support/build-document.js";

test("oversized dataset import surfaces error state", async () => {
  const document = buildDocument();
  globalThis.document = document;

  const status = document.querySelector("#import-status");
  const input = document.querySelector("#dataset-file");

  const fakeFile = {
    name: "too-big.json",
    size: 3 * 1024 * 1024,
    async text() {
      return "{}";
    }
  };

  input.files = [fakeFile];

  const { teardown } = initializeDashboard(document);

  const handler = input.listeners.get("change");
  await handler({ target: input, type: "change" });

  assert.match(status.textContent, /Dataset is too large/);
  assert.equal(status.dataset.state, "error");

  teardown();
  delete globalThis.document;
});

test("invalid JSON import reports failure", async () => {
  const document = buildDocument();
  globalThis.document = document;

  const status = document.querySelector("#import-status");
  const input = document.querySelector("#dataset-file");

  const fakeFile = {
    name: "broken.json",
    size: 1024,
    async text() {
      return "{not valid}";
    }
  };

  input.files = [fakeFile];

  const { teardown } = initializeDashboard(document);

  const handler = input.listeners.get("change");
  await handler({ target: input, type: "change" });

  assert.match(status.textContent, /Unable to import dataset/);
  assert.equal(status.dataset.state, "error");

  teardown();
  delete globalThis.document;
});
