describe('Basic Accessibility Tests', () => {
    beforeEach(() => {
        // Odwiedzamy stronę przed każdym testem
        cy.visit('/')
        // Inicjalizujemy axe-core
        cy.injectAxe()
    })

    it('Should not have any accessibility violations', () => {
        // Uruchamiamy test dostępności
        cy.checkA11y()
    })
})
