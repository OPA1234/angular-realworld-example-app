const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'avn56d',
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  reporter: 'cypress-multi-reporters',
    reporterOptions: {
    configFile: 'reporter-config.json',
  },
  

  env: {
    username: 'rastko@nemanjici.com',
    password: '',
    apiUrl: 'https://api.realworld.io',
  },

  retries: { 
    runMode: 2,
    openMode: 0

  },


  e2e: {
    setupNodeEvents(on, config){

      const username = process.env.DB_USERNAME
      const password = process.env.PASSWORD

      if(!password) {
        throw new Error('missing PASSWORD environment variable')
      }

      config.env = {
        username, password
      }
      return config

    },

    baseUrl: 'http://localhost:4200/',
    excludeSpecPattern: ['**/1-getting-started','**/2-advanced-examples'],
    specPattern:'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
