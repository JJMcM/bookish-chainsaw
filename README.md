# Workplace Operations Dashboard

A lightweight, framework-free dashboard that highlights the health of workplace teams. It
summarises metrics, trend lines, upcoming meetings, and narrative highlights across
Operations, Engineering, People Operations, and Workplace Experience departments.

## Getting Started

The dashboard runs entirely in the browser without a build step. You can open `index.html`
directly or serve it from a simple static HTTP server for local development.

### Option 1: Open the HTML file directly

1. Double-click `index.html` (or open it via your browser’s `File > Open` menu).
2. All functionality works offline because the data is embedded in `src/data.js`.

### Option 2: Serve with Python (recommended for local iteration)

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) and navigate to
`index.html`.

### Option 3: Use `npx serve`

If you have Node.js installed:

```bash
npx serve .
```

## Project Structure

```
├── assets/
│   └── styles.css        # Global styling for layout, cards, and charts
├── index.html            # Page shell with layout and semantic structure
├── src/
│   ├── data.js           # Sample data describing each department
│   └── main.js           # UI rendering + interactivity (filters, charts)
```

### Further Reading

New contributors should start with [`docs/ONBOARDING.md`](docs/ONBOARDING.md) for a tour of
the codebase, data flow, and suggested next steps.

## Customising the Dashboard

* Update `src/data.js` to reflect real metrics, project summaries, highlights, and
  meetings from your workplace systems.
* Adjust the cards or layout in `index.html` to match the views your stakeholders need
  most (e.g. swap projects for staffing forecasts).
* Tweak the palette or component styling in `assets/styles.css` to align with brand
  guidelines.

## Next Ideas

* Wire up real APIs or CSV exports by replacing the static data module with fetch calls.
* Add authentication and role-based views once you host it behind a lightweight backend.
* Introduce charts (e.g. with D3 or Chart.js) for richer visuals or historical analysis.

## Testing

There are no automated tests yet. Visual inspection in the browser ensures the layout and
interactions behave as expected across screen sizes.

To introduce automated coverage, follow the [Dashboard Test Harness Plan](docs/TEST_HARNESS_PLAN.md).
It describes how to adopt Vitest with a jsdom environment so rendering and data-contract
regressions can be caught before shipping.
