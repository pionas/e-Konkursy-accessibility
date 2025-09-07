describe('Keyboard Navigation', () => {
    beforeEach(() => {
        cy.visit('/')
    });
    it('Should allow keyboard navigation through buttons', () => {

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
        cy.get('#rodoNotify').should('be.visible');
        cy.get('#rodoNotify button.setRodo').should('have.focus');

        // Spróbuj wyjść z modala Tab'em
        cy.get('#rodoNotify').find('button').last().tab()

        // Fokus powinien wrócić do pierwszego elementu modala
        cy.get('#rodoNotify').find('button').first().should('have.focus')
    })
})
