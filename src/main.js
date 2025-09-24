import { dataset } from "./data.js";
import { createDashboard } from "./dashboard.js";

const MAX_IMPORT_BYTES = 2 * 1024 * 1024; // 2 MB guard for offline snapshots

const supportsPerformanceMarks =
  typeof performance !== "undefined" &&
  typeof performance.mark === "function" &&
  typeof performance.measure === "function";

const mark = (name, state) => {
  if (!supportsPerformanceMarks) {
    return;
  }

  performance.mark(`${name}:${state}`);
};

const measure = (name, startState, endState) => {
  if (!supportsPerformanceMarks) {
    return;
  }

  const start = `${name}:${startState}`;
  const end = `${name}:${endState}`;
  performance.measure(name, start, end);
  if (typeof performance.clearMarks === "function") {
    performance.clearMarks(start);
    performance.clearMarks(end);
  }
  if (typeof performance.clearMeasures === "function") {
    performance.clearMeasures(name);
  }
};

const parseJsonAsync = (text) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(JSON.parse(text));
      } catch (error) {
        reject(error);
      }
    }, 0);
  });

const formatBytes = (bytes) => {
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
};

export const initializeDashboard = (documentRef = document, initialDataset = dataset) => {
  const controller = createDashboard(documentRef, initialDataset);

  const fileInput = documentRef.getElementById("dataset-file");
  const status = documentRef.getElementById("import-status");

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

  const handleChange = async (event) => {
    const target = event.target;
    const [file] = target.files ?? [];

    if (!file) {
      return;
    }

    if (file.size > MAX_IMPORT_BYTES) {
      setStatus(
        `Dataset is too large (${formatBytes(file.size)}). Maximum supported size is ${formatBytes(
          MAX_IMPORT_BYTES
        )}.`,
        "error"
      );
      target.value = "";
      return;
    }

    try {
      setStatus(`Importing ${file.name}…`);
      mark("dataset-import", "read-start");
      const text = await file.text();
      mark("dataset-import", "read-end");
      mark("dataset-import", "parse-start");
      const parsed = await parseJsonAsync(text);
      mark("dataset-import", "parse-end");
      const result = controller.loadDataset(parsed);
      mark("dataset-import", "apply-end");
      measure("dataset-import:read", "read-start", "read-end");
      measure("dataset-import:parse", "parse-start", "parse-end");
      measure("dataset-import:total", "read-start", "apply-end");
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
  };

  if (fileInput) {
    fileInput.addEventListener("change", handleChange);
  }

  return {
    controller,
    teardown() {
      if (fileInput) {
        fileInput.removeEventListener("change", handleChange);
      }
      if (typeof controller.teardown === "function") {
        controller.teardown();
      }
    },
    setStatus
  };
};

if (typeof document !== "undefined" && typeof document.getElementById === "function") {
  initializeDashboard();
}
