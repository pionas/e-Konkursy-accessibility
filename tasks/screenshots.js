const fs = require("fs");

function registerScreenshotHandler(on, config) {
    on("after:screenshot", (details) => {
        const browser = details.name || details.version || "unknown";
        const {viewportWidth: width, viewportHeight: height} = config;

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
}

module.exports = {registerScreenshotHandler};
