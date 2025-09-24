# Industrial Maintenance Dashboard

A lightweight, framework-free dashboard for plant maintenance leaders. It summarises crew throughput, backlog posture, predictive coverage, and safety activity across mechanical, electrical, and reliability disciplines—entirely offline.

## Getting Started

The dashboard runs entirely in the browser without a build step. You can open `index.html` directly or serve it from a simple static HTTP server for local development.

### Option 1: Open the HTML file directly

1. Double-click `index.html` (or open it via your browser’s `File > Open` menu).
2. All functionality works offline because the data is embedded in `src/data.js`.

### Option 2: Serve with Python (recommended for local iteration)

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000) and navigate to `index.html`.

> **Tip:** The dashboard works entirely offline. None of the workflows above require internet access, and all assets (fonts, data, styles) are bundled locally.

## Refreshing data offline

Maintenance analysts can load a JSON export (matching [`docs/data-contract.md`](docs/data-contract.md)) without touching the code:

1. From the sidebar, choose **Import offline data snapshot**.
2. Pick a JSON file that follows the documented schema.
3. The dashboard validates the payload, applies it instantly, and surfaces any warnings in the banner while you remain offline.

> The bundled dataset provides an industrial maintenance example for demo environments. Replace it by importing your own CMMS export or by editing `src/data.js` directly.

When you need to regenerate `src/data.js` from exports in an air-gapped environment, use the importer CLI:

```bash
# From the project root
node scripts/import-dataset.mjs --format json --input ./data/latest.json

# Or convert a directory of CSV sheets (meta.csv, departments.csv, metrics.csv, etc.)
node scripts/import-dataset.mjs --format csv --input ./data/offline-export

# Fail the run if warnings are encountered and emit JSON logs for auditing
node scripts/import-dataset.mjs --format csv --input ./data/offline-export \
  --fail-on-warning --log-format json > logs/import.jsonl
```

Add `--dry-run` to preview the generated module without writing to disk. Pass `--fail-on-warning` when integrating the importer into CI so data quality issues stop the pipeline. `--log-format json` emits structured log lines that can be archived alongside build artifacts. The importer runs the same validation logic used at runtime so warnings are surfaced immediately and written as comments at the top of `src/data.js`.

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

New contributors should start with [`docs/ONBOARDING.md`](docs/ONBOARDING.md) for a tour of the codebase, data flow, and suggested next steps.

## Customising the Dashboard

* Update `src/data.js` to reflect real metrics, project summaries, highlights, and meetings from your maintenance systems—or import a JSON snapshot at runtime.
* Adjust the cards or layout in `index.html` to match the views your stakeholders need most (e.g. swap projects for shutdown readiness trackers).
* Override the palette, typography, and shape tokens defined in the dataset theme or via CSS custom properties in `assets/styles.css` to align with brand guidelines.

## Code Quality Tooling

All verification runs without third-party dependencies so it can execute on air-gapped workstations:

* `npm run lint:js` executes `node --check` across the source, scripts, and test suites.
* `npm run lint:css` scans every stylesheet to ensure no remote fonts or imports slip in.
* `npm test` runs the lightweight DOM harness. Set `PUPPETEER_EXECUTABLE_PATH` (or `CHROMIUM_PATH`) to point at a local Chromium binary plus manually staged `puppeteer-core`/`@axe-core/puppeteer` packages to enable keyboard-flow and accessibility assertions.
* `npm run check` chains the linters and tests.
* `npm run ci` replicates the continuous-integration workflow (checks + packaging without regenerating the archive if validation fails).

### Packaging for distribution

Create a distributable archive that contains every offline asset:

```bash
npm run package
```

The command emits `dist/offline-dashboard.tar.gz` containing `index.html`, assets, source files, documentation, and the dataset contract. Copy the archive to any disconnected environment. The packaging script runs `npm run check` first so linting and tests must pass before an archive is produced.

## Testing

Automated regression coverage lives in `tests/`. The harness stubs a minimal DOM so rendering and validation can be asserted without browsers or network access:

```bash
# DOM-only checks
npm test

# Full suite with headless browser audits (requires installing optional dev dependencies)
PUPPETEER_EXECUTABLE_PATH=/path/to/chromium npm test
```

See [`docs/TEST_HARNESS_PLAN.md`](docs/TEST_HARNESS_PLAN.md) for the roadmap behind the integration tests and future expansion ideas.
