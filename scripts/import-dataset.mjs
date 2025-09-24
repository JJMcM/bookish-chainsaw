#!/usr/bin/env node
import { readFile, writeFile, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { validateDataset } from "../src/validation.js";

const ROOT_DIR = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const DEFAULT_OUTPUT = path.join(ROOT_DIR, "src", "data.js");

const THEME_FILENAME = "theme.json";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = { format: null, input: null, output: DEFAULT_OUTPUT, dryRun: false };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case "--format":
        options.format = args[i + 1]?.toLowerCase() ?? null;
        i += 1;
        break;
      case "--input":
        options.input = args[i + 1] ?? null;
        i += 1;
        break;
      case "--output":
        options.output = args[i + 1] ?? DEFAULT_OUTPUT;
        i += 1;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--help":
      case "-h":
        return { help: true };
      default:
        if (!options.input) {
          options.input = arg;
        }
    }
  }

  return options;
};

const printHelp = () => {
  console.log(`Offline dataset importer\n\nUsage: node scripts/import-dataset.mjs --format <json|csv> --input <path> [--output <path>] [--dry-run]\n\nExamples:\n  node scripts/import-dataset.mjs --format json --input data/dataset.json\n  node scripts/import-dataset.mjs --format csv --input data/offline-export\n`);
};

const ensureFileExists = async (targetPath) => {
  try {
    await access(targetPath, fsConstants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const parseCsvRow = (line) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
};

const parseCsv = async (filePath) => {
  const raw = await readFile(filePath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvRow(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvRow(line);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });
    return record;
  });
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const buildFromCsv = async (directory) => {
  const metaPath = path.join(directory, "meta.csv");
  const departmentsPath = path.join(directory, "departments.csv");

  if (!(await ensureFileExists(metaPath)) || !(await ensureFileExists(departmentsPath))) {
    throw new Error(
      "CSV import requires meta.csv and departments.csv to be present within the input directory."
    );
  }

  const metaRows = await parseCsv(metaPath);
  const meta = metaRows.reduce((acc, row) => {
    if (row.key) {
      acc[row.key] = row.value ?? "";
    }
    return acc;
  }, {});

  const departmentRows = await parseCsv(departmentsPath);
  const departments = departmentRows.map((row) => ({
    id: row.id,
    name: row.name,
    summary: row.summary,
    metrics: [],
    trend: { context: row.trendContext, datapoints: [] },
    projects: { context: row.projectsContext, items: [] },
    highlights: { context: row.highlightsContext, items: [] },
    meetings: []
  }));

  const departmentLookup = new Map(departments.map((dept) => [dept.id, dept]));

  const ingestSection = async (fileName, handler) => {
    const sectionPath = path.join(directory, fileName);
    if (!(await ensureFileExists(sectionPath))) {
      return;
    }
    const rows = await parseCsv(sectionPath);
    rows.forEach(handler);
  };

  await ingestSection("metrics.csv", (row) => {
    const target = departmentLookup.get(row.departmentId);
    if (!target) {
      return;
    }
    target.metrics.push({
      label: row.label,
      value: toNumber(row.value),
      suffix: row.suffix,
      trend: {
        label: row.trendLabel,
        description: row.trendDescription
      }
    });
  });

  await ingestSection("trend-points.csv", (row) => {
    const target = departmentLookup.get(row.departmentId);
    if (!target) {
      return;
    }
    target.trend.datapoints.push({
      label: row.label,
      value: toNumber(row.value)
    });
  });

  await ingestSection("projects.csv", (row) => {
    const target = departmentLookup.get(row.departmentId);
    if (!target) {
      return;
    }
    target.projects.items.push({
      title: row.title,
      subtitle: row.subtitle,
      meta: row.meta
    });
  });

  await ingestSection("highlights.csv", (row) => {
    const target = departmentLookup.get(row.departmentId);
    if (!target) {
      return;
    }
    target.highlights.items.push({
      title: row.title,
      subtitle: row.subtitle,
      meta: row.meta
    });
  });

  await ingestSection("meetings.csv", (row) => {
    const target = departmentLookup.get(row.departmentId);
    if (!target) {
      return;
    }
    target.meetings.push({
      title: row.title,
      description: row.description,
      time: row.time
    });
  });

  let theme = null;
  const themePath = path.join(directory, THEME_FILENAME);
  if (await ensureFileExists(themePath)) {
    const themeContent = await readFile(themePath, "utf8");
    theme = JSON.parse(themeContent);
  }

  return { meta, departments, theme };
};

const buildFromJson = async (filePath) => {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents);
};

const createModuleSource = ({ meta, departments, theme }, warnings) => {
  const metaLiteral = JSON.stringify(meta, null, 2);
  const departmentsLiteral = JSON.stringify(departments, null, 2);
  const themeLiteral = theme === null ? "null" : JSON.stringify(theme, null, 2);

  const warningBanner = warnings.length
    ? `// Data quality warnings emitted during import:\n// ${warnings.join("\n// ")}\n\n`
    : "";

  return `${warningBanner}export const dashboardMeta = ${metaLiteral};\n\nexport const departments = ${departmentsLiteral};\n\nexport const dashboardTheme = ${themeLiteral};\n\nexport const dataset = {\n  meta: dashboardMeta,\n  departments,\n  theme: dashboardTheme\n};\n`;
};

const run = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  if (!options.input) {
    throw new Error("An --input path is required.");
  }

  const format = options.format ?? (options.input.endsWith(".json") ? "json" : "csv");
  let raw;
  if (format === "json") {
    raw = await buildFromJson(path.resolve(options.input));
  } else if (format === "csv") {
    raw = await buildFromCsv(path.resolve(options.input));
  } else {
    throw new Error(`Unsupported format: ${format}`);
  }

  const { meta, departments, theme, warnings } = (() => {
    const result = validateDataset(raw);
    return { meta: result.meta, departments: result.departments, theme: result.theme?.source ?? null, warnings: result.warnings };
  })();

  const moduleSource = createModuleSource(
    { meta, departments, theme },
    warnings
  );

  if (options.dryRun) {
    console.log(moduleSource);
    return;
  }

  await writeFile(path.resolve(options.output), moduleSource, "utf8");
  console.log(`Dataset module updated at ${options.output}`);
  if (warnings.length) {
    console.warn("Warnings:");
    warnings.forEach((warning) => console.warn(`- ${warning}`));
  }
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
