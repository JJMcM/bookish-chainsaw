import assert from "node:assert/strict";
import { createDashboard } from "../src/dashboard.js";
import { buildDocument } from "./support/build-document.js";

test("dashboard handles oversized sections with capped rendering", () => {
  const document = buildDocument();
  const dataset = {
    schemaVersion: 1,
    meta: { stray: true },
    extraTopLevel: true,
    departments: [
      {
        id: "bulk",
        name: "Bulk",
        summary: "",
        metrics: [],
        trend: { context: "", datapoints: [] },
        projects: {
          context: "",
          items: Array.from({ length: 220 }, (_, index) => ({
            title: `Project ${index}`,
            subtitle: "",
            meta: "",
            unknown: true
          }))
        },
        highlights: {
          context: "",
          items: [],
          unexpected: true
        },
        meetings: [],
        mystery: true
      }
    ]
  };

  const controller = createDashboard(document, dataset);

  const projectsList = document.querySelector("#projects-list");
  assert.equal(projectsList.children.length, 200, "projects should be limited to 200 items");

  const warningsRegion = document.querySelector("#data-warnings");
  assert.ok(warningsRegion.children.length > 0, "warnings should render when issues detected");
  const warningList = warningsRegion.children[0];
  assert.ok(warningList.children.length <= 6, "warnings should be truncated with summary");
  assert.equal(warningsRegion.getAttribute("data-state"), "visible");
  controller.teardown();
});
