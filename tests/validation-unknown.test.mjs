import assert from "node:assert/strict";
import { validateDataset } from "../src/validation.js";

const oversizedDepartments = Array.from({ length: 60 }, (_, index) => ({
  id: `dept-${index}`,
  name: `Dept ${index}`,
  summary: "",
  metrics: Array.from({ length: 80 }, (__, metricIndex) => ({
    label: `Metric ${metricIndex}`,
    value: metricIndex,
    suffix: "%",
    trend: { label: "", description: "" },
    extraMetricField: true
  })),
  trend: {
    context: "",
    datapoints: Array.from({ length: 400 }, (__, pointIndex) => ({
      label: `Day ${pointIndex}`,
      value: pointIndex,
      unknown: true
    })),
    extraTrendField: true
  },
  projects: {
    context: "",
    items: Array.from({ length: 250 }, (__, itemIndex) => ({
      title: `Project ${itemIndex}`,
      subtitle: "",
      meta: "",
      other: true
    })),
    unexpected: true
  },
  highlights: {
    context: "",
    items: [],
    unknown: true
  },
  meetings: Array.from({ length: 150 }, (__, meetingIndex) => ({
    title: `Meeting ${meetingIndex}`,
    description: "",
    time: "",
    somethingElse: true
  })),
  mysteryField: true
}));

test("validateDataset enforces limits and warns on unknown fields", () => {
  const result = validateDataset({
    schemaVersion: 99,
    meta: { lastUpdated: "", refreshGuidance: "", reportingPeriod: "", stray: true },
    departments: oversizedDepartments,
    extraTopLevel: true
  });

  assert.equal(result.departments.length, 50, "departments should be capped at 50");
  assert.ok(
    result.departments.every((dept) => dept.metrics.length <= 50),
    "metrics should be capped"
  );
  assert.ok(
    result.departments.every((dept) => dept.trend.datapoints.length <= 366),
    "trend datapoints should be capped"
  );
  assert.ok(
    result.departments.every((dept) => dept.projects.items.length <= 200),
    "project items should be capped"
  );
  assert.ok(
    result.departments.every((dept) => dept.meetings.length <= 100),
    "meetings should be capped"
  );

  const warningText = result.warnings.join(" ");
  assert.match(warningText, /schemaVersion/);
  assert.match(warningText, /unknown fields/);
});
