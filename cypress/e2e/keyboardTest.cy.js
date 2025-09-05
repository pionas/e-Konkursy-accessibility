describe('Keyboard Navigation', () => {
    it('Should allow keyboard navigation through buttons', () => {
        cy.visit('/app')

        // Znajdź pierwszy przycisk
        cy.get('button').first().focus()

        // Przejdź przez wszystkie przyciski używając Tab
        cy.focused().then(($button) => {
            const buttonCount = Cypress.$('button').length

            for (let i = 0; i < buttonCount - 1; i++) {
                cy.focused().tab()
            }

            // Sprawdź czy jesteśmy na ostatnim przycisku
            cy.focused().should('be', Cypress.$('button').last())
        })
    })

    it('Modal dialogs should trap focus', () => {
        cy.visit('/modal-example')

        // Otwórz modal
        cy.get('#open-modal').click()

        // Sprawdź czy modal ma fokus
        cy.get('[role="dialog"]').should('have.focus')

        // Spróbuj wyjść z modala Tab'em
        cy.get('[role="dialog"]').find('button').last().tab()

        // Fokus powinien wrócić do pierwszego elementu modala
        cy.get('[role="dialog"]').find('button').first().should('have.focus')
    })
})
