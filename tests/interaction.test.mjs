import assert from "node:assert/strict";
import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json"
};

let warnedAboutSkip = false;
let cachedLaunch = null;
let cachedAxeBuilder = null;

const getExecutablePath = () =>
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  process.env.CHROMIUM_PATH ||
  process.env.CHROME_PATH ||
  null;

const createServer = () =>
  http.createServer(async (req, res) => {
    const requestPath = req.url === "/" ? "/index.html" : req.url;
    const candidatePath = path.join(ROOT, requestPath.replace(/^\/+/, ""));
    const normalizedPath = path.normalize(candidatePath);

    if (!normalizedPath.startsWith(ROOT)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
      return;
    }

    try {
      const contents = await readFile(normalizedPath);
      const ext = path.extname(normalizedPath);
      const type = MIME_TYPES[ext] ?? "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      res.end(contents);
    } catch (error) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  });

const withBrowserPage = async (callback) => {
  if (!cachedLaunch || !cachedAxeBuilder) {
    try {
      if (!cachedLaunch) {
        const puppeteer = await import("puppeteer-core");
        cachedLaunch = puppeteer.launch;
      }
      if (!cachedAxeBuilder) {
        const axe = await import("@axe-core/puppeteer");
        cachedAxeBuilder = axe.default ?? axe.AxePuppeteer;
      }
    } catch (error) {
      if (!warnedAboutSkip) {
        console.warn(
          "Skipping headless browser integration tests. Provision offline copies of puppeteer-core and @axe-core/puppeteer to enable them."
        );
        warnedAboutSkip = true;
      }
      return { skipped: true };
    }
  }

  const executablePath = getExecutablePath();
  if (!executablePath) {
    if (!warnedAboutSkip) {
      console.warn(
        "Skipping headless browser integration tests. Set PUPPETEER_EXECUTABLE_PATH to point at a locally staged Chromium build."
      );
      warnedAboutSkip = true;
    }
    return { skipped: true };
  }

  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await cachedLaunch({ executablePath, headless: "new" });
  const page = await browser.newPage();

  try {
    await callback({ page, baseUrl });
    return { skipped: false };
  } finally {
    await page.close();
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
};

const ensureBrowser = async (callback) => {
  const result = await withBrowserPage(callback);
  return result;
};

test("keyboard users can toggle the trend view", async () => {
  const result = await ensureBrowser(async ({ page, baseUrl }) => {
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle0" });
    await page.focus("#department-select");
    await page.keyboard.press("Tab");

    const activeId = await page.evaluate(() => document.activeElement?.id ?? "");
    assert.equal(activeId, "trend-toggle");

    const initialView = await page.evaluate(
      () => document.querySelector(".trend")?.dataset.view
    );
    assert.equal(initialView, "chart");

    await page.keyboard.press("Space");
    await page.waitForFunction(
      () => document.querySelector(".trend")?.dataset.view === "table"
    );
    const toggledView = await page.evaluate(
      () => document.querySelector(".trend")?.dataset.view
    );
    assert.equal(toggledView, "table");
  });

  if (result.skipped) {
    return;
  }
});

test("page passes axe-core accessibility audit", async () => {
  const result = await ensureBrowser(async ({ page, baseUrl }) => {
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle0" });
    const { violations } = await new cachedAxeBuilder({ page }).analyze();

    const formatted = violations
      .map((violation) => {
        const targets = violation.nodes
          .map((node) => (Array.isArray(node.target) ? node.target.join(" ") : String(node.target)))
          .join(", ");
        return `${violation.id}: ${targets}`;
      })
      .join("\n");

    assert.equal(
      violations.length,
      0,
      formatted.length ? `Accessibility violations found:\n${formatted}` : undefined
    );
  });

  if (result.skipped) {
    return;
  }
});
