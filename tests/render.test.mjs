import assert from "node:assert/strict";
import { dataset } from "../src/data.js";
import { createDashboard } from "../src/dashboard.js";
import { validateDataset } from "../src/validation.js";
import { createMockDocument, MockElement } from "./support/mock-document.js";

const buildDocument = () => {
  const document = createMockDocument();

  const register = (selector, element) => document.register(selector, element);

  const trendContainer = register(".trend", new MockElement("div", document));
  const trendChart = new MockElement("div", document);
  trendChart.dataset.view = "chart";
  register("#trend-chart", trendChart);

  const trendTable = new MockElement("table", document);
  const trendTableBody = new MockElement("tbody", document);
  trendTable.append(trendTableBody);
  register("#trend-table", trendTable);
  register("#trend-table tbody", trendTableBody);

  trendContainer.append(trendChart, trendTable);

  register("#department-select", new MockElement("select", document));
  register("#stats-grid", new MockElement("div", document));
  register("#trend-context", new MockElement("span", document));
  register("#projects-list", new MockElement("ul", document));
  register("#projects-context", new MockElement("span", document));
  register("#highlights-list", new MockElement("ul", document));
  register("#highlights-context", new MockElement("span", document));
  register("#meetings-list", new MockElement("ul", document));
  register("#department-summary", new MockElement("p", document));
  register("#department-summary-card", new MockElement("section", document));
  register("#data-warnings", new MockElement("aside", document));
  register("#reporting-period", new MockElement("span", document));
  register("#last-updated", new MockElement("span", document));
  register("#refresh-guidance", new MockElement("p", document));
  register("#trend-toggle", new MockElement("button", document));

  return document;
};

test("dashboard renders default department data", () => {
  const document = buildDocument();
  const controller = createDashboard(document, dataset);

  const select = document.querySelector("#department-select");
  assert.equal(select.children.length, dataset.departments.length);

  const stats = document.querySelector("#stats-grid");
  assert.ok(stats.children.length > 0, "stats should render cards");

  const trendContainer = document.querySelector(".trend");
  assert.equal(trendContainer.dataset.view, "chart");

  const toggle = document.querySelector("#trend-toggle");
  toggle.dispatchEvent({ type: "click", target: toggle });
  assert.equal(trendContainer.dataset.view, "table");

  controller.teardown();
});

test("validation provides sane fallbacks", () => {
  const result = validateDataset({ meta: {}, departments: [{}] });
  assert.ok(result.warnings.length > 0, "warnings should be emitted for incomplete data");
  assert.equal(result.departments[0].metrics.length, 0);
  assert.equal(result.meta.reportingPeriod, "Not specified");
});

test("theme tokens are applied to the document root", () => {
  const document = buildDocument();
  const themedDataset = {
    meta: dataset.meta,
    departments: dataset.departments,
    theme: {
      palette: { background: "#101820" },
      typography: { base: '"Atkinson Hyperlegible", sans-serif' }
    }
  };

  createDashboard(document, themedDataset);

  const backgroundToken = document.documentElement.style.getPropertyValue("--color-background");
  assert.equal(backgroundToken, "#101820");
  const fontToken = document.documentElement.style.getPropertyValue("--font-family-base");
  assert.equal(fontToken, '"Atkinson Hyperlegible", sans-serif');
});

test("loadDataset applies new snapshot and preserves selection where possible", () => {
  const document = buildDocument();
  const controller = createDashboard(document, dataset);

  const select = document.querySelector("#department-select");
  select.value = dataset.departments[0].id;

  const newDataset = {
    meta: {
      reportingPeriod: "Week 20 · 2024",
      lastUpdated: "Manual import · May 12, 2024",
      refreshGuidance: "Test guidance"
    },
    departments: [
      {
        id: "demo",
        name: "Demo Department",
        summary: "Summary copy for demo dataset.",
        metrics: [],
        trend: { context: "", datapoints: [] },
        projects: { context: "", items: [] },
        highlights: { context: "", items: [] },
        meetings: []
      }
    ]
  };

  controller.loadDataset(newDataset);

  assert.equal(document.querySelector("#reporting-period").textContent, "Week 20 · 2024");
  assert.equal(document.querySelector("#department-summary").textContent, "Summary copy for demo dataset.");
  assert.equal(select.value, "demo");
  controller.teardown();
});
