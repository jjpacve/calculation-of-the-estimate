const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('node:path');

test('desktop opens a separate SOR window, reuses it, and can reopen it', async () => {
    const app = await electron.launch({ args: [path.join(__dirname, '../..')] });
    try {
        const main = await app.firstWindow();
        await expect(main).toHaveTitle('Калькулятор баллов за СОЧ');
        await main.getByLabel('Процент ФО').fill('20');
        const [sor] = await Promise.all([
            app.waitForEvent('window'),
            main.getByRole('button', { name: 'Оценка за СОР' }).click()
        ]);
        await expect(sor).toHaveTitle('Оценка за СОР');
        await sor.getByLabel('Набранный балл').fill('8');
        await sor.getByLabel('Максимальный балл за СОР').fill('10');
        await sor.getByRole('button', { name: 'Рассчитать оценку' }).click();
        await expect(sor.getByRole('status')).toHaveText('Результат: 80%. Оценка за СОР: 4.');
        await main.getByRole('button', { name: 'Оценка за СОР' }).click();
        expect(app.windows()).toHaveLength(2);
        await expect(main.getByLabel('Процент ФО')).toHaveValue('20');
        await app.evaluate(({ BrowserWindow }) => {
            BrowserWindow.getAllWindows().find(win => win.getTitle() === 'Оценка за СОР').close();
        });
        const [reopened] = await Promise.all([
            app.waitForEvent('window'),
            main.getByRole('button', { name: 'Оценка за СОР' }).click()
        ]);
        await expect(reopened).toHaveTitle('Оценка за СОР');
        await expect.poll(() => app.windows().length).toBe(2);
    } finally {
        await app.close();
    }
});
