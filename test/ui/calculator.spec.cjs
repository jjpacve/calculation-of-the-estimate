const { test, expect } = require('@playwright/test');
const home = '/index.html';
const sor = '/sor.html';

test('SOR opens separately, reuses its window, and preserves SOCH input', async ({ page, context }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(home);
    await page.getByLabel('Какая оценка вам нужна').selectOption('5');
    await page.getByLabel('Процент ФО').fill('20');
    await page.getByLabel('Процент СОР').fill('22');
    await page.getByLabel('Максимум баллов за СОЧ').fill('30');
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByRole('status')).toHaveText('На 5 нужно набрать минимум 26 из 30 баллов.');
    const [popup] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('button', { name: 'Оценка за СОР' }).click()
    ]);
    popup.on('pageerror', error => errors.push(error.message));
    await popup.getByLabel('Набранный балл').fill('8');
    await popup.getByLabel('Максимальный балл за СОР').fill('10');
    await popup.getByRole('button', { name: 'Рассчитать оценку' }).click();
    await expect(popup.getByRole('status')).toHaveText('Результат: 80%. Оценка за СОР: 4.');
    await page.getByRole('button', { name: 'Оценка за СОР' }).click();
    expect(context.pages()).toHaveLength(2);
    await expect(page.getByLabel('Процент СОР')).toHaveValue('22');
    await expect(page.getByRole('status')).toContainText('26 из 30');
    await popup.close();
    const [reopened] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('button', { name: 'Оценка за СОР' }).click()
    ]);
    await expect(reopened.getByRole('heading')).toHaveText('Оценка за СОР');
    expect(errors).toEqual([]);
});

test('SOR handles validation, decimal comma and Enter', async ({ page }) => {
    await page.goto(sor);
    await page.getByRole('button', { name: 'Рассчитать оценку' }).click();
    await expect(page.getByRole('status')).toContainText('больше нуля');
    await page.getByLabel('Максимальный балл за СОР').fill('10');
    await page.getByRole('button', { name: 'Рассчитать оценку' }).click();
    await expect(page.getByRole('status')).toContainText('от 0 до максимального');
    await page.getByLabel('Набранный балл').fill('11');
    await page.getByLabel('Набранный балл').press('Enter');
    await expect(page.getByRole('status')).toContainText('от 0 до максимального');
    await page.getByLabel('Набранный балл').fill('8,5');
    await page.getByLabel('Набранный балл').press('Enter');
    await expect(page.getByRole('status')).toHaveText('Результат: 85%. Оценка за СОР: 5.');
    await page.getByLabel('Максимальный балл за СОР').fill('0');
    await page.getByLabel('Максимальный балл за СОР').press('Enter');
    await expect(page.getByRole('status')).toContainText('больше нуля');
    await page.setViewportSize({ width: 380, height: 670 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: 'test-results/sor-window.png', fullPage: true });
});

test('SOCH still reports impossible target and validates input', async ({ page }) => {
    await page.goto(home);
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByRole('status')).toContainText('от 0 до 25');
    await page.getByLabel('Процент ФО').fill('0');
    await page.getByLabel('Процент СОР').fill('0');
    await page.getByLabel('Максимум баллов за СОЧ').fill('30');
    await page.getByRole('button', { name: 'Отправить' }).click();
    await expect(page.getByRole('status')).toHaveText('На 4 не хватит даже максимума за СОЧ.');
});
