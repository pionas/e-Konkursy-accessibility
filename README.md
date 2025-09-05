# 🧪 Testy dostępności e-konkursy.info

Projekt do automatycznego testowania dostępności strony [e-konkursy.info](https://www.e-konkursy.info/) z wykorzystaniem **Cypress** i **axe-core**.

## 📦 Instalacja

1. Klonujemy repozytorium:
   ```bash
   git clone https://github.com/pionas/e-Konkursy-accessibility.git
   cd ekonkursy-accessibility
   ```

2. Instalujemy zależności:
   ```bash
   npm install --save-dev axe-core cypress cypress-axe
   ```

3. (Opcjonalnie) jeżeli projekt nie ma jeszcze `package.json`, utwórz go:
   ```bash
   npm init -y
   ```

---

## ⚙️ Konfiguracja Cypress

1. Uruchamiamy Cypress po raz pierwszy:
   ```bash
   npx cypress open
   ```
   To stworzy katalog `cypress/` i podstawową strukturę projektu.

2. W pliku `cypress/support/e2e.js` dodajemy integrację z `cypress-axe`:
   ```javascript
   import 'cypress-axe';
   ```

3. Tworzymy przykładowy test w `cypress/e2e/accessibility.cy.js`:
   ```javascript
   describe('Test dostępności strony e-konkursy.info', () => {
     it('Powinien być wolny od poważnych błędów a11y', () => {
       cy.visit('https://www.e-konkursy.info/');
       cy.injectAxe();
       cy.checkA11y(null, {
         includedImpacts: ['critical', 'serious']
       });
     });
   });
   ```

---

## ▶️ Uruchamianie testów

- **GUI (tryb interaktywny)**:
  ```bash
  npx cypress open
  ```

- **CLI (headless, Chrome)**:
  ```bash
  npm run test:a11y
  ```

---

## 📜 Skrypty w `package.json`

```json
"scripts": {
  "test": "npm run test:a11y",
  "test:a11y": "cypress run --spec 'cypress/e2e/**/*.cy.js' --browser chrome",
  "test:open": "cypress open"
}
```

---

## ✅ Rezultaty

- Testy wykorzystują **axe-core** (standard w branży do sprawdzania dostępności wg WCAG).
- Raport błędów pojawia się w konsoli (Cypress GUI lub terminal).
- Możesz filtrować tylko krytyczne/poważne błędy albo wszystkie (`minor`, `moderate`, `serious`, `critical`).

---

## 📚 Dokumentacja

- [Cypress](https://docs.cypress.io/)
- [cypress-axe](https://github.com/component-driven/cypress-axe)
- [axe-core](https://github.com/dequelabs/axe-core)  
