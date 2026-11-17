const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './test/ui',
    webServer: {
        command: 'python3 -m http.server 3210 --bind 127.0.0.1',
        url: 'http://127.0.0.1:3210',
        reuseExistingServer: false
    },
    use: {
        baseURL: 'http://127.0.0.1:3210',
        browserName: 'chromium',
        launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined }
    }
});
