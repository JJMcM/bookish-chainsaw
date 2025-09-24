import { createMockDocument, MockElement } from "./mock-document.js";

export const buildDocument = () => {
  const document = createMockDocument();
  const register = (selector, element) => document.register(selector, element);

  const trendContainer = register(".trend", new MockElement("div", document));
  const trendChart = new MockElement("div", document);
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
  register("#import-status", new MockElement("p", document));
  register("#dataset-file", new MockElement("input", document));

  return document;
};
