# Offline Dataset Contract

The dashboard loads a static JavaScript module (`src/data.js`) that exports a `dataset`
object. When preparing a new offline snapshot, ensure the payload respects the structure
below so the validation layer can provide meaningful feedback instead of failing silently.

```ts
interface DashboardDataset {
  meta: {
    reportingPeriod: string;     // e.g. "Week 32 · 2024"
    lastUpdated: string;         // e.g. "Manual import · Aug 5, 2024 09:00"
    refreshGuidance: string;     // Guidance displayed in the footer
  };
  departments: Department[];
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
```

## Preparing a new snapshot

1. Update the meta block with the period and timestamp that correspond to the exported data.
2. Replace the department array with the latest metrics and narratives from your systems.
3. Run `npm run check` to let the offline validators confirm the structure is sound.
4. Either:
   * Import the JSON payload directly through the dashboard’s **Import offline data snapshot**
     control, or
   * Commit the updated `src/data.js` and regenerate the offline bundle with `npm run package`.

## Validation behaviour

If optional fields are missing or arrays are empty, the UI falls back to friendly placeholder
copy and the warnings banner displays the issues detected during boot or import. Validation
never throws away data—it sanitises inputs to the closest safe defaults so the dashboard remains
usable while surfacing problems for follow-up.
