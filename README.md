# 🧪 Testy dostępności e-konkursy.info

Projekt do automatycznego testowania dostępności strony [e-konkursy.info](https://www.e-konkursy.info/) z wykorzystaniem
**Cypress**, **axe-core** i **Lighthouse**.

---

## 📦 Instalacja

1. Klonujemy repozytorium:

```bash
git clone https://github.com/pionas/e-Konkursy-accessibility.git
cd e-Konkursy-accessibility
```

2. Instalujemy zależności:

```bash
npm install
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

* **GUI (tryb interaktywny)**:

```bash
npx cypress open
```

* **CLI (headless, różne przeglądarki i rozdzielczości)**:

```bash
npm run test:all
```

* **Lighthouse (Accessibility + Performance)**:

```bash
npm run test:lighthouse
```

> Po uruchomieniu Lighthouse w katalogu `wyniki/` zostaną zapisane raporty HTML i JSON, a w README.md zostanie
> zaktualizowana tabela wyników.

---

## 📜 Skrypty w `package.json`

```json
"scripts": {
"test:chrome": "npm run test:chrome:desktop && npm run test:chrome:tablet && npm run test:chrome:mobile",
"test:firefox": "npm run test:firefox:desktop && npm run test:firefox:tablet && npm run test:firefox:mobile",
"test:edge": "npm run test:edge:desktop && npm run test:edge:tablet && npm run test:edge:mobile",
"test:all": "npm run test:chrome && npm run test:firefox && npm run test:edge && npm run test:lighthouse",
"test:open": "cypress open",
"test:lighthouse": "node run-lighthouse.js"
}
```

* Testy Cypress w trybie headless uruchamiają się w **trzech przeglądarkach** i **trzech rozdzielczościach** (desktop,
  tablet, mobile).
* `run-lighthouse.js` generuje raporty Lighthouse i automatycznie aktualizuje tabelę wyników w README.md.

---

## ✅ Rezultaty

### Cypress / axe-core

* Raport błędów pojawia się w konsoli (Cypress GUI lub terminal).
* Możesz filtrować tylko krytyczne/poważne błędy (`minor`, `moderate`, `serious`, `critical`).

### Lighthouse

<!-- LIGHTHOUSE TABLE START -->
| URL | Accessibility | Performance |
| --- | --- | --- |
| https://www.e-konkursy.info/ | 100 | 80 |
| https://www.e-konkursy.info/rejestracja | 95 | 99 |
| https://www.e-konkursy.info/kontakt | 95 | 98 |
| https://www.e-konkursy.info/konkursy | 96 | 97 |
| https://www.e-konkursy.info/konkursy/konkursy-aktualne | 91 | 97 |
| https://www.e-konkursy.info/konkursy-dzisiaj-dodane | 100 | 98 |
| https://www.e-konkursy.info/forum/inne/zbieramy-kase | 96 | 98 |
| https://www.e-konkursy.info/forum | 91 | 99 |
| https://www.e-konkursy.info/uzytkownicy/pionas | 92 | 99 |
| https://www.e-konkursy.info/mapa-strony | 96 | 99 |
| https://www.e-konkursy.info/statystyki | 100 | 98 |
| https://www.e-konkursy.info/aktualnosci | 96 | 92 |
<!-- LIGHTHOUSE TABLE END -->






> Tabela jest automatycznie aktualizowana przy każdym uruchomieniu `npm run test:lighthouse`.

---

## 📚 Dokumentacja

* [Cypress](https://docs.cypress.io/)
* [cypress-axe](https://github.com/component-driven/cypress-axe)
* [axe-core](https://github.com/dequelabs/axe-core)
* [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## ⚙️ GitHub Actions (CI)

Plik `.github/workflows/accessibility-tests.yml` uruchamia testy na push/pull request na branchach `main` i `develop`.
Raporty są przesyłane jako artefakty (`wyniki/`), w tym CSV i HTML.

---

## 📝 Uwagi

* `urls.txt` – lista stron do audytu Lighthouse (po jednej URL w linii).
* `run-lighthouse.js` aktualizuje tabelę w README.md.
