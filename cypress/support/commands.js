import {terminalLog} from "./functions";

Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('cross-origin') || err.message.includes('Script error')) {
        return false
    }
    if (err.message.includes('shift is not a function')) {
        return false
    }
});

Cypress.Commands.add('checkAccessibility', () => {
    cy.injectAxe();
    cy.checkA11y(null, null, terminalLog, false);
});