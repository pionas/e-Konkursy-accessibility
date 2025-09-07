const fs = require('fs');
const path = require('path');
const chromeLauncher = require('chrome-launcher');
const {runAudit} = require('./runner');
const {updateReadme, writeCsv} = require('./reporter');

const URLS_FILE = 'urls.txt';
const README_FILE = 'README.md';
const OUTPUT_DIR = 'wyniki';
const CONCURRENCY = 1;

async function runWithConcurrency(tasks, limit) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);

        if (limit <= tasks.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
    return Promise.allSettled(results);
}

(async () => {
    if (!fs.existsSync(URLS_FILE)) {
        console.error(`❌ Plik ${URLS_FILE} nie istnieje`);
        process.exit(1);
    }
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    const urls = fs.readFileSync(URLS_FILE, 'utf-8')
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

    if (urls.length === 0) {
        console.error('❌ Brak URL-i do przetestowania.');
        process.exit(1);
    }

    console.log(`🚀 Start audytu dla ${urls.length} adresów...`);

    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu']});

    const tasks = urls.map(url => async () => {
        try {
            return await runAudit(url, chrome.port, OUTPUT_DIR);
        } catch (err) {
            console.error(`❌ Błąd dla ${url}: ${err.message}`);
            return {url, accessibility: 'Error', performance: 'Error'};
        }
    });

    const settled = await runWithConcurrency(tasks, CONCURRENCY);
    const results = settled.map(r => r.value);

    await chrome.kill();

    await updateReadme(results, README_FILE);
    await writeCsv(results, path.join(OUTPUT_DIR, 'summary.csv'));

    console.log('✅ Audyty zakończone. Raporty w katalogu wyniki/, tabela w README.md, CSV w summary.csv');
})();
