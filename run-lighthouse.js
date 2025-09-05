const lighthouse = require('lighthouse').default;
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');
const config = require('./lighthouse-config');

const URLS_FILE = 'urls.txt';
const README_FILE = 'README.md';
const OUTPUT_DIR = 'wyniki';
const TABLE_START = '<!-- LIGHTHOUSE TABLE START -->';
const TABLE_END = '<!-- LIGHTHOUSE TABLE END -->';

// Utwórz katalog na wyniki
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// Funkcja konwertująca URL na bezpieczną nazwę pliku
function sanitizeFilename(url) {
    return url
        .replace(/^https?:\/\//, '')      // usuń https:// lub http://
        .replace(/[^a-z0-9]/gi, '_')      // zamień wszystko inne na _
        .replace(/_+/g, '_')              // scal powtarzające się _
        .replace(/^_|_$/g, '');           // usuń _ z początku i końca
}

// Wczytaj URL-e
const urls = fs.readFileSync(URLS_FILE, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {port: chrome.port, logLevel: 'info'};
    const runnerResult = await lighthouse(url, options, config);
    const categories = runnerResult.lhr.categories;
    const accessibility = Math.round(categories.accessibility.score * 100);
    const performance = Math.round(categories.performance.score * 100);

    // nazwa pliku
    const filename = sanitizeFilename(url);

    // zapis raportów
    // HTML
    fs.writeFileSync(path.join(OUTPUT_DIR, `${filename}.html`), runnerResult.report[0]);
    // JSON
    fs.writeFileSync(path.join(OUTPUT_DIR, `${filename}.json`), runnerResult.report[1]);

    await chrome.kill();

    return {url, accessibility, performance};
}

(async () => {
    const results = [];
    for (const url of urls) {
        console.log('Auditing:', url);
        try {
            const result = await runLighthouse(url);
            results.push(result);
        } catch (err) {
            console.error('Błąd dla URL:', url, err.message);
            results.push({url, accessibility: 'Error', performance: 'Error'});
        }
    }

    // generowanie tabeli Markdown
    let mdTable = `${TABLE_START}\n| URL | Accessibility | Performance |\n| --- | --- | --- |\n`;
    results.forEach(r => {
        mdTable += `| ${r.url} | ${r.accessibility} | ${r.performance} |\n`;
    });
    mdTable += `${TABLE_END}\n`;

    // aktualizacja README.md
    let readme = '';
    if (fs.existsSync(README_FILE)) {
        readme = fs.readFileSync(README_FILE, 'utf-8');
        const regex = new RegExp(`${TABLE_START}[\\s\\S]*?${TABLE_END}`, 'g');
        if (regex.test(readme)) {
            readme = readme.replace(regex, mdTable);
        } else {
            readme += '\n\n' + mdTable;
        }
    } else {
        readme = mdTable;
    }

    fs.writeFileSync(README_FILE, readme);

    console.log('Testy zakończone! CSV i tabela w README.md wygenerowane.');
})();
