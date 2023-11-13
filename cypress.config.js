const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  env: {
    username: 'rastko@nemanjici.com',
    password: 'Test123',
    apiUrl: 'https://api.realworld.io',
  },
  e2e: {
    baseUrl: 'http://localhost:4200/',
    excludeSpecPattern: ['**/1-getting-started','**/2-advanced-examples'],
    specPattern:'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
