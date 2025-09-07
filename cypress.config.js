const {defineConfig} = require("cypress");
const {registerScreenshotHandler} = require("./tasks/screenshots");
const {registerAccessibilityTasks} = require("./tasks/accessibility");
const {registerReadmeTasks} = require("./tasks/readme");
const {registerLoggerTasks} = require("./tasks/logger");
const {initBasicUrls} = require("./tasks/urls");

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://www.e-konkursy.info",
        setupNodeEvents(on, config) {
            registerScreenshotHandler(on, config);
            registerAccessibilityTasks(on);
            registerReadmeTasks(on);
            registerLoggerTasks(on);
            initBasicUrls(config);
            return config;
        },
    },
});
