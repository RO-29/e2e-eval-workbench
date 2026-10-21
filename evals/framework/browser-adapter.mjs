function locatorFor(page, step) {
  if (step.label) return page.getByLabel(step.label);
  if (step.role) return page.getByRole(step.role, step.name ? { name: step.name } : undefined);
  return page.locator(step.selector);
}

export function createBrowserAdapter(browser, baseUrl) {
  return {
    async run(evalCase) {
      const page = await browser.newPage();
      const captures = {};
      try {
        await page.request.post(`${baseUrl}/api/reset`);
        for (const step of evalCase.steps) {
          if (step.action === 'goto') await page.goto(`${baseUrl}${step.path}`);
          if (step.action === 'fill') await locatorFor(page, step).fill(step.value);
          if (step.action === 'select') await locatorFor(page, step).selectOption(step.value);
          if (step.action === 'click') await locatorFor(page, step).click();
          if (step.action === 'waitForText') {
            await page.waitForFunction(
              ({ selector, value }) => document.querySelector(selector)?.textContent?.includes(value),
              { selector: step.selector, value: step.value }
            );
          }
          if (step.action === 'captureText') captures[step.key] = (await locatorFor(page, step).textContent())?.trim() ?? '';
          if (step.action === 'captureCount') captures[step.key] = await locatorFor(page, step).count();
          if (step.action === 'captureClass') captures[step.key] = await locatorFor(page, step).getAttribute('class');
        }
        return { captures };
      } finally {
        await page.close();
      }
    }
  };
}
