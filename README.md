# E2E and eval workbench

This project shows how unit tests, integration tests, browser tests, smoke tests, and evals work together.

Open the published guide at <https://e2e-eval-workbench.pages.dev/>.

## Run it

```bash
npm install
npx playwright install chromium
npm start
```

Open `http://127.0.0.1:4173`.

## Run the checks

```bash
npm run test:unit
npm run test:integration
npm run eval
npm run test:e2e
```

Use `npm run check` to run every pre-deployment quality gate.

Build the self-contained HTML guide:

```bash
npm run build:artifact
```

Run the smoke test against a running deployment:

```bash
BASE_URL=http://127.0.0.1:4173 npm run test:smoke
```

## What each check proves

| Check | Scope | Main evidence |
|---|---|---|
| Unit | One function | Business rules return exact results |
| Integration | API and store | Components exchange valid data |
| End-to-end | Browser to API | A user can finish the main workflow |
| Eval | Dataset and grader | Product behavior meets a score threshold |
| Smoke | Running deployment | The main page and health route respond |

No check proves the complete system is correct. Each check reduces a different risk.

## Included learning files

- `artifact/e2e-eval-workbench.html` is the self-contained guide.
- `video/task-lab-demo.mp4` is the narrated browser demonstration.
- `evals/framework/core.mjs` grades criteria and calculates suite scores.
- `evals/framework/http-adapter.mjs` runs backend eval steps.
- `evals/framework/browser-adapter.mjs` runs UI eval steps.
- `evals/suites/backend.json` defines the backend eval dataset.
- `evals/suites/ui.json` defines the UI eval dataset.
- `reports/evals/report.json` contains the latest machine-readable eval report.
- `.github/workflows/ci.yml` runs the checks in CI.

## Reuse the eval framework

1. Copy `evals/framework` into a project.
2. Add backend and UI suite JSON files under `evals/suites`.
3. Define actions, captured evidence, graders, and weights in each case.
4. Call `runSuite` for each adapter.
5. Call `createReport` with the required score threshold.

The framework includes `equals`, `includes`, `matches`, and `truthy` graders. A required suite fails the complete gate when its score is below its threshold.
