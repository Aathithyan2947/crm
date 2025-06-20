const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      NEXT_PUBLIC_URL: 'http://localhost:3000'
    },
  },
});
