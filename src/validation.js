const ensureArray = (value) => (Array.isArray(value) ? value : []);

const coerceString = (value, fallback = "") =>
  typeof value === "string" && value.trim().length > 0 ? value : fallback;

const coerceNumber = (value, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const buildListItems = (items, { warnings, path }) =>
  ensureArray(items).map((item, index) => {
    if (!item || typeof item !== "object") {
      warnings.push(`${path}[${index}] is not an object; using fallback copy.`);
      return {
        title: "Unavailable",
        subtitle: "Item data could not be loaded.",
        meta: ""
      };
    }

    return {
      title: coerceString(item.title, "Untitled"),
      subtitle: coerceString(item.subtitle, "Details pending."),
      meta: coerceString(item.meta, "")
    };
  });

const buildMeetings = (items, { warnings, path }) =>
  ensureArray(items).map((item, index) => {
    if (!item || typeof item !== "object") {
      warnings.push(`${path}[${index}] is not an object; using fallback meeting.`);
      return {
        title: "TBD",
        description: "Meeting details unavailable.",
        time: ""
      };
    }

    return {
      title: coerceString(item.title, "TBD"),
      description: coerceString(item.description, "Details forthcoming."),
      time: coerceString(item.time, "Schedule pending")
    };
  });

const buildMetrics = (items, { warnings, path }) =>
  ensureArray(items).map((item, index) => {
    if (!item || typeof item !== "object") {
      warnings.push(`${path}[${index}] is not an object; using fallback metric.`);
      return {
        label: "Metric",
        value: 0,
        suffix: "",
        trend: { label: "", description: "" }
      };
    }

    const trend = item.trend && typeof item.trend === "object" ? item.trend : {};

    return {
      label: coerceString(item.label, `Metric ${index + 1}`),
      value: coerceNumber(item.value, 0),
      suffix: coerceString(item.suffix, ""),
      trend: {
        label: coerceString(trend.label, ""),
        description: coerceString(trend.description, "")
      }
    };
  });

const buildTrend = (trend, { warnings, path }) => {
  const source = trend && typeof trend === "object" ? trend : {};
  const datapoints = ensureArray(source.datapoints).map((point, index) => {
    if (!point || typeof point !== "object") {
      warnings.push(`${path}.datapoints[${index}] is not an object; using fallback value.`);
      return { label: `Point ${index + 1}`, value: 0 };
    }

    return {
      label: coerceString(point.label, `Point ${index + 1}`),
      value: coerceNumber(point.value, 0)
    };
  });

  if (datapoints.length === 0) {
    warnings.push(`${path}.datapoints is empty; chart will render placeholder values.`);
  }

  return {
    context: coerceString(source.context, ""),
    datapoints
  };
};

const sanitizeDepartment = (dept, index, warnings) => {
  if (!dept || typeof dept !== "object") {
    warnings.push(`Department at index ${index} is not an object; using fallback department.`);
    return {
      id: `dept-${index + 1}`,
      name: `Department ${index + 1}`,
      summary: "",
      metrics: [],
      trend: { context: "", datapoints: [] },
      projects: { context: "", items: [] },
      highlights: { context: "", items: [] },
      meetings: []
    };
  }

  const id = coerceString(dept.id, `dept-${index + 1}`);
  const name = coerceString(dept.name, `Department ${index + 1}`);

  return {
    id,
    name,
    summary: coerceString(dept.summary, ""),
    metrics: buildMetrics(dept.metrics, { warnings, path: `${id}.metrics` }),
    trend: buildTrend(dept.trend, { warnings, path: `${id}.trend` }),
    projects: {
      context: coerceString(dept.projects?.context, ""),
      items: buildListItems(dept.projects?.items, { warnings, path: `${id}.projects.items` })
    },
    highlights: {
      context: coerceString(dept.highlights?.context, ""),
      items: buildListItems(dept.highlights?.items, {
        warnings,
        path: `${id}.highlights.items`
      })
    },
    meetings: buildMeetings(dept.meetings, { warnings, path: `${id}.meetings` })
  };
};

export const validateDataset = (dataset) => {
  if (!dataset || typeof dataset !== "object") {
    throw new Error("Dashboard dataset must be an object.");
  }

  const warnings = [];
  const metaSource = dataset.meta && typeof dataset.meta === "object" ? dataset.meta : {};

  const reportingPeriod = coerceString(metaSource.reportingPeriod, "Not specified");
  if (reportingPeriod === "Not specified") {
    warnings.push("Meta.reportingPeriod is missing; displaying fallback copy.");
  }

  const lastUpdated = coerceString(metaSource.lastUpdated, "Unknown");
  if (lastUpdated === "Unknown") {
    warnings.push("Meta.lastUpdated is missing; displaying fallback copy.");
  }

  const refreshGuidance = coerceString(
    metaSource.refreshGuidance,
    "Import a new offline dataset to refresh the view."
  );
  if (refreshGuidance === "Import a new offline dataset to refresh the view." &&
    !metaSource.refreshGuidance)
  {
    warnings.push("Meta.refreshGuidance is missing; displaying default guidance.");
  }

  const rawDepartments = ensureArray(dataset.departments);
  if (rawDepartments.length === 0) {
    warnings.push("No departments supplied; dashboard will render placeholder content.");
  }

  const departments = rawDepartments.map((dept, index) =>
    sanitizeDepartment(dept, index, warnings)
  );

  if (departments.length === 0) {
    departments.push({
      id: "dept-1",
      name: "Department 1",
      summary: "",
      metrics: [],
      trend: { context: "", datapoints: [] },
      projects: { context: "", items: [] },
      highlights: { context: "", items: [] },
      meetings: []
    });
  }

  return {
    meta: { reportingPeriod, lastUpdated, refreshGuidance },
    departments,
    warnings
  };
};
