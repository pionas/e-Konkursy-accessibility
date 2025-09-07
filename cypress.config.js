const {defineConfig} = require("cypress");
const fs = require("fs");
const path = require("path");

const README_FILE = path.join(__dirname, "README.md");
const ACCESSIBILITY_JSON_FILE = path.join(__dirname, "wyniki", "accessibility.json");
const A11Y_TABLE_START = "<!-- A11Y TABLE START -->";
const A11Y_TABLE_END = "<!-- A11Y TABLE END -->";
const regex = new RegExp(`${A11Y_TABLE_START}[\\s\\S]*?${A11Y_TABLE_END}`, "g");

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

            on("task", {
                log(message) {
                    console.log(message);
                    return null;
                },
                table(message) {
                    console.table(message);
                    return null;
                },
                appendAccessibilityJson(violations) {
                    const dir = path.dirname(ACCESSIBILITY_JSON_FILE);
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});

                    let existing = [];
                    if (fs.existsSync(ACCESSIBILITY_JSON_FILE)) {
                        existing = JSON.parse(fs.readFileSync(ACCESSIBILITY_JSON_FILE, "utf-8"));
                    }

                    existing.push(...violations);

                    // filtrowanie duplikatów
                    const unique = [];
                    const seen = new Set();
                    existing.forEach(v => {
                        const key = `${v.url}-${v.id}-${v.impact}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            unique.push(v);
                        }
                    });

                    fs.writeFileSync(ACCESSIBILITY_JSON_FILE, JSON.stringify(unique, null, 2));
                    console.log(`Zapisano ${violations.length} nowych naruszeń`);
                    return null;
                },
                updateReadme() {
                    if (!fs.existsSync(ACCESSIBILITY_JSON_FILE)) {
                        console.warn(`Plik ${ACCESSIBILITY_JSON_FILE} nie istnieje`);
                        return null;
                    }
                    const violations = JSON.parse(fs.readFileSync(ACCESSIBILITY_JSON_FILE, "utf-8"));

                    // Generowanie tabeli Markdown
                    let mdTable = `${A11Y_TABLE_START}\n| URL | Impact | ID | Help | Description | Nodes |\n| --- | --- | --- | --- | --- |\n`;
                    violations.forEach(v => {
                        mdTable += `| ${v.url || '-'} | ${v.impact || '-'} | ${v.id || '-'} | ${v.help || '-'} | ${v.description || '-'} | ${v.nodes || '-'} |\n`;
                    });
                    mdTable += `${A11Y_TABLE_END}`;

                    // Aktualizacja README.md
                    let readme = "";
                    if (fs.existsSync(README_FILE)) {
                        readme = fs.readFileSync(README_FILE, "utf-8");
                        if (regex.test(readme)) {
                            readme = readme.replace(regex, mdTable);
                        } else {
                            readme += "\n\n" + mdTable;
                        }
                    } else {
                        readme = mdTable;
                    }

                    fs.writeFileSync(README_FILE, readme);
                    console.log(`Zapisano ${violations.length} naruszeń accessibility do README.md`);
                    return null;
                }
            });

            return config;
        },
    },
});
