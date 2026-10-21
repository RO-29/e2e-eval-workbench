import { expect, test } from '@playwright/test';

const guideUrl = new URL('../../pages/reusable-eval.html', import.meta.url).href;

test.beforeEach(async ({ page }) => {
  await page.goto(guideUrl);
});

test('the demo shows one feature across all three eval lanes', async ({ page }) => {
  await expect(page.locator('.eval-lane')).toHaveCount(3);
  await expect(page.locator('[data-lane="backend"]')).toContainText('POST /api/password-reset');
  await expect(page.locator('[data-lane="ui"]')).toContainText('Send reset link');
  await expect(page.locator('[data-lane="prompt"]')).toContainText('Model adapter and Jev');
  await expect(page.locator('.framework-step')).toHaveCount(6);
});

test('next event runs the backend example stage by stage', async ({ page }) => {
  const next = page.getByRole('button', { name: 'Next event' });
  await next.click();
  await expect(page.locator('#demo-status')).toHaveText('Backend eval: Case');
  await next.click();
  await next.click();
  await expect(page.locator('#backend-response')).toHaveText('sending request...');
  await next.click();
  await expect(page.locator('#backend-response')).toContainText('202');
  await next.click();
  await expect(page.locator('[data-checks="backend"] .is-pass')).toHaveCount(3);
  await next.click();
  await expect(page.locator('#backend-score')).toHaveText('3 / 3');
  await expect(page.locator('#backend-gate')).toHaveText('PASS');
});

test('complete run produces UI, prompt, and shared reports', async ({ page }) => {
  await page.clock.install();
  await page.reload();
  await page.getByRole('button', { name: 'Run complete example' }).click();
  await page.clock.runFor(18000);

  await expect(page.locator('#ui-message')).toContainText('sent a reset link');
  await expect(page.locator('.trial-dot.is-run')).toHaveCount(5);
  await expect(page.locator('#prompt-report')).toContainText('Jev graded five replies');
  await expect(page.locator('#prompt-score')).toHaveText('18 / 20');
  await expect(page.locator('#release-score')).toHaveText('24 / 26');
  await expect(page.locator('#release-gate')).toHaveText('PASS 0.92');
});

test('reset clears all demo output', async ({ page }) => {
  await page.getByRole('button', { name: 'Next event' }).click();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.locator('#demo-status')).toHaveText('Ready to run');
  await expect(page.locator('#backend-score')).toHaveText('0 / 3');
  await expect(page.locator('#release-gate')).toHaveText('WAITING');
});
