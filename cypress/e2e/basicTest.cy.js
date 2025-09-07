describe('Basic Accessibility Tests', () => {
    it('Should not have any accessibility violations', () => {
        cy.visit('/')
        cy.checkAccessibility()
    })
})
