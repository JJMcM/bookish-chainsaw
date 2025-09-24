# Industrial Maintenance Dashboard

A lightweight, framework-free dashboard for plant maintenance leaders. It summarises crew
throughput, backlog posture, predictive coverage, and safety activity across mechanical,
electrical, and reliability disciplines—entirely offline.

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

> **Tip:** The dashboard works entirely offline. None of the workflows above require internet
> access, and all assets (fonts, data, styles) are bundled locally.

## Refreshing Data Offline

Maintenance analysts can load a JSON export (matching [`docs/data-contract.md`](docs/data-contract.md))
without touching the code:

1. From the sidebar, choose **Import offline data snapshot**.
2. Pick a JSON file that follows the documented schema.
3. The dashboard validates the payload, applies it instantly, and surfaces any warnings in the
   banner while you remain offline.

> Snapshots up to **2 MB** import without blocking the UI. Larger files are rejected with a
> friendly error so the page stays responsive. Break huge exports into multiple departments or
> trim unused fields before retrying.

> The bundled dataset provides an industrial maintenance example for demo environments. Replace
> it by importing your own CMMS export or by editing `src/data.js` directly.

## Project Structure

```
├── assets/               # Styling, locally resolved fonts, and component tokens
├── docs/                 # Onboarding, data contracts, and test harness design notes
├── index.html            # Page shell with layout and semantic structure
├── scripts/              # Offline-friendly linting and packaging utilities
├── src/                  # Data set, renderers, and validation helpers
└── tests/                # Minimal DOM harness and regression checks
```

### Further Reading

New contributors should start with [`docs/ONBOARDING.md`](docs/ONBOARDING.md) for a tour of
the codebase, data flow, and suggested next steps.

## Customising the Dashboard

* Update `src/data.js` to reflect real metrics, project summaries, highlights, and
  meetings from your maintenance systems—or import a JSON snapshot at runtime.
* Adjust the cards or layout in `index.html` to match the views your stakeholders need
  most (e.g. swap projects for shutdown readiness trackers).
* Tweak the palette or component styling in `assets/styles.css` to align with brand
  guidelines.


## Code Quality Tooling

All verification runs without third-party dependencies so it can execute on air-gapped
workstations:

* `npm run lint:js` executes `node --check` across the source, scripts, and test suites.
* `npm run lint:css` scans every stylesheet to ensure no remote fonts or imports slip in.
* `npm test` runs the lightweight DOM harness to confirm renderers, validation logic, importer
  guards, and offline behaviour work—even for large datasets.
* `npm run check` chains the linters and tests.

Performance instrumentation is available via the browser console: look for
`dashboard:boot`, `dashboard:load`, and `dataset-import:*` measurements to compare tuning
iterations.

### Packaging for distribution

Create a distributable archive that contains the offline runtime (no development tooling):

```bash
npm run package
```

The command emits `dist/offline-dashboard.tar.gz` containing `index.html`, `assets/`, `src/`,
the README, and the dataset contract. Copy the archive to any disconnected environment. A
SHA-256 checksum prints at the end of the run so operators can verify integrity before
distribution.

## Testing

Automated regression coverage lives in `tests/`. The harness stubs a minimal DOM so rendering
and validation can be asserted without browsers or network access:

```bash
npm test
```

See [`docs/TEST_HARNESS_PLAN.md`](docs/TEST_HARNESS_PLAN.md) for expansion ideas if you later
introduce a richer testing stack.
