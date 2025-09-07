export function terminalLog(violations) {
    cy.task(
        'log',
        `${violations.length} accessibility violation${
            violations.length === 1 ? '' : 's'
        } ${violations.length === 1 ? 'was' : 'were'} detected`
    )

    violations.forEach((v) => {
        v.nodes.forEach(node => {
            cy.document().then(doc => {
                node.target.forEach(sel => {
                    const el = doc.querySelector(sel);
                    if (el) {
                        cy.wrap(el).then($el => {
                            $el.css('outline', '4px solid red');
                            $el.css('outline-offset', '2px');
                            $el.css('box-shadow', '0 0 10px 3px red');
                        });
                    }
                });
            });
        });
    })

    cy.task("updateReadme", violations);

    cy.location('href').then((href) => {
        const violationData = violations.map(
            ({id, impact, description, help, nodes}) => ({
                url: href,
                id,
                impact,
                description,
                help,
                nodes: nodes.length
            })
        );

        cy.task('table', violationData)
        cy.task("appendAccessibilityJson", violationData);
    });

}