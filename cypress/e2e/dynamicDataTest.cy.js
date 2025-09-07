describe('ARIA and Dynamic Content', () => {
    beforeEach(() => {
        cy.visit('/')
    });

    it('Live regions should announce updates', () => {
        // Kliknij przycisk, który aktualizuje status
        cy.get('#refresh-status').click()

        // Sprawdź czy region na updated
        cy.get('[aria-live="polite"]')
            .should('contain', 'Status updated successfully')
    })

    it('Expandable sections should update aria-expanded', () => {
        cy.get('[aria-expanded]').should('have.attr', 'aria-expanded', 'false')

        cy.get('[aria-controls]').click()

        cy.get('[aria-expanded]').should('have.attr', 'aria-expanded', 'true')
    })
})
