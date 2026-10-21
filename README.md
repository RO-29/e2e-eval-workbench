# E2E and Eval Workbench

| Item | Value |
|---|---|
| Purpose | Learn tests and evals with one small task application |
| Runtime | Node.js 22 |
| UI runner | Playwright with Chromium |
| Eval gate | `0.90` |
| Live guide | <https://e2e-eval-workbench.pages.dev/> |
| License | No license file |

This project shows how to check a UI and a backend.

It includes unit tests, integration tests, browser tests, smoke tests, and weighted evals. The eval framework uses JSON files, so you can replace the task application with your product.

## 1. What you will run

The sample product is a task application. A user can create a task, select a priority, and complete the task.

The project checks the product at five levels:

| Check | What it runs | What it proves |
|---|---|---|
| Unit test | One JavaScript function | A small rule returns the exact result |
| Integration test | HTTP API and in-memory store | The backend parts exchange valid data |
| E2E test | Chromium, UI, API, and store | A user can finish the main workflow |
| Eval | UI or backend adapter, cases, and graders | Product behavior reaches a score threshold |
| Smoke test | A running URL | The main page and health route respond |

No single check proves that the complete product is correct. Each check detects a different type of problem.

## 2. Requirements

Install these tools before you start:

- Node.js 22
- npm
- Git

Check the versions:

```bash
node --version
npm --version
git --version
```

The Node.js result must start with `v22`.

## 3. Install the project

Clone the repository:

```bash
git clone git@github.com:RO-29/e2e-eval-workbench.git
cd e2e-eval-workbench
```

Install the JavaScript packages:

```bash
npm install
```

Install Chromium for Playwright:

```bash
npx playwright install chromium
```

You only need to install the packages and Chromium once.

## 4. Start the sample application

Start the server:

```bash
npm start
```

The server prints this result:

```text
Task Lab is ready at http://127.0.0.1:4173
```

Open <http://127.0.0.1:4173> in a browser.

Keep this terminal open while you use the application. Press `Control+C` to stop the server.

The automated eval and E2E commands start their own server. You do not need to start the server before those commands.

## 5. Run all checks

Run the complete local quality gate:

```bash
npm run check
```

This command runs these checks in order:

1. Unit and integration tests.
2. Backend and UI evals.
3. Browser E2E tests.
4. The self-contained HTML guide build.

The command stops when a required check fails. A successful run exits with status code `0`.

## 6. Run one check type

Use these commands when you want a smaller result:

| Command | Result |
|---|---|
| `npm run test:unit` | Runs the domain and eval-framework unit tests |
| `npm run test:integration` | Runs the real HTTP API integration tests |
| `npm run test` | Runs all unit and integration tests |
| `npm run eval` | Runs the backend and UI eval suites |
| `npm run test:e2e` | Runs the browser workflow tests |
| `npm run build:artifact` | Builds the self-contained learning guide |
| `npm run video` | Records the sample browser demonstration |

## 7. Read the unit and integration result

Run:

```bash
npm run test
```

A successful result ends with values similar to these values:

```text
tests 8
pass 8
fail 0
skipped 0
```

Read the values as follows:

| Field | Meaning |
|---|---|
| `tests` | Total number of test cases |
| `pass` | Test cases that produced the expected result |
| `fail` | Test cases that produced a wrong result or an error |
| `skipped` | Test cases that did not run |

The check passes only when `fail` is `0`. Review skipped tests because they provide no evidence.

A failed test shows the test name, the actual value, and the expected value. Start with the first failed test because later failures can have the same cause.

## 8. Run and read the eval result

Run both eval suites:

```bash
npm run eval
```

The runner does this work:

1. It starts the real task server on an available local port.
2. It starts headless Chromium.
3. It runs the backend suite through HTTP requests.
4. It runs the UI suite through browser actions.
5. It grades all captured evidence.
6. It writes `reports/evals/report.json`.
7. It closes the browser and server.

A successful report starts with data similar to this example:

```json
{
  "score": 1,
  "threshold": 0.9,
  "passed": true,
  "totals": {
    "suites": 2,
    "cases": 6,
    "criteria": 13,
    "earned": 21,
    "available": 21
  }
}
```

Read the top-level fields as follows:

