# Dashboard Test Harness Plan

This document tracks the evolution of the automated test harness that ships with the Workplace
Operations Dashboard. The current stack combines a bespoke Node-based runner, a mock DOM, and an
optional headless-browser layer (Puppeteer + axe-core) so UI and data changes can be validated
before every release. The roadmap below outlines additional improvements if you decide to grow the
suite further. The approach favours minimal tooling, fast feedback, and tests that reflect how real
users see the dashboard.

## Goals

* Provide a repeatable way to verify that core rendering logic still produces the correct DOM
  when department data changes.
* Validate the data contract (`src/data.js`) so new entries or edits do not break required
  fields.
* Keep the workflow lightweight so contributors can run tests locally without complex build
  tooling.

## Tooling Overview

> The repository currently ships with bespoke tooling. The stack below captures a future-looking
> option if you choose to standardise on community libraries.

* **Node.js 18+** – runtime for the tooling; recommend using `nvm` or Volta to manage versions.
* **Vitest** – fast unit test runner with zero-config TypeScript support if needed later.
* **jsdom** – simulated browser environment for DOM APIs so renderers can be tested without a
  real browser.
* **@testing-library/dom** – ergonomic queries that reflect how users find elements, helping to
  avoid brittle selectors.
* **Zod (optional but recommended)** – schema validation library for asserting data shapes.

These dependencies remain dev-only; the production bundle (static HTML/CSS/JS) stays untouched.

## Repository Additions

1. `package.json` with scripts:
   * `test` – runs `vitest` in watchless mode.
   * `test:watch` – runs `vitest --watch` for iterative development.
2. `vitest.config.js` – minimal config that:
   * Sets `environment: "jsdom"`.
   * Configures the test root to `src/` (or `tests/` if separating files).
3. `tests/` directory containing:
   * `rendering.test.js` – exercises renderer functions in `src/main.js` against fixture data.
   * `data-contract.test.js` – validates that `departments` from `src/data.js` matches the
     expected schema.
   * `__fixtures__/` – reusable sample data variations (e.g., departments with missing fields,
     trend spikes) to drive tests.
4. `.gitignore` entries for `node_modules/` and Vitest output if not already present.

## Test Coverage Strategy

### 1. Rendering Smoke Tests

* Import `renderDashboard` (or individual renderer functions) from `src/main.js`.
* Use `document.body.innerHTML = fs.readFileSync("index.html", "utf8")` or build a minimal
  template string representing the key mount points.
* Mount the dashboard with default data and assert that:
  * The department selector contains all department names.
  * Key sections (`#stats-grid`, `#projects-list`, `#highlights-list`, `#meetings-list`) render
    the expected number of items.
  * Trend cards display formatted values using `formatValue`.
* Use Testing Library queries (`screen.getByRole`, `getByText`, etc.) so tests mirror user
  interactions.

### 2. Interaction Tests

* Simulate a change event on the department `<select>` element.
* Verify that the UI updates to show the selected department’s metrics.
* Confirm that no stale DOM nodes remain from the previous selection (e.g., lists are cleared
  before re-rendering).

### 3. Data Contract Tests

* Define a Zod schema that describes a department object (metrics array, trend object,
  projects array, etc.).
* Assert that `departments` passes the schema.
* Add negative tests using fixtures with missing/incorrect fields to ensure validation fails
  with helpful error messages.

### 4. Formatting and Helper Tests

* Unit test helper functions like `formatValue` to confirm rounding rules and suffixes.
* Cover edge cases (zero values, negative trends, extremely large numbers).

### 5. Visual Regression (Optional Later)

If the project grows, consider pairing Vitest with [`@vitest/ui`](https://vitest.dev/guide/ui.html)
for local inspection or introducing `happy-dom` screenshots. For now, focus on DOM assertions
rather than pixel comparisons to keep the harness fast.

## Developer Workflow

1. Install dependencies:

   ```bash
   npm install --save-dev vitest jsdom @testing-library/dom zod
   ```

2. Run tests locally before committing:

   ```bash
   npm test
   ```

3. (Optional) Keep tests running during UI tweaks:

   ```bash
   npm run test:watch
   ```

## Continuous Integration

* Add a GitHub Actions workflow (e.g., `.github/workflows/test.yml`) that installs Node 18,
  caches `node_modules`, and runs `npm test` on every pull request.
* This ensures data updates or UI refactors cannot be merged without passing automated checks.

## Next Steps

1. Introduce `package.json` and install the dev dependencies listed above.
2. Extract reusable renderer logic from `src/main.js` into functions that can be imported into
   test files (if not already exported).
3. Build the initial set of smoke tests for rendering and data validation.
4. Iterate on coverage as the dashboard evolves, prioritising new UI components or data flows.

By following this plan, the team gains confidence that modifications to dashboard data or UI do
not introduce regressions, while keeping the development experience lightweight and fast.
