import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createAppServer } from '../src/server.mjs';
import { createBrowserAdapter } from './framework/browser-adapter.mjs';
import { createReport, runSuite } from './framework/core.mjs';
import { createHttpAdapter } from './framework/http-adapter.mjs';

const loadSuite = async (name) => JSON.parse(await readFile(new URL(`./suites/${name}.json`, import.meta.url), 'utf8'));
const server = createAppServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });

try {
  const backend = await runSuite(await loadSuite('backend'), createHttpAdapter(baseUrl));
  const ui = await runSuite(await loadSuite('ui'), createBrowserAdapter(browser, baseUrl));
  const report = createReport([backend, ui], 0.9);
  await mkdir(new URL('../reports/evals/', import.meta.url), { recursive: true });
  await writeFile(new URL('../reports/evals/report.json', import.meta.url), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
