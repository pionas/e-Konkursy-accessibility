const fs = require('fs');

const TABLE_START = '<!-- LIGHTHOUSE TABLE START -->';
const TABLE_END = '<!-- LIGHTHOUSE TABLE END -->';

async function updateReadme(results, readmePath) {
    let mdTable = `${TABLE_START}\n| URL | Accessibility | Performance |\n| --- | --- | --- |\n`;
    results.forEach(r => {
        mdTable += `| ${r.url} | ${r.accessibility} | ${r.performance} |\n`;
    });
    mdTable += `${TABLE_END}`;

    let readme = '';
    if (fs.existsSync(readmePath)) {
        readme = fs.readFileSync(readmePath, 'utf-8');
        const regex = new RegExp(`${TABLE_START}[\\s\\S]*?${TABLE_END}`, 'g');
        readme = regex.test(readme)
            ? readme.replace(regex, mdTable)
            : readme + '\n\n' + mdTable;
    } else {
        readme = mdTable;
    }

    fs.writeFileSync(readmePath, readme);
}

async function writeCsv(results, filePath) {
    let csv = 'URL,Accessibility,Performance\n';
    results.forEach(r => {
        csv += `${r.url},${r.accessibility},${r.performance}\n`;
    });
    fs.writeFileSync(filePath, csv);
}

module.exports = {updateReadme, writeCsv};
