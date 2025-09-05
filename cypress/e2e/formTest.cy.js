describe('Form Accessibility', () => {
    it('All form fields should have associated labels', () => {
        cy.visit('/contact-form')

        cy.get('input, select, textarea').each(($field) => {
            const id = $field.attr('id')

            // Sprawdź label przez atrybut for
            if (id) {
                cy.get(`label[for="${id}"]`).should('exist')
            } else {
                // Lub przez zagnieżdżenie
                cy.wrap($field).parents('label').should('exist')
            }
        })
    })

    it('Required fields should be properly marked', () => {
        cy.get('input[required], select[required]').each(($field) => {
            // Sprawdź czy ma aria-required lub visual indicator
            cy.wrap($field).should(($el) => {
                const hasARIA = $el.attr('aria-required') === 'true'
                const hasVisualLabel = $el.parent().find('.required-indicator').length > 0

                expect(hasARIA || hasVisualLabel).to.be.true
            })
        })
    })
})
