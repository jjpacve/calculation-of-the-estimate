const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({ testDir: './test/desktop', workers: 1 });
