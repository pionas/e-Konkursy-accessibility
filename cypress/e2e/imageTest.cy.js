describe('Image Accessibility', () => {
    it('All images should have alt attributes', () => {
        cy.visit('/gallery')

        cy.get('img').each(($img) => {
            cy.wrap($img).should('have.attr', 'alt')

            // Upewnij się, że alt nie jest pusty
            // (chyba że obraz jest dekoracyjny)
            const alt = $img.attr('alt')
            const isDecorative = $img.attr('aria-hidden') === 'true'

            if (!isDecorative) {
                expect(alt).to.not.be.empty
            }
        })
    })
})

