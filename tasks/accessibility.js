const fs = require("fs");
const path = require("path");

const ACCESSIBILITY_JSON_FILE = path.join(__dirname, "..", "wyniki", "accessibility.json");

function safeReadJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
        return [];
    }
}

function registerAccessibilityTasks(on) {
    on("task", {
        appendAccessibilityJson(violations) {
            const dir = path.dirname(ACCESSIBILITY_JSON_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const existing = fs.existsSync(ACCESSIBILITY_JSON_FILE)
                ? safeReadJson(ACCESSIBILITY_JSON_FILE)
                : [];

            const seen = new Set();
            const unique = [...existing, ...violations].filter((v) => {
                const key = `${v.url}-${v.id}-${v.impact}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });

            fs.writeFileSync(ACCESSIBILITY_JSON_FILE, JSON.stringify(unique, null, 2));
            return null;
        },
    });
}

module.exports = { registerAccessibilityTasks };
