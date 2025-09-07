describe('Form Accessibility', () => {
    beforeEach(() => {
        cy.visit('/kontakt')
    });

    it('Should not have any accessibility violations', () => {
        cy.checkAccessibility()
    })

    it('All form fields should have associated labels', () => {
        const missingLabels = [];
        cy.get('input, select, textarea').each(($field) => {
            const type = $field.attr('type') || '';
            const id = $field.attr('id');
            const ariaLabel = $field.attr('aria-label');
            const ariaLabelledby = $field.attr('aria-labelledby');
            const ariaDisabled = $field.attr('aria-disabled');

            if (type === 'hidden' || ariaDisabled === 'true') {
                return;
            }
            let hasLabel = false;
            // 1️⃣ Check explicit label
            if (id) {
                const label = $field.closest('form').find(`label[for="${id}"]`);
                if (label.length) hasLabel = true;
            }

            // 2️⃣ Check implicit label (parent label)
            if (!hasLabel && $field.parents('label').length) {
                hasLabel = true;
            }

            // 3️⃣ Check ARIA attributes
            if (!hasLabel && (ariaLabel || ariaLabelledby)) {
                hasLabel = true;
            }

            if (!hasLabel) {
                missingLabels.push($field.parent().html());
            }
        });
        cy.then(() => {
            expect(missingLabels, `Fields missing labels:\n ${missingLabels.join('\n')}`).to.be.empty;
        });
    })

    it('Required fields should be properly marked', () => {
        const missingRequired = []

        cy.get('input[required], select[required]').each(($field) => {
            const hasARIA = $field.attr('aria-required') === 'true'
            const hasVisualLabel = $field.parent().find('.required-indicator').length > 0

            if (!hasARIA && !hasVisualLabel) {
                missingRequired.push($field.parent().html())
            }
        });
        cy.then(() => {
            expect(missingRequired, `Fields missing required marking:\n ${missingRequired.join('\n')}`).to.be.empty;
        })
    })
})
