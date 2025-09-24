import { formatValue } from "./utils/format.js";
import { validateDataset } from "./validation.js";

const MIN_BAR_HEIGHT = 8;

const requireElement = (documentRef, selector, description) => {
  const element = documentRef.querySelector(selector);
  if (!element) {
    throw new Error(`Unable to find ${description} using selector ${selector}`);
  }
  return element;
};

const clearElement = (element) => {
  if ("innerHTML" in element) {
    element.innerHTML = "";
  }
};

const renderList = (container, items, emptyCopy) => {
  clearElement(container);

  if (!items.length) {
    const empty = container.ownerDocument.createElement("li");
    empty.className = "list__item list__item--empty";
    empty.textContent = emptyCopy;
    container.append(empty);
    return;
  }

  items.forEach((item) => {
    const li = container.ownerDocument.createElement("li");
    li.className = "list__item";

    const content = container.ownerDocument.createElement("div");
    content.className = "list__content";

    const title = container.ownerDocument.createElement("span");
    title.className = "list__title";
    title.textContent = item.title;

    const subtitle = container.ownerDocument.createElement("span");
    subtitle.className = "list__subtitle";
    subtitle.textContent = item.subtitle;

    content.append(title, subtitle);

    const meta = container.ownerDocument.createElement("span");
    meta.className = "list__meta";
    meta.textContent = item.meta;

    li.append(content, meta);
    container.append(li);
  });
};

const renderMeetings = (container, meetings) => {
  clearElement(container);

  if (!meetings.length) {
    const empty = container.ownerDocument.createElement("li");
    empty.className = "meeting meeting--empty";
    empty.textContent = "No meetings scheduled.";
    container.append(empty);
    return;
  }

  meetings.forEach((meeting) => {
    const item = container.ownerDocument.createElement("li");
    item.className = "meeting";

    const title = container.ownerDocument.createElement("span");
    title.className = "meeting__title";
    title.textContent = meeting.title;

    const description = container.ownerDocument.createElement("span");
    description.className = "meeting__meta";
    description.textContent = meeting.description;

    const time = container.ownerDocument.createElement("span");
    time.className = "meeting__meta";
    time.textContent = meeting.time;

    item.append(title, description, time);
    container.append(item);
  });
};

const renderStats = (documentRef, container, metrics) => {
  clearElement(container);

  if (!metrics.length) {
    const empty = documentRef.createElement("p");
    empty.textContent = "No metrics available.";
    container.append(empty);
    return;
  }

  metrics.forEach((metric) => {
    const card = documentRef.createElement("article");
    card.className = "stat-card";

    const label = documentRef.createElement("span");
    label.className = "stat-card__label";
    label.textContent = metric.label;

    const value = documentRef.createElement("strong");
    value.className = "stat-card__value";
    value.textContent = `${formatValue(metric.value)}${metric.suffix ?? ""}`;

    const trend = documentRef.createElement("span");
    trend.className = "stat-card__trend";
    const trendLabel = documentRef.createElement("span");
    trendLabel.textContent = metric.trend.label;
    trend.append(trendLabel, documentRef.createTextNode(metric.trend.description));

    card.append(label, value, trend);
    container.append(card);
  });
};

const renderTrendChart = (documentRef, chart, datapoints) => {
  clearElement(chart);

  if (!datapoints.length) {
    chart.dataset.empty = "true";
    chart.textContent = "Trend data unavailable for this department.";
    return;
  }

  delete chart.dataset.empty;
  const maxValue = Math.max(...datapoints.map((point) => point.value), 0);

  datapoints.forEach((point) => {
    const bar = documentRef.createElement("div");
    bar.className = "trend-chart__bar";
    bar.dataset.label = point.label;

    const height = maxValue === 0 ? MIN_BAR_HEIGHT : Math.max((point.value / maxValue) * 100, MIN_BAR_HEIGHT);
    bar.style.height = `${height}%`;

    const value = documentRef.createElement("span");
    value.className = "trend-chart__value";
    value.textContent = formatValue(point.value);

    bar.append(value);
    chart.append(bar);
  });
};

const renderTrendTable = (documentRef, tableBody, datapoints) => {
  clearElement(tableBody);

  if (!datapoints.length) {
    const row = documentRef.createElement("tr");
    const cell = documentRef.createElement("td");
    cell.setAttribute("colspan", "2");
    cell.textContent = "No trend data available.";
    row.append(cell);
    tableBody.append(row);
    return;
  }

  datapoints.forEach((point) => {
    const row = documentRef.createElement("tr");
    const labelCell = documentRef.createElement("th");
    labelCell.setAttribute("scope", "row");
    labelCell.textContent = point.label;

    const valueCell = documentRef.createElement("td");
    valueCell.textContent = formatValue(point.value);

    row.append(labelCell, valueCell);
    tableBody.append(row);
  });
};

