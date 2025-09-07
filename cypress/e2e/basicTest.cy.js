describe('Basic Accessibility Tests', () => {
    const urls = Cypress.env('urls') || []

    urls.forEach(url => {
        it(`Should not have any accessibility violations on ${url}`, () => {
            cy.visit(url)
            cy.checkAccessibility()
        })
    })
})