| Field | Meaning |
|---|---|
| `score` | Total earned weight divided by total available weight |
| `threshold` | Minimum required score for the complete eval run |
| `passed` | Final gate result |
| `totals.suites` | Number of UI and backend suites |
| `totals.cases` | Number of scenarios |
| `totals.criteria` | Number of individual behavior rules |
| `totals.earned` | Weight from criteria that passed |
| `totals.available` | Weight from all criteria |

The score formula is:

```text
score = earned weight / available weight
```

The current successful result is:

```text
21 / 21 = 1.00
```

The required score is:

```text
0.90
```

The complete eval gate passes only when both conditions are true:

- The total score is at least `0.90`.
- Every required suite reaches its own threshold and has no execution error.

## 9. Read one eval case

Each suite contains cases. Each case contains criteria.

This result shows one criterion:

```json
{
  "id": "status",
  "description": "The API returns HTTP 201.",
  "path": "responses.create.status",
  "actual": 201,
  "expected": 201,
  "weight": 2,
  "earned": 2,
  "passed": true
}
```

Read it in this order:

1. `description` states the required behavior.
2. `path` identifies the captured evidence.
3. `actual` shows what the product did.
4. `expected` shows the rule.
5. `weight` shows the importance of the rule.
6. `earned` is the weight received by the rule.
7. `passed` is the rule result.

If the criterion fails, `earned` is `0`. Compare `actual` with `expected` to find the behavior difference.

If `executionError` has a value, the adapter could not complete the case. Check the server, selector, URL, and browser action before you change a grader.

## 10. Read the E2E result

Run:

```bash
npm run test:e2e
```

A successful result ends with this type of line:

```text
2 passed (1.1s)
```

Playwright writes its HTML report to:

```text
reports/playwright/index.html
```

Open the report after a failure:

```bash
npx playwright show-report reports/playwright
```

The configuration keeps a trace, screenshot, and video for failed browser tests. Use the trace first. It shows browser actions, page state, requests, console messages, and errors.

## 11. Run and read the smoke test

Start the application in the first terminal:

```bash
npm start
```

Run the smoke test in a second terminal:

```bash
BASE_URL=http://127.0.0.1:4173 npm run test:smoke
```

A successful result is:

```text
Smoke checks passed.
```

You can check a deployed site by changing `BASE_URL`:

```bash
BASE_URL=https://your-site.example.com npm run test:smoke
```

The smoke test checks the `/health` route, the home-page response, and the page title.

## 12. Eval framework structure

The framework has four layers:

```text
JSON suite -> adapter -> grader -> report
```

| Layer | File | Responsibility |
|---|---|---|
| Suite | `evals/suites/backend.json` | Defines backend steps and criteria |
| Suite | `evals/suites/ui.json` | Defines browser steps and criteria |
| HTTP adapter | `evals/framework/http-adapter.mjs` | Runs HTTP requests and captures responses |
| Browser adapter | `evals/framework/browser-adapter.mjs` | Runs browser actions and captures UI evidence |
| Core grader | `evals/framework/core.mjs` | Grades criteria and calculates scores |
| Runner | `evals/run.mjs` | Starts dependencies and creates the final report |

The adapter collects evidence. The grader compares that evidence with a rule. The report records each decision.

## 13. Available graders

Use one grader for each criterion:

| Grader | Use | Example |
|---|---|---|
| `equals` | The actual value must equal the expected value | HTTP status equals `201` |
| `includes` | Text must contain the expected text | Error includes `at least 3` |
| `matches` | Text must match a regular expression | Identifier matches a format |
| `truthy` | The value must exist or equal true | Response contains a created object |

The `path` field uses dot notation. For example, `responses.create.status` reads `status` from the captured `create` response.

## 14. Add a backend eval case

Open `evals/suites/backend.json`.

Add one case to the `cases` array:

```json
{
  "id": "list-tasks",
  "name": "Task list is available",
  "steps": [
    {
      "key": "list",
      "method": "GET",
      "path": "/api/tasks"
    }
  ],
  "criteria": [
    {
      "id": "status",
      "description": "The API returns HTTP 200.",
      "path": "responses.list.status",
      "weight": 2,
      "grader": {
        "type": "equals",
        "expected": 200
      }
    }
  ]
}
```

Run the suite:

```bash
npm run eval
```

