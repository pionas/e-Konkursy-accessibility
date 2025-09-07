const fs = require("fs");
const path = require("path");

function initBasicUrls(config) {
    const urlsFile = path.resolve(__dirname, "..", "urls.txt");
    if (!fs.existsSync(urlsFile)) {
        console.warn(`Brak pliku ${urlsFile}, zmienna env.urls pusta`);
        config.env.urls = [];
        return;
    }

    config.env.urls = fs
        .readFileSync(urlsFile, "utf-8")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

module.exports = { initBasicUrls };
