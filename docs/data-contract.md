# Offline Dataset Contract

The dashboard loads a static JavaScript module (`src/data.js`) that exports a `dataset` object. When preparing a new offline snapshot, ensure the payload respects the structure below so the validation layer can provide meaningful feedback instead of failing silently.

```ts
interface DashboardDataset {
  meta: {
    reportingPeriod: string;     // e.g. "Week 32 · 2024"
    lastUpdated: string;         // e.g. "Manual import · Aug 5, 2024 09:00"
    refreshGuidance: string;     // Guidance displayed in the footer
  };
  departments: Department[];
  theme?: ThemeOverrides;        // Optional palette/typography tokens applied at runtime
}

interface Department {
  id: string;                    // Unique identifier used for filtering
  name: string;                  // Display name in the filter dropdown
  summary?: string;              // Optional narrative summary
  metrics: Array<{
    label: string;
    value: number;
    suffix?: string;             // Optional text appended to the value (%, days, etc.)
    trend: {
      label: string;             // Short direction indicator (↑ 2, ↓ 1, ↗ 0.4)
      description: string;       // Context sentence fragment
    };
  }>;
  trend: {
    context: string;             // Describes what the chart is plotting
    datapoints: Array<{
      label: string;             // Typically day of week
      value: number;             // Numeric value plotted in the chart and table
    }>;
  };
  projects: {
    context: string;
    items: Array<ListItem>;
  };
  highlights: {
    context: string;
    items: Array<ListItem>;
  };
  meetings: Array<{
    title: string;
    description: string;
    time: string;
  }>;
}

interface ListItem {
  title: string;
  subtitle: string;
  meta: string;
}

interface ThemeOverrides {
  palette?: {
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    border?: string;
    text?: string;
    muted?: string;
    accent?: string;
    accentMuted?: string;
    accentSoft?: string;
    alert?: string;
  };
  typography?: {
    base?: string;
    heading?: string;
    weightHeading?: string | number;
    weightStrong?: string | number;
    bodySize?: string | number;
    headingScale?: string | number;
  };
  shape?: {
    radiusLg?: string;
    radiusMd?: string;
    radiusSm?: string;
    shadowSm?: string;
    shadowMd?: string;
  };
}
```

## Preparing a new snapshot

1. Export a JSON snapshot that matches `DashboardDataset` or produce the CSV sheets outlined below (`meta.csv`, `departments.csv`, `metrics.csv`, `trend-points.csv`, `projects.csv`, `highlights.csv`, `meetings.csv`).
2. Run the importer to regenerate `src/data.js`:

   ```bash
   node scripts/import-dataset.mjs --format json --input ./data/latest.json
   # or
   node scripts/import-dataset.mjs --format csv --input ./data/offline-export
   # fail on warnings and emit structured logs when running in CI
   node scripts/import-dataset.mjs --format csv --input ./data/offline-export \
     --fail-on-warning --log-format json > logs/import.jsonl
   ```

3. Review the warnings emitted by the importer (they are also written as comments to the top of `src/data.js`). Pass `--fail-on-warning` to stop the process when quality issues are detected and archive the JSON log output for auditing.
4. Execute `npm run check` to validate the full workflow and `npm run package` to rebuild the distributable archive. Packaging will refuse to proceed until the linting and tests succeed.
5. During manual validation you can also import the JSON payload directly through the dashboard’s **Import offline data snapshot** control for a quick smoke test.

## CSV sheet layout

The CSV importer expects the following files within the provided directory:

| File | Required Columns | Notes |
| --- | --- | --- |
| `meta.csv` | `key`, `value` | Keys should be `reportingPeriod`, `lastUpdated`, `refreshGuidance`. |
| `departments.csv` | `id`, `name`, `summary`, `trendContext`, `projectsContext`, `highlightsContext` | Context columns are optional but help populate copy. |
| `metrics.csv` | `departmentId`, `label`, `value`, `suffix`, `trendLabel`, `trendDescription` | `value` should be numeric. |
| `trend-points.csv` | `departmentId`, `label`, `value` | One row per datapoint in the chart/table. |
| `projects.csv` | `departmentId`, `title`, `subtitle`, `meta` | |
| `highlights.csv` | `departmentId`, `title`, `subtitle`, `meta` | |
| `meetings.csv` | `departmentId`, `title`, `description`, `time` | |
| `theme.csv` (optional) | `section`, `token`, `value` | Allows setting palette/typography/shape overrides without editing JS. |

Rows referencing unknown department IDs are ignored with warnings so the dataset remains usable.

## Validation behaviour

If optional fields are missing or arrays are empty, the UI falls back to friendly placeholder copy and the warnings banner displays the issues detected during boot or import. Validation never throws away data—it sanitises inputs to the closest safe defaults so the dashboard remains usable while surfacing problems for follow-up. Theme overrides are applied only when values are valid CSS tokens; invalid entries are skipped with warnings.
