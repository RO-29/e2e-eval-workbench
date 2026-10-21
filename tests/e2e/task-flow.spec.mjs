import { expect, test } from '@playwright/test';

test.beforeEach(async ({ request, page }) => {
  await request.post('/api/reset');
  await page.goto('/');
});

test('user creates and completes a task', async ({ page }) => {
  await page.getByLabel('Task title').fill('Prepare release notes');
  await page.getByLabel('Priority').selectOption('high');
  await page.getByRole('button', { name: 'Add task' }).click();

  const task = page.getByRole('list', { name: 'Tasks' }).getByRole('listitem');
  await expect(task).toContainText('Prepare release notes');
  await expect(task).toContainText('high');
  await expect(page.getByText('1 open / 0 done')).toBeVisible();

  await page.getByRole('button', { name: 'Mark Prepare release notes done' }).click();
  await expect(page.getByText('0 open / 1 done')).toBeVisible();
  await expect(task).toHaveClass(/done/);
});

test('browser validation blocks an invalid task', async ({ page }) => {
  await page.getByLabel('Task title').fill('x');
  await page.getByRole('button', { name: 'Add task' }).click();
  await expect(page.getByRole('list', { name: 'Tasks' }).getByRole('listitem')).toHaveCount(0);
});