const renderWarnings = (region, warnings, documentRef) => {
  clearElement(region);
  if (!warnings.length) {
    region.removeAttribute("data-state");
    return;
  }

  const list = documentRef.createElement("ul");
  warnings.forEach((warning) => {
    const item = documentRef.createElement("li");
    item.textContent = warning;
    list.append(item);
  });
  region.append(list);
  region.setAttribute("data-state", "visible");
};

export const createDashboard = (documentRef, rawDataset) => {
  if (!documentRef || typeof documentRef.querySelector !== "function") {
    throw new Error("A document with querySelector support is required.");
  }

  const elements = {
    departmentSelect: requireElement(documentRef, "#department-select", "department select"),
    statsGrid: requireElement(documentRef, "#stats-grid", "stats grid"),
    trendChart: requireElement(documentRef, "#trend-chart", "trend chart"),
    trendContext: requireElement(documentRef, "#trend-context", "trend context label"),
    trendTableBody: requireElement(documentRef, "#trend-table tbody", "trend table body"),
    projectsList: requireElement(documentRef, "#projects-list", "projects list"),
    projectsContext: requireElement(documentRef, "#projects-context", "projects context"),
    highlightsList: requireElement(documentRef, "#highlights-list", "highlights list"),
    highlightsContext: requireElement(documentRef, "#highlights-context", "highlights context"),
    meetingsList: requireElement(documentRef, "#meetings-list", "meetings list"),
    dataWarnings: requireElement(documentRef, "#data-warnings", "warnings region"),
    reportingPeriod: requireElement(documentRef, "#reporting-period", "reporting period field"),
    lastUpdated: requireElement(documentRef, "#last-updated", "last updated field"),
    refreshGuidance: requireElement(documentRef, "#refresh-guidance", "refresh guidance field"),
    trendContainer: requireElement(documentRef, ".trend", "trend container"),
    trendToggle: requireElement(documentRef, "#trend-toggle", "trend toggle button")
  };

  const dataset = validateDataset(rawDataset);
  const state = {
    view: "chart",
    departments: dataset.departments,
    warnings: dataset.warnings
  };

  const setView = (view) => {
    state.view = view;
    elements.trendContainer.dataset.view = view;
    elements.trendToggle.setAttribute("aria-expanded", view === "table" ? "true" : "false");
    elements.trendToggle.textContent = view === "table" ? "View chart" : "View table";
  };

  const renderDepartment = (deptId) => {
    const department = state.departments.find((item) => item.id === deptId) ?? state.departments[0];
    if (!department) {
      return;
    }

    documentRef.title = `${department.name} · Workplace Operations Dashboard`;
    renderStats(documentRef, elements.statsGrid, department.metrics);
    elements.trendContext.textContent = department.trend.context || "";
    renderTrendChart(documentRef, elements.trendChart, department.trend.datapoints);
    renderTrendTable(documentRef, elements.trendTableBody, department.trend.datapoints);
    renderList(elements.projectsList, department.projects.items, "No initiatives listed.");
    elements.projectsContext.textContent = department.projects.context || "";
    renderList(
      elements.highlightsList,
      department.highlights.items,
      "No highlights have been captured."
    );
    elements.highlightsContext.textContent = department.highlights.context || "";
    renderMeetings(elements.meetingsList, department.meetings);
  };

  const populateDepartmentSelect = () => {
    clearElement(elements.departmentSelect);
    state.departments.forEach((dept) => {
      const option = documentRef.createElement("option");
      option.value = dept.id;
      option.textContent = dept.name;
      elements.departmentSelect.append(option);
    });
  };

  const handleDepartmentChange = (event) => {
    renderDepartment(event.target.value);
  };

  const handleToggleView = () => {
    setView(state.view === "chart" ? "table" : "chart");
  };

  const boot = () => {
    renderWarnings(elements.dataWarnings, state.warnings, documentRef);
    populateDepartmentSelect();

    elements.reportingPeriod.textContent = dataset.meta.reportingPeriod;
    elements.lastUpdated.textContent = dataset.meta.lastUpdated;
    elements.refreshGuidance.textContent = dataset.meta.refreshGuidance;

    elements.departmentSelect.addEventListener("change", handleDepartmentChange);
    elements.trendToggle.addEventListener("click", handleToggleView);

    const defaultDept = state.departments[0];
    if (defaultDept) {
      elements.departmentSelect.value = defaultDept.id;
      renderDepartment(defaultDept.id);
    }
    setView("chart");
  };

  boot();

  return {
    renderDepartment,
    setView,
    getState: () => ({ ...state }),
    teardown: () => {
      elements.departmentSelect.removeEventListener("change", handleDepartmentChange);
      elements.trendToggle.removeEventListener("click", handleToggleView);
    }
  };
};
