# Plan d'action de refonte – Angular moderne (synthèse enrichie)

---

## Documentation générale du projet

### Contexte
Ce projet Angular vise à illustrer une architecture front-end moderne, maintenable et accessible, en appliquant les meilleures pratiques du framework (Angular 16.2.12), du typage TypeScript strict, et des standards d'accessibilité et de robustesse UI.

### Objectifs principaux
- **Architecture claire** : séparation stricte des responsabilités (`components/`, `pages/`, `models/`, `services/`, `shared/`, `types/`).
- **Typage strict** : aucune utilisation de `any`, interfaces/documentation systématiques.
- **Composants standalone** : suppression des modules Angular, routage moderne (`loadComponent`).
- **Accessibilité** : conformité ARIA, navigation clavier, contrastes, messages dynamiques.
- **UI explicite** : gestion centralisée des états (chargement, vide, erreur, succès), composants dédiés (`LoadingIndicatorComponent`, `ErrorMessageComponent`).
- **Réactivité robuste** : usage du pattern signals + `takeUntilDestroyed`, nettoyage systématique des souscriptions.
- **Gestion des erreurs/logs** : centralisation via services dédiés, affichage UI cohérent.
- **Responsive** : support desktop/tablette/mobile, breakpoints testés.
- **Documentation** : chaque étape, choix technique, et structure sont documentés dans `/documentation/`.

### Contraintes de version à respecter
- **Angular 16.2.12** : les blocs `@if`/`@for` (Angular 17+) ne sont PAS disponibles. Utiliser `*ngIf`/`*ngFor`. La règle ESLint `@angular-eslint/template/prefer-control-flow` doit rester désactivée.
- **`afterNextRender` / `afterRender`** : disponibles depuis Angular 16.2. À utiliser pour toute manipulation DOM (Chart.js). Ne pas utiliser `effect()` pour du DOM.
- **`takeUntilDestroyed`** : disponible depuis Angular 16. Remplace le pattern `OnDestroy` + `unsubscribe()` manuel.
- **`toSignal` avec `{ requireSync: true }`** : à utiliser sur les `BehaviorSubject` pour éviter le type `undefined` superflu.
- **ESLint 9 + `angular-eslint` 21** : utilise le format flat config (`eslint.config.mjs`), pas `.eslintrc.json`.

### Bonnes pratiques à respecter
- Ne jamais merger de documentation temporaire dans `main`.
- Toujours créer les branches depuis `feature/architecture-refactor`.
- Chaque branche est mergée sur `feature/architecture-refactor` (jamais directement sur `main`).
- Ne jamais faire `git add .` — toujours ajouter les fichiers explicitement.
- Commits réguliers par tâche, message de commit explicite.
- Tester `ng serve` et `ng lint` avant chaque push.

### Fichiers à ne jamais commiter dans `main`
- `documentation/plan-refonte.md`
- `documentation/instructions.md`
- `documentation/instructions-part-2.md`
- `documentation/todo-git-pr.txt`

---

## Stratégie de branches
- Toutes les branches (`feature/…`) sont créées depuis `feature/architecture-refactor`.
- Chaque branche est mergée sur `feature/architecture-refactor` via PR.
- Merge final : `feature/architecture-refactor` → `main` (avec suppression des docs temporaires).

---

## Étapes 1 à 7 ✅ TERMINÉES

| Étape | Branche | PR |
|---|---|---|
| 1 – Refonte architecture | `feature/refonte-architecture` | #10 |
| 2 – Typage strict | `feature/typage-strict` | #11 |
| 3 – Standalone components | `feature/standalone-components` | #12 |
| 4 – Accessibilité UI | `feature/accessibilite-ui` | #13 |
| 5 – Gestion erreurs/logs | `feature/gestion-erreur-logs` | #14, #15 |
| 6 – Centralisation data/UI | `feature/centralisation-data-ui` | #16 |
| 7 – Signals HomeComponent | `feature/signal-homecomponent` | #17 |

---

## 8. `feature/documentation-finale` — EN COURS (branche actuelle)

### Objectif
Documentation technique complète à jour + correctifs de base identifiés lors de la revue critique + configuration ESLint valide.

### Actions
- Corriger `.eslintrc.json` (fichier cassé avec des commentaires JS non valides et contenu incomplet) → le remplacer par `eslint.config.mjs` (format requis par ESLint 9 + angular-eslint 21).
- Commiter les corrections de code déjà réalisées (take(1), chart.js bump, fix canvas Home, CountryComponent Chart.js, suppression des logs).
- Créer `README.md` à la racine avec : prérequis, installation, lancement, structure, architecture.
- Mettre à jour `documentation/ARCHITECTURE.md` pour refléter l'état actuel (suppression des références à `loading$`/`error$` dans le service, pattern Chart.js actuel).
- Commiter `CLAUDE.md` et la mise à jour de ce plan.

