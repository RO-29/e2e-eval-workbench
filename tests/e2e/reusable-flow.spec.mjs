import { expect, test } from '@playwright/test';

const guideUrl = new URL('../../pages/reusable-eval.html', import.meta.url).href;

test.beforeEach(async ({ page }) => {
  await page.goto(guideUrl);
});

test('each scenario uses the same six-stage flow', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Backend' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#flow-scenario-name')).toHaveText('Backend eval');

  await page.getByRole('button', { name: 'UI', exact: true }).click();
  await expect(page.locator('#flow-scenario-name')).toHaveText('UI eval');
  await expect(page.locator('.flow-step').first()).toContainText('Create a visible task.');

  await page.getByRole('button', { name: 'Prompt with Jev' }).click();
  await expect(page.locator('#flow-scenario-name')).toHaveText('Prompt eval with Jev');

  for (let step = 0; step < 4; step += 1) {
    await page.getByRole('button', { name: 'Next stage' }).click();
  }

  await expect(page.locator('#flow-position')).toHaveText('Stage 5 of 6');
  await expect(page.locator('#flow-stage-name')).toHaveText('Grader');
  await expect(page.locator('#flow-tool')).toHaveText('Jev semantic grader');
  await expect(page.locator('#flow-output')).toContainText('Choice: complete');
  await expect(page.locator('.flow-step.is-complete')).toHaveCount(4);
  await expect(page.locator('.flow-step.is-active')).toHaveCount(1);
  await expect(page.locator('.flow-step.is-active')).toHaveAttribute('aria-current', 'step');
});

test('play control advances and pauses the flow', async ({ page }) => {
  const play = page.getByRole('button', { name: 'Play all three' });
  await play.click();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  await expect(page.locator('#flow-position')).toHaveText('Stage 2 of 6', { timeout: 2500 });

  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Play all three' })).toBeVisible();
});

test('play all completes backend, UI, and prompt scenarios', async ({ page }) => {
  await page.clock.install();
  await page.reload();
  await page.getByRole('button', { name: 'Play all three' }).click();
  await page.clock.runFor(28800);

  await expect(page.locator('#flow-scenario-name')).toHaveText('Prompt eval with Jev');
  await expect(page.locator('#flow-position')).toHaveText('Stage 6 of 6');
  await expect(page.locator('#flow-output')).toContainText('18 of 20 points');
  await expect(page.getByRole('button', { name: 'Play all three' })).toBeVisible();
});
