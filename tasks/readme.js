const fs = require("fs");
const path = require("path");

const README_FILE = path.join(__dirname, "..", "README.md");
const ACCESSIBILITY_JSON_FILE = path.join(__dirname, "..", "wyniki", "accessibility.json");
const A11Y_TABLE_START = "<!-- A11Y TABLE START -->";
const A11Y_TABLE_END = "<!-- A11Y TABLE END -->";
const regex = new RegExp(`${A11Y_TABLE_START}[\\s\\S]*?${A11Y_TABLE_END}`, "g");

function renderMarkdownTable(violations) {
    let table = `${A11Y_TABLE_START}\n| URL | Impact | ID | Help | Description | Nodes |\n| --- | --- | --- | --- | --- | --- |\n`;
    violations.forEach((v) => {
        const safe = (val) => String(val || "-").replace(/\|/g, "\\|");
        table += `| ${safe(v.url)} | ${safe(v.impact)} | ${safe(v.id)} | ${safe(v.help)} | ${safe(v.description)} | ${safe(v.nodes)} |\n`;
    });
    table += `${A11Y_TABLE_END}`;
    return table;
}

function registerReadmeTasks(on) {
    on("task", {
        updateReadme() {
            if (!fs.existsSync(ACCESSIBILITY_JSON_FILE)) {
                console.warn(`Brak pliku ${ACCESSIBILITY_JSON_FILE}`);
                return null;
            }

            const violations = JSON.parse(fs.readFileSync(ACCESSIBILITY_JSON_FILE, "utf-8"));
            const mdTable = renderMarkdownTable(violations);

            let readme = fs.existsSync(README_FILE)
                ? fs.readFileSync(README_FILE, "utf-8")
                : "";

            readme = regex.test(readme)
                ? readme.replace(regex, mdTable)
                : readme + "\n\n" + mdTable;

            fs.writeFileSync(README_FILE, readme);
            console.log(`README.md zaktualizowany (${violations.length} naruszeń accessibility)`);
            return null;
        },
    });
}

module.exports = {registerReadmeTasks};
