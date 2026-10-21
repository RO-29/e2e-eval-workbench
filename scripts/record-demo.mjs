import { chromium } from '@playwright/test';
import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outputDir = new URL('../video/', import.meta.url);
const outputPath = fileURLToPath(outputDir);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: outputPath, size: { width: 1280, height: 720 } }
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);

async function showLesson(title, body, step) {
  await page.evaluate(({ title, body, step }) => {
    let card = document.querySelector('#lesson-card');
    if (!card) {
      const style = document.createElement('style');
      style.textContent = `
        #lesson-card { position: fixed; inset: auto 32px 28px 32px; z-index: 9999; display: grid; grid-template-columns: 92px 1fr; gap: 22px; padding: 22px 26px; border: 3px solid #10263b; background: #fff; box-shadow: 10px 10px 0 #ffd866; color: #10263b; font-family: "Avenir Next", Avenir, sans-serif; }
        #lesson-step { display: grid; place-items: center; border-right: 2px solid #10263b; font-size: 1.05rem; font-weight: 850; }
        #lesson-title { margin: 0 0 7px; font-size: 1.55rem; line-height: 1.1; }
        #lesson-body { margin: 0; max-width: 75ch; font-size: 1.03rem; line-height: 1.45; }
        .lesson-focus { outline: 5px solid #e74d3c !important; outline-offset: 5px; }
      `;
      document.head.append(style);
      card = document.createElement('aside');
      card.id = 'lesson-card';
      card.innerHTML = '<div id="lesson-step"></div><div><h2 id="lesson-title"></h2><p id="lesson-body"></p></div>';
      document.body.append(card);
    }
    document.querySelector('#lesson-step').textContent = step;
    document.querySelector('#lesson-title').textContent = title;
    document.querySelector('#lesson-body').textContent = body;
  }, { title, body, step });
  await pause(4300);
}

async function focus(selector) {
  await page.evaluate((value) => {
    document.querySelectorAll('.lesson-focus').forEach((node) => node.classList.remove('lesson-focus'));
    document.querySelector(value)?.classList.add('lesson-focus');
  }, selector);
}

await page.request.post('http://127.0.0.1:4173/api/reset');
await page.goto('http://127.0.0.1:4173');
await pause(1200);
await showLesson('What does correctness mean?', 'We define an expected result. We run the software. We compare the actual result with the expected result.', 'Start');
await showLesson('Unit test', 'A unit test checks one small rule. This project checks title validation and task counts without a browser or server.', '1 of 5');
await focus('#task-title');
await showLesson('Integration test', 'An integration test checks connected parts. This project sends an HTTP request to the backend and checks the saved task.', '2 of 5');
await page.getByLabel('Task title').fill('Prepare the release evidence');
await page.getByLabel('Priority').selectOption('high');
await focus('button[type="submit"]');
await showLesson('E2E test', 'An E2E test controls the real browser. It enters data, selects Add task, and checks the visible result.', '3 of 5');
await page.getByRole('button', { name: 'Add task' }).click();
await pause(1200);
await focus('[data-task-id]');
await showLesson('The full path works', 'The UI sent JSON. The backend validated it. The store saved it. The UI now displays the task.', 'Result');
await page.getByRole('button', { name: 'Mark Prepare the release evidence done' }).click();
await pause(900);
await showLesson('Eval', 'An eval gives variable behavior a score. Four weighted cases must produce a total score of at least 0.90.', '4 of 5');
await showLesson('Smoke test', 'A smoke test runs after deployment. It checks that the page and the health route answer basic requests.', '5 of 5');
await showLesson('CI/CD gate', 'CI runs unit, integration, eval, and E2E checks. CD deploys the change. The smoke check then checks the deployment.', 'Pipeline');
await showLesson('Use all five checks', 'Small tests find rule errors quickly. Larger checks find connection and workflow errors. Evals measure quality.', 'Done');
await page.evaluate(() => document.querySelectorAll('.lesson-focus').forEach((node) => node.classList.remove('lesson-focus')));
await page.screenshot({ path: fileURLToPath(new URL('task-lab.png', outputDir)), fullPage: true });
const video = page.video();
await context.close();
const path = await video.path();
await copyFile(path, new URL('task-lab-demo.webm', outputDir));
await browser.close();
console.log(new URL('task-lab-demo.webm', outputDir).pathname);
