const {defineConfig} = require("cypress");
const fs = require("fs");

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://www.e-konkursy.info",
        setupNodeEvents(on, config) {
            on("after:screenshot", (details) => {
                const browser = details.name || details.version || "unknown";
                const width = config.viewportWidth;
                const height = config.viewportHeight;

                const newPath = details.path.replace(
                    ".png",
                    `-${browser}-${width}x${height}.png`
                );

                return new Promise((resolve, reject) => {
                    fs.rename(details.path, newPath, (err) => {
                        if (err) return reject(err);
                        resolve({path: newPath});
                    });
                });
            });

            return config;
        },
    },
});
