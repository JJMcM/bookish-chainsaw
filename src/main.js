import { departments } from "./data.js";

const departmentSelect = document.querySelector("#department-select");
const statsGrid = document.querySelector("#stats-grid");
const trendChart = document.querySelector("#trend-chart");
const trendContext = document.querySelector("#trend-context");
const projectsList = document.querySelector("#projects-list");
const projectsContext = document.querySelector("#projects-context");
const highlightsList = document.querySelector("#highlights-list");
const highlightsContext = document.querySelector("#highlights-context");
const meetingsList = document.querySelector("#meetings-list");

const formatValue = (value) => {
  if (typeof value === "number" && value >= 1000) {
    return value.toLocaleString();
  }

  if (typeof value === "number" && Number.isInteger(value)) {
    return value.toString();
  }

  if (typeof value === "number") {
    return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  }

  return value;
};

const populateDepartmentSelect = () => {
  departments.forEach((dept) => {
    const option = document.createElement("option");
    option.value = dept.id;
    option.textContent = dept.name;
    departmentSelect.append(option);
  });
};

const renderStats = (dept) => {
  statsGrid.innerHTML = "";

  dept.metrics.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "stat-card";

    const label = document.createElement("span");
    label.className = "stat-card__label";
    label.textContent = metric.label;

    const value = document.createElement("strong");
    value.className = "stat-card__value";
    value.textContent = `${formatValue(metric.value)}${metric.suffix ?? ""}`;

    const trend = document.createElement("span");
    trend.className = "stat-card__trend";
    trend.innerHTML = `<span>${metric.trend.label}</span>${metric.trend.description}`;

    card.append(label, value, trend);
    statsGrid.append(card);
  });
};

const renderTrend = (dept) => {
  const datapoints = dept.trend.datapoints;
  const maxValue = Math.max(...datapoints.map((point) => point.value));

  trendContext.textContent = dept.trend.context;
  trendChart.innerHTML = "";

  datapoints.forEach((point) => {
    const bar = document.createElement("div");
    bar.className = "trend-chart__bar";
    bar.dataset.label = point.label;

    const height = maxValue === 0 ? 0 : (point.value / maxValue) * 100;
    bar.style.height = `${Math.max(height, 8)}%`;

    const value = document.createElement("span");
    value.className = "trend-chart__value";
    value.textContent = formatValue(point.value);

    bar.append(value);
    trendChart.append(bar);
  });
};

const renderList = (container, items) => {
  container.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "list__item";

    const content = document.createElement("div");
    content.className = "list__content";

    const title = document.createElement("span");
    title.className = "list__title";
    title.textContent = item.title;

    const subtitle = document.createElement("span");
    subtitle.className = "list__subtitle";
    subtitle.textContent = item.subtitle;

    content.append(title, subtitle);

    const meta = document.createElement("span");
    meta.className = "list__meta";
    meta.textContent = item.meta;

    li.append(content, meta);
    container.append(li);
  });
};

const renderMeetings = (dept) => {
  meetingsList.innerHTML = "";
  dept.meetings.forEach((meeting) => {
    const item = document.createElement("li");
    item.className = "meeting";

    const title = document.createElement("span");
    title.className = "meeting__title";
    title.textContent = meeting.title;

    const description = document.createElement("span");
    description.className = "meeting__meta";
    description.textContent = meeting.description;

    const time = document.createElement("span");
    time.className = "meeting__meta";
    time.textContent = meeting.time;

    item.append(title, description, time);
    meetingsList.append(item);
  });
};

const setContexts = (dept) => {
  projectsContext.textContent = dept.projects.context;
  highlightsContext.textContent = dept.highlights.context;
};

const renderDepartment = (deptId) => {
  const department = departments.find((dept) => dept.id === deptId);
  if (!department) {
    console.error(`Department with id ${deptId} not found`);
    return;
  }

  document.title = `${department.name} · Workplace Operations Dashboard`;
  renderStats(department);
  renderTrend(department);
  renderList(projectsList, department.projects.items);
  renderList(highlightsList, department.highlights.items);
  renderMeetings(department);
  setContexts(department);
};

const handleSelectChange = (event) => {
  renderDepartment(event.target.value);
};

const init = () => {
  populateDepartmentSelect();
  departmentSelect.addEventListener("change", handleSelectChange);
  const defaultDepartment = departments[0];
  departmentSelect.value = defaultDepartment.id;
  renderDepartment(defaultDepartment.id);
};

init();
