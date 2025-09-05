describe('ARIA and Dynamic Content', () => {
    it('Live regions should announce updates', () => {
        cy.visit('/dashboard')

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
