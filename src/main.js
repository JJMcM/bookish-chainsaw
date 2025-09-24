import { dataset } from "./data.js";
import { createDashboard } from "./dashboard.js";

const controller = createDashboard(document, dataset);

const fileInput = document.getElementById("dataset-file");
const status = document.getElementById("import-status");

const setStatus = (message, variant = "idle") => {
  if (!status) {
    return;
  }
  status.textContent = message;
  if (variant === "idle") {
    delete status.dataset.state;
  } else {
    status.dataset.state = variant;
  }
};

if (fileInput) {
  fileInput.addEventListener("change", async (event) => {
    const target = event.target;
    const [file] = target.files ?? [];

    if (!file) {
      return;
    }

    try {
      setStatus(`Importing ${file.name}…`);
      const text = await file.text();
      const parsed = JSON.parse(text);
      const result = controller.loadDataset(parsed);
      setStatus(
        `Loaded ${file.name}. Reporting period: ${result.meta.reportingPeriod}.`,
        "success"
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Unable to import dataset: ${message}.`, "error");
    } finally {
      target.value = "";
    }
  });
}
