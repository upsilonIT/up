/* eslint-disable import/no-extraneous-dependencies */
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";

export default defineConfig({
  hosts: {
    "loc.localhost": "0.0.0.0",
    "*.loc.localhost": "0.0.0.0",
  },
  e2e: {
    specPattern: "cypress/e2e/*.feature",
    env: {},
    baseUrl: "http://loc.localhost:3000/",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // eslint-disable-next-line consistent-return
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome" || browser.name === "edge") {
          launchOptions.args.push(
            // Why it's required:
            // 1. We need `SameSite=none` cookies due to Chrome security limitations when used with Cypress
            // 2. `SameSite=none` cookies also require cookies to be `Secure`
            // 3. As we don't want to set up HTTPS on localhost, we come up with this:
            "--unsafety-treat-insecure-origin-as-secure=loc.localhost:3000"
          );

          return launchOptions;
        }
      });

      return config;
    },
  },
  pageLoadTimeout: 15_000,
});
