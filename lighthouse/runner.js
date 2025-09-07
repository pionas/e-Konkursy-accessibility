const lighthouse = require('lighthouse').default;
const fs = require('fs');
const path = require('path');
const config = require('../lighthouse-config');

function sanitizeFilename(url) {
    return url
        .replace(/^https?:\/\//, '')
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

async function runAudit(url, port, outDir) {
    const options = {port, logLevel: 'info'};
    let runnerResult;

    try {
        runnerResult = await lighthouse(url, options, config);
    } catch (err) {
        if (err.message.includes('getBenchmarkIndex')) {
            console.warn(`⚠️ Lighthouse warning dla ${url}: ${err.message}`);
            if (err.lhr) runnerResult = err;
            else return {url, accessibility: 0, performance: 0};
        } else {
            throw err;
        }
    }

    const categories = runnerResult.lhr.categories;
    const accessibility = Math.round((categories.accessibility?.score ?? 0) * 100);
    const performance = Math.round((categories.performance?.score ?? 0) * 100);

    const filename = sanitizeFilename(url);
    const [html, json] = runnerResult.report || ['', ''];

    fs.writeFileSync(path.join(outDir, `${filename}.html`), html);
    fs.writeFileSync(path.join(outDir, `${filename}.json`), json);

    return {url, accessibility, performance};
}

module.exports = {runAudit};
