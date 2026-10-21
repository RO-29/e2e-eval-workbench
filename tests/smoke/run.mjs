const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
const health = await fetch(`${baseUrl}/health`);
const page = await fetch(baseUrl);

if (health.status !== 200) throw new Error(`Health check returned ${health.status}.`);
if ((await health.json()).status !== 'ok') throw new Error('Health response is not valid.');
if (page.status !== 200) throw new Error(`Home page returned ${page.status}.`);
if (!(await page.text()).includes('<title>Task Lab</title>')) throw new Error('Home page title is missing.');

console.log('Smoke checks passed.');
