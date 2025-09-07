export function saveViolations(violations) {
    cy.location("href").then((href) => {
        const violationData = violations.map(({ id, impact, description, help, nodes }) => ({
            url: href,
            id,
            impact,
            description,
            help,
            nodes: nodes.length,
        }));
        cy.task("appendAccessibilityJson", violationData);
    });
}

export function updateReadme() {
    cy.task("updateReadme");
}