Find `list-tasks` in `reports/evals/report.json`. Check its score and criteria.

## 15. Add a UI eval case

Open `evals/suites/ui.json`.

UI cases use these actions:

| Action | Purpose |
|---|---|
| `goto` | Open a path |
| `fill` | Enter text in a labeled field |
| `select` | Select an option |
| `click` | Click a button or element |
| `waitForText` | Wait for an asynchronous UI update |
| `captureText` | Save visible text as evidence |
| `captureCount` | Save the number of matching elements |
| `captureClass` | Save an element class |

This example checks that the user can create a task:

```json
{
  "id": "create-task",
  "name": "User creates a task",
  "steps": [
    {
      "action": "goto",
      "path": "/"
    },
    {
      "action": "fill",
      "label": "Task title",
      "value": "Publish guide"
    },
    {
      "action": "click",
      "role": "button",
      "name": "Add task"
    },
    {
      "action": "waitForText",
      "selector": "#task-list",
      "value": "Publish guide"
    },
    {
      "action": "captureText",
      "key": "tasks",
      "selector": "#task-list"
    }
  ],
  "criteria": [
    {
      "id": "title",
      "description": "The new task is visible.",
      "path": "captures.tasks",
      "weight": 2,
      "grader": {
        "type": "includes",
        "expected": "Publish guide"
      }
    }
  ]
}
```

Use `waitForText` before a capture when a click starts an asynchronous request.

## 16. Use the framework in another project

1. Copy `evals/framework` into the target project.
2. Create one or more suite JSON files.
3. Keep product actions inside an adapter.
4. Keep behavior rules inside suite criteria.
5. Call `runSuite` for each suite.
6. Call `createReport` with the total threshold.
7. Return a nonzero exit status when `report.passed` is false.

Do not put product-specific selectors or URLs in the core grader. This separation lets one grader support different products.

## 17. Generated files

| Path | Content |
|---|---|
| `reports/evals/report.json` | Full eval result for machines and humans |
| `reports/playwright/index.html` | Browser test report |
| `artifact/e2e-eval-workbench.html` | Self-contained learning guide |
| `dist/index.html` | Cloudflare Pages deployment file |
| `video/task-lab-demo.mp4` | Recorded browser demonstration |

The `reports` directory is generated. Git does not track it.

## 18. CI and deployment gate

GitHub Actions runs `.github/workflows/ci.yml` for pull requests and pushes to `main`.

CI performs these actions:

1. It installs Node.js 22 dependencies.
2. It installs Chromium.
3. It runs unit and integration tests.
4. It runs UI and backend evals.
5. It runs browser E2E tests.
6. It uploads the Playwright and eval reports.

A failed command stops the job. A deployment should start only after this job passes.

## 19. Common problems

### Chromium is missing

Result:

```text
Executable does not exist
```

Fix:

```bash
npx playwright install chromium
```

### Port 4173 is already in use

Stop the other local server. Then run `npm start` again.

The eval runner does not use port `4173`. It selects an available port.

### An eval score is below 0.90

Open `reports/evals/report.json`.

Find a suite with `"passed": false`. Then find a case with a low score. Compare each failed criterion's `actual` and `expected` values.

### A browser case has an execution error

Check these values:

- The selector exists.
- The accessible label or role matches the UI.
- The expected text appears after the action.
- The backend request finishes.

### A smoke test cannot connect

Check that the server is running. Check that `BASE_URL` has the correct protocol, host, and port.

## 20. Project map

```text
e2e-eval-workbench/
├── src/                         Sample UI and backend
├── tests/
│   ├── unit/                    Function and grader tests
│   ├── integration/             API and store tests
│   ├── e2e/                     Browser workflow tests
│   └── smoke/                   Deployed-service checks
├── evals/
│   ├── framework/               Core grader and adapters
│   ├── suites/                  UI and backend datasets
│   └── run.mjs                  Eval runner
├── reports/                     Generated results
├── artifact/                    Guide source and built HTML
├── video/                       Browser demonstration
├── dist/                        Cloudflare Pages output
└── .github/workflows/ci.yml     CI quality gate
```

## 21. Links

- Live visual guide: <https://e2e-eval-workbench.pages.dev/>
- GitHub repository: <https://github.com/RO-29/e2e-eval-workbench>
