import assert from "node:assert/strict";
import { dataset } from "../src/data.js";
import { createDashboard } from "../src/dashboard.js";
import { validateDataset } from "../src/validation.js";
import { buildDocument } from "./support/build-document.js";

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

test("validation injects placeholder department when none provided", () => {
  const result = validateDataset({ meta: {}, departments: [] });
  assert.equal(result.departments.length, 1);
  assert.equal(result.departments[0].id, "dept-1");
  assert.equal(
    result.departments[0].name,
    "Department 1",
    "fallback department should use predictable name"
  );
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
