# Workplace Operations Dashboard Onboarding Guide

Welcome to the Workplace Operations Dashboard project! This guide gives newcomers a
quick orientation to the codebase, explains how data flows through the application,
and highlights next areas to explore as you start contributing.

## Repository Layout

The project is intentionally lightweight—everything required to render the dashboard
lives in a handful of files:

```
├── index.html         # Semantic page shell and mount points
├── assets/
│   └── styles.css     # Global look-and-feel, layout, and component styles
├── src/
│   ├── data.js        # Source-of-truth dataset (meta + department details)
│   ├── dashboard.js   # Rendering orchestration & DOM bindings
│   ├── utils/         # Pure helpers (formatting, etc.)
│   └── validation.js  # Schema sanitisation and warning emission
├── scripts/           # Offline linting + packaging helpers
└── tests/             # Minimal DOM harness and regression checks
```

Because the site is completely static, there is no build tooling or dependency
installation required—opening `index.html` in a modern browser will execute the app.

## How the Dashboard Renders

1. **HTML skeleton (`index.html`)**
   * Defines the structural regions (header, sidebar, content area, footer).
   * Provides empty containers (`<section id="stats-grid">`, `<ul id="projects-list">`,
     etc.) that JavaScript later populates with department-specific data.
   * Loads the stylesheet and the JavaScript entry point (`src/main.js`).

2. **Styling layer (`assets/styles.css`)**
   * Implements a responsive CSS grid layout so the dashboard adapts from desktop to
     tablet widths.
   * Encapsulates reusable component classes (cards, statistic tiles, lists, trend chart)
     that the renderer applies when it constructs DOM elements.
   * Sets the overall visual system: typography, color palette, shadows, and spacing.

3. **Data module (`src/data.js`)**
   * Exports a single `departments` array. Each department object follows a consistent
     shape (metrics, trend, projects, highlights, meetings).
   * Updating this file is the fastest way to swap in real metrics or curate a different
     narrative for each team while the rest of the UI logic remains unchanged.

4. **Rendering controller (`src/dashboard.js`)**
   * Validates the dataset, stores warnings, and attaches DOM event handlers.
   * Renders each section (stats, trend chart + table, lists, meetings) via focused helper
     functions and exposes a `setView` method for toggling chart/table modes.
   * Drives the warnings banner and meta badges so data issues are surfaced to operators.

5. **Entry point (`src/main.js`)**
   * Imports the compiled `dataset` and simply calls `createDashboard(document, dataset)`.
   * The minimal shell keeps browser code lean and maximises reusability in tests.

6. **Validation layer (`src/validation.js`)**
   * Normalises any shape mismatches in the dataset so the UI never crashes on malformed
     input.
   * Emits human-readable warnings that appear in the dashboard banner.

7. **Testing harness (`tests/`)**
   * Provides a bespoke mock DOM implementation so renderers can be exercised without
     external libraries.
   * Includes HTML lint checks that guard against regressions (e.g., remote asset links).

The renderers operate on plain DOM APIs rather than a framework so it is easy to follow
what happens. When a department is selected, the code clears existing child nodes in each
section and rebuilds the markup based on the new data set.

## Key Concepts to Understand

* **Data contracts** – The validation layer sanitises bad input, but supplying complete
  objects keeps the UI richer and minimises warning noise. Refer to
  [`docs/data-contract.md`](./data-contract.md) when shaping new exports.
* **Formatting helpers** – `src/utils/format.js` centralises number formatting. Extend it
  instead of inlining formatting logic across renderers to preserve consistency.
* **Accessibility considerations** – Live regions, toggle controls, and chart fallbacks
  ensure the UI remains usable with assistive tech. Mirror this approach when adding
  features (e.g., always provide text alternatives and keyboard interactions).
* **Offline guardrails** – The CSS and scripts lint checks guarantee no remote resources
  are referenced. When adding assets, keep everything locally resolvable.

## Suggested Next Steps for Contributors

1. **Strengthen test coverage** – Expand the custom harness or integrate a headless
   browser to capture keyboard interaction flows and accessibility audits.
2. **Build an offline data ingestion CLI** – Script the transformation from CSV/JSON
   exports into the `dataset` module so updates remain reproducible.
3. **Refine visual theming** – Consider theming hooks (e.g., CSS custom property overrides)
   so downstream teams can reskin without editing component styles.
4. **Explore print/export views** – An offline PDF or printable layout helps share
   snapshots during reviews in disconnected environments.
5. **Codify contribution workflows** – Document branching, code review expectations, and
   release packaging steps as the contributor base grows.

Welcome aboard, and feel free to reach out to the maintainers if anything in this guide is
unclear or if you have ideas for improvements!