### Checklist
- [ ] `eslint.config.mjs` créé et valide (`ng lint` passe sans erreur)
- [ ] `.eslintrc.json` supprimé (remplacé par flat config)
- [ ] Correctifs core committés
- [ ] `README.md` créé
- [ ] `ARCHITECTURE.md` à jour
- [ ] `CLAUDE.md` commité

### Commits à réaliser dans l'ordre

```bash
# 1. Config ESLint — remplacer le fichier cassé par la flat config valide
git rm .eslintrc.json
git add eslint.config.mjs
git commit -m "chore(lint): migrate to ESLint 9 flat config (eslint.config.mjs)"
```

```bash
# 2. Correctifs core
git add src/app/app.component.ts src/app/services/olympic-data.service.ts package.json package-lock.json
git commit -m "fix(core): add take(1) to data loading subscription and bump chart.js to 4.5.1"
```

```bash
# 3. Correction bug graphique Home
git add src/app/pages/home/home.component.ts src/app/pages/home/home.component.html
git commit -m "fix(home): move canvas outside *ngIf to resolve ViewChild timing bug with effect()"
```

```bash
# 4. CountryComponent — implémentation Chart.js + nettoyage logs
git add src/app/pages/country/country.component.ts src/app/pages/country/country.component.html
git commit -m "feat(country): implement Chart.js line chart and remove debug logs"
```

```bash
# 5. README (à créer avant ce commit)
git add README.md
git commit -m "docs: add README with prerequisites, setup, architecture overview"
```

```bash
# 6. Documentation technique + CLAUDE.md
git add documentation/ARCHITECTURE.md CLAUDE.md
git commit -m "docs: update ARCHITECTURE.md to match current implementation, add CLAUDE.md"
```

```bash
# 7. Mise à jour du plan
git add documentation/plan-refonte.md
git commit -m "docs(plan): revise steps 8-11 based on Angular 16 critical review"
```

### Push
```bash
git push origin feature/documentation-finale
```

### PR
- **Base** : `feature/architecture-refactor`
- **Head** : `feature/documentation-finale`
- **Titre** : `docs: finalisation documentation et correctifs de base`
- **Description** :
  - Migration ESLint 9 flat config (`eslint.config.mjs`)
  - Correctifs identifiés lors de la revue critique : `take(1)`, canvas HomeComponent hors `*ngIf`, Chart.js CountryComponent, suppression logs debug
  - Bump chart.js 4.2.1 → 4.5.1
  - Ajout README.md, mise à jour ARCHITECTURE.md, ajout CLAUDE.md
  - Plan de refonte mis à jour avec les étapes 9 et 10

---

## 9. `feature/bugfixes-critiques`

### Objectif
Corriger les bugs critiques identifiés lors de la revue : écran blanc sur pays introuvable, bug ViewChild identique à Home dans CountryComponent, `console.error` résiduel, `ErrorHandlerService` injecté mais jamais utilisé.

### Prérequis
PR de l'étape 8 mergée sur `feature/architecture-refactor`.

### Création de la branche
```bash
git checkout feature/architecture-refactor
git pull origin feature/architecture-refactor
git checkout -b feature/bugfixes-critiques
```

### Actions
1. **CountryComponent — pays introuvable** : si `getCountry()` retourne `undefined` après chargement des données, rediriger vers `/not-found` via `Router`. Actuellement l'écran est blanc sans message ni redirection.
2. **CountryComponent — bug ViewChild** : le canvas `#countryChart` est dans un `*ngIf="getCountry(countries) as country"`. Si les données arrivent après `ngAfterViewInit` (navigation directe vers `/country/X`), `countryChartRef` est `undefined` dans la souscription et le filtre bloque — même classe de bug que Home. Déplacer le canvas hors du `*ngIf` et utiliser `[hidden]`.
3. **CountryComponent — `console.error` résiduel** : ligne 114 dans `buildLineChart`, non supprimé lors du nettoyage précédent.
4. **CountryComponent — `ErrorHandlerService` inutilisé** : injecté dans les dépendances mais jamais appelé. L'utiliser dans `buildLineChart` ou le supprimer.

### Checklist
- [ ] Navigation directe vers `/country/France` → graphique visible
- [ ] Navigation vers `/country/PaysInexistant` → redirection vers `/not-found`
- [ ] Aucun `console.error` dans le code applicatif
- [ ] `ErrorHandlerService` utilisé ou supprimé des dépendances

