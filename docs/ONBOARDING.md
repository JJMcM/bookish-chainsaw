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
│   ├── data.js        # Source-of-truth metrics for each department
│   └── main.js        # Client-side rendering + interactivity layer
└── docs/
    └── ONBOARDING.md  # You are here
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

4. **Rendering logic (`src/main.js`)**
   * Imports the `departments` data and caches references to all mount points in the DOM.
   * Populates the department selector (`<select>`) from the data array during
     initialization.
   * Contains small renderer functions for each dashboard section (statistics cards,
     trend chart, projects list, highlights list, and meetings sidebar). Each renderer
     receives the current department object and updates only its slice of the UI.
   * Tracks the currently selected department via the dropdown’s change event and re-runs
     all renderers whenever the selection changes.

The renderers operate on plain DOM APIs rather than a framework so it is easy to follow
what happens. When a department is selected, the code clears existing child nodes in each
section and rebuilds the markup based on the new data set.

## Key Concepts to Understand

* **Data contracts** – Every department entry in `src/data.js` must provide the fields
  the renderers expect (`metrics`, `trend.datapoints`, `projects.items`, etc.). Keeping
  that schema stable ensures the UI will remain consistent.
* **Formatting helpers** – `formatValue` in `src/main.js` centralizes how numbers are
  displayed (thousands separators, percentage suffixes, minimum bar height), so extending
  the formatter is safer than sprinkling formatting logic across renderers.
* **Accessibility considerations** – The dashboard uses semantic HTML landmarks,
  provides `aria-label` attributes for chart regions, and sets text equivalents for data
  so screen readers can interpret the content. Continue that pattern for new components.

## Suggested Next Steps for Contributors

1. **Automate quality checks** – Introduce tooling such as Prettier, ESLint, or stylelint
   to enforce formatting and catch common issues before committing changes.
2. **Add tests** – Consider wiring up lightweight DOM snapshot tests (e.g., with Vitest or
   Jest + jsdom) to validate that renderer functions output the expected structures when
   data changes.
3. **Connect real data sources** – Replace the static data module with fetch calls to an
   internal API or CSV export so the dashboard reflects live information.
4. **Enhance visuals** – Explore integrating a charting library for more sophisticated
   trend visualizations or add drill-down views per metric card.
5. **Document contribution workflows** – Expand the README with coding standards,
   branching strategy, and review guidelines as the team grows.

Welcome aboard, and feel free to reach out to the maintainers if anything in this guide is
unclear or if you have ideas for improvements!
