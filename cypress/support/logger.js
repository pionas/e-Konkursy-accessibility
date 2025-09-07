export function highlightViolations(violations) {
    violations.forEach((v) => {
        v.nodes.forEach((node) => {
            cy.document().then((doc) => {
                node.target.forEach((sel) => {
                    const el = doc.querySelector(sel);
                    if (el) {
                        cy.wrap(el).invoke("css", {
                            outline: "4px solid red",
                            "outline-offset": "2px",
                            "box-shadow": "0 0 10px 3px red",
                        });
                    }
                });
            });
        });
    });
}

export function logViolations(violations) {
    cy.task(
        "log",
        `${violations.length} accessibility violation${violations.length === 1 ? "" : "s"}`
    );
    if (violations.length > 0) {
        cy.task(
            "table",
            violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                description: v.description,
                nodes: v.nodes.length,
            }))
        );
    }
}