### Commits à réaliser dans l'ordre

```bash
# 1. Redirect quand pays introuvable
git add src/app/pages/country/country.component.ts
git commit -m "fix(country): redirect to /not-found when countryName does not match any data entry"
```

```bash
# 2. Correction bug ViewChild canvas (même cause que Home)
git add src/app/pages/country/country.component.html src/app/pages/country/country.component.ts
git commit -m "fix(country): move canvas outside *ngIf to ensure ViewChild resolves before subscription fires"
```

```bash
# 3. Suppression console.error + résolution ErrorHandlerService
git add src/app/pages/country/country.component.ts
git commit -m "fix(country): remove console.error and wire ErrorHandlerService in buildLineChart catch"
```

```bash
# 4. Mise à jour du plan
git add documentation/plan-refonte.md
git commit -m "docs(plan): mark step 9 complete"
```

### Push
```bash
git push origin feature/bugfixes-critiques
```

### PR
- **Base** : `feature/architecture-refactor`
- **Head** : `feature/bugfixes-critiques`
- **Titre** : `fix(country): critical bug fixes on CountryComponent`
- **Description** :
  - Redirection vers `/not-found` quand le paramètre de route ne correspond à aucun pays
  - Correction du bug ViewChild/timing sur le canvas (même cause que HomeComponent)
  - Suppression du `console.error` résiduel
  - `ErrorHandlerService` correctement utilisé dans le catch de `buildLineChart`

---

## 10. `feature/angular16-bonnes-pratiques`

### Objectif
Appliquer les fonctionnalités Angular 16.2 qui n'étaient pas dans le plan initial : `afterNextRender` pour Chart.js, `takeUntilDestroyed` pour les souscriptions, `OnPush` cohérent sur tous les composants, `requireSync` sur les BehaviorSubject, calculs extraits du template vers des propriétés.

### Prérequis
PR de l'étape 9 mergée sur `feature/architecture-refactor`.

### Création de la branche
```bash
git checkout feature/architecture-refactor
git pull origin feature/architecture-refactor
git checkout -b feature/angular16-bonnes-pratiques
```

### Actions

**1. HomeComponent — `afterNextRender` à la place de `effect()` pour Chart.js**

`effect()` réagit aux changements de signaux, pas aux mises à jour du DOM. Pour toute création de chart Chart.js, utiliser `afterNextRender` (disponible depuis Angular 16.2) qui s'exécute après chaque cycle de rendu, garantissant que le canvas est dans le DOM.

```typescript
import { afterNextRender } from '@angular/core';

constructor() {
  afterNextRender(() => {
    // création du chart ici, canvas toujours disponible
  });
}
```

**2. `ChangeDetectionStrategy.OnPush` sur HomeComponent**

`CountryComponent` l'applique déjà. `HomeComponent` ne l'a pas. Avec les signals, `OnPush` fonctionne nativement — Angular sait exactement quand re-rendre.

**3. CountryComponent — `takeUntilDestroyed` à la place de `OnDestroy` + `unsubscribe()`**

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

private destroyRef = inject(DestroyRef);

