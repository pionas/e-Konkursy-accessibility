import { highlightViolations, logViolations } from "./logger";
import { saveViolations, updateReadme } from "./reporter";

export function terminalLog(violations) {
    logViolations(violations);
    highlightViolations(violations);
    saveViolations(violations);
}