ngAfterViewInit() {
  this.countries$.pipe(
    takeUntilDestroyed(this.destroyRef),
    filter(...)
  ).subscribe(...);
}
// Plus besoin de chartSub?: Subscription ni de ngOnDestroy pour la souscription
```

**4. `toSignal` avec `{ requireSync: true }` pour les BehaviorSubject**

`BehaviorSubject` émet toujours synchronement. Avec `{ requireSync: true }`, le type du signal est `Country[] | null` (pas `Country[] | null | undefined`), ce qui évite les `?? []` défensifs partout.

```typescript
// Avant
public countries = toSignal(this.olympicService.countries$, { initialValue: [] as Country[] });
// Après
public countries = toSignal(this.olympicService.countries$, { requireSync: true });
```

**5. CountryComponent — méthodes template → propriétés calculées**

Appeler `getCountry()`, `getTotalMedals()` etc. depuis le template est un anti-pattern avec `OnPush` (recalcul à chaque CD). Les extraire en propriétés résolues une fois lors de la souscription.

### Checklist
- [ ] `afterNextRender` utilisé dans HomeComponent pour Chart.js
- [ ] `ChangeDetectionStrategy.OnPush` sur HomeComponent
- [ ] `takeUntilDestroyed` dans CountryComponent, `ngOnDestroy` supprimé (ou réduit au seul `this.chart?.destroy()`)
- [ ] `requireSync: true` sur les `toSignal` de BehaviorSubject
- [ ] Méthodes utilitaires extraites du template dans CountryComponent
- [ ] `ng lint` passe sans erreur
- [ ] `ng serve` : les deux graphiques s'affichent correctement
- [ ] `ARCHITECTURE.md` mis à jour pour documenter ces patterns

### Commits à réaliser dans l'ordre

```bash
# 1. HomeComponent : afterNextRender + OnPush
git add src/app/pages/home/home.component.ts
git commit -m "refactor(home): replace effect() with afterNextRender for Chart.js, apply OnPush"
```

```bash
# 2. CountryComponent : takeUntilDestroyed
git add src/app/pages/country/country.component.ts
git commit -m "refactor(country): replace OnDestroy+Subscription with takeUntilDestroyed"
```

```bash
# 3. requireSync + computed stats extraits du template
git add src/app/pages/home/home.component.ts src/app/pages/country/country.component.ts
git commit -m "refactor(signals): use requireSync for BehaviorSubject toSignal, extract template methods to computed properties"
```

```bash
# 4. Documentation
git add documentation/ARCHITECTURE.md documentation/plan-refonte.md
git commit -m "docs: document Angular 16.2 patterns (afterNextRender, takeUntilDestroyed, requireSync)"
```

### Push
```bash
git push origin feature/angular16-bonnes-pratiques
```

### PR
- **Base** : `feature/architecture-refactor`
- **Head** : `feature/angular16-bonnes-pratiques`
- **Titre** : `refactor: apply Angular 16.2 best practices`
- **Description** :
  - `afterNextRender` pour la création des charts Chart.js (remplacement de `effect()`)
  - `ChangeDetectionStrategy.OnPush` appliqué sur HomeComponent (cohérence avec CountryComponent)
  - `takeUntilDestroyed(DestroyRef)` remplace le pattern `OnDestroy` + `unsubscribe()` manuel dans CountryComponent
  - `toSignal` avec `{ requireSync: true }` sur les BehaviorSubject
  - Méthodes utilitaires extraites du template vers des propriétés calculées
  - `ARCHITECTURE.md` mis à jour

---

## 11. Merge final `feature/architecture-refactor` → `main`

### Objectif
Supprimer les fichiers de documentation temporaires puis merger la refonte complète dans `main`.

### Prérequis
PR de l'étape 10 mergée sur `feature/architecture-refactor`.

### Actions

```bash
# Se positionner sur feature/architecture-refactor à jour
git checkout feature/architecture-refactor
git pull origin feature/architecture-refactor

# Supprimer les docs temporaires (instructions et plan-refonte suivis par git)
git rm documentation/plan-refonte.md
git commit -m "chore: remove temporary planning docs before merge to main"

git push origin feature/architecture-refactor
```

> `instructions.md`, `instructions-part-2.md` et `todo-git-pr.txt` sont non-trackés → ils ne sont pas dans l'historique, rien à faire.

### PR
- **Base** : `main`
- **Head** : `feature/architecture-refactor`
- **Titre** : `feat: Angular 16.2 refactored Olympic Games app`
- **Description** :
  - Architecture standalone complète (sans NgModule)
  - Typage TypeScript strict, zéro `any`
  - Signals Angular 16 (HomeComponent), `takeUntilDestroyed`, `afterNextRender`
  - `OlympicDataService` avec `BehaviorSubject`, chargement unique depuis `AppComponent`
  - Gestion centralisée des erreurs (`ErrorHandlerService` + `LoggerService`)
  - Routing moderne (`loadComponent`), redirection `/not-found` sur URL inconnue ou pays absent
  - Chart.js : pie chart interactif (Home), line chart (Country)
  - Accessibilité ARIA, responsive, `ChangeDetectionStrategy.OnPush` partout
  - ESLint 9 flat config, `ng lint` propre
  - README et ARCHITECTURE.md complets

---

## Points de vigilance globaux

- Ne jamais utiliser `effect()` pour de la manipulation DOM → `afterNextRender`.
- Ne jamais utiliser `*ngIf`/`@if` interchangeablement : `@if` est Angular 17+, ce projet est en 16.2.12.
- `BehaviorSubject` → toujours `toSignal` avec `{ requireSync: true }`.
- Canvas Chart.js → toujours hors de tout `*ngIf` pour que `@ViewChild` soit résolu.
- `ChangeDetectionStrategy.OnPush` → obligatoire sur tous les composants.
- Souscriptions → toujours `takeUntilDestroyed`, jamais de `ngOnDestroy` + `unsubscribe()` manuel.
