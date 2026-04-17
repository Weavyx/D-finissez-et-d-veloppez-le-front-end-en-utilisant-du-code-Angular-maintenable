# Plan d’action de refonte – Angular moderne (synthèse enrichie)

---

## 📚 Documentation générale du projet

### Contexte
Ce projet Angular vise à illustrer une architecture front-end moderne, maintenable et accessible, en appliquant les meilleures pratiques du framework (Angular 16+), du typage TypeScript strict, et des standards d’accessibilité et de robustesse UI.

### Objectifs principaux
- **Architecture claire** : séparation stricte des responsabilités (`components/`, `pages/`, `models/`, `services/`, `shared/`, `types/`).
- **Typage strict** : aucune utilisation de `any`, interfaces/documentation systématiques.
- **Composants standalone** : suppression des modules Angular, routage moderne (`loadComponent`).
- **Accessibilité** : conformité ARIA, navigation clavier, contrastes, messages dynamiques.
- **UI explicite** : gestion centralisée des états (chargement, vide, erreur, succès), composants dédiés (`LoadingIndicatorComponent`, `ErrorMessageComponent`).
- **Réactivité robuste** : usage du pattern `async` pipe et/ou signals, nettoyage systématique des souscriptions.
- **Gestion des erreurs/logs** : centralisation via services dédiés, affichage UI cohérent.
- **Responsive** : support desktop/tablette/mobile, breakpoints testés.
- **Documentation** : chaque étape, choix technique, et structure sont documentés dans `/documentation/`.

### Bonnes pratiques à respecter
- Ne jamais merger de documentation temporaire dans `main`.
- Toujours partir de la branche `feature/architecture-refactor` pour toute nouvelle feature.
- Fournir une PR claire, avec checklist et message de commit explicite à chaque étape.
- Nettoyer le code mort, les imports, et les fichiers inutiles à chaque refactor.
- Tester systématiquement la navigation, la gestion d’erreur, la responsive et l’accessibilité avant validation.
- Utiliser les outils d’audit (Lighthouse, ESLint, etc.) pour garantir la conformité.

### Structure du dossier
- `src/app/components/` : composants réutilisables (listes, graphiques, etc.)
- `src/app/pages/` : pages principales (home, country, not-found)
- `src/app/models/` : interfaces et modèles de données
- `src/app/services/` : services métier, gestion des données, logs, erreurs
- `src/app/shared/` : pipes, directives, composants d’état
- `src/app/types/` : types utilitaires, enums, filtres
- `src/assets/mock/` : données de test (olympic.json)
- `documentation/` : guides, plans, instructions, architecture

---

> ⚠️ **Note important** :
> Ce fichier (`plan-refonte.md`), ainsi que `instructions.md` et `instructions-part-2.md`, ne doivent jamais être commités dans la branche `main`. Ils servent uniquement d’aide temporaire au refactoring et seront supprimés à la fin de la refonte.

> **Stratégie de branches** :
> - Toutes les branches de refonte (`feature/…`) sont créées à partir de `origin/feature/architecture-refactor`.
> - Chaque branche est mergée sur `feature/architecture-refactor` (jamais directement sur `main`).
> - Une fois la refonte totalement validée, un merge final sera réalisé de `feature/architecture-refactor` vers `main`.

Ce plan d’action intègre toutes les instructions, audits et spécifications fonctionnelles. Il détaille les branches à créer, les tâches concrètes restantes, les points de vigilance et les critères de validation pour garantir la conformité totale du projet.

---

## Procédure à chaque étape
- À la fin de chaque étape :
  - Fournir les commandes de commit Git à exécuter (prêtes à copier-coller).
  - Indiquer le titre et la description du Pull Request (PR) à ouvrir.
  - Donner le message de commit principal de la branche correspondante.
  - Attendre validation avant de passer à l’étape suivante.

---

## 1. `feature/refonte-architecture`
- **Objectif** : Finaliser la structure des dossiers, centraliser les éléments partagés, supprimer le code mort.
- **Actions** :
  - Vérifier l’arborescence cible (`models/`, `services/`, `shared/`, `components/`, `pages/`, `types/`).
  - Déplacer/renommer les fichiers si besoin, nettoyer les imports.
  - S’assurer qu’aucun code mort, duplicata ou fichier orphelin ne subsiste.
  - Mutualiser les composants/pipes/directives réutilisables dans `shared/`.
  - Vérifier la cohérence avec `ARCHITECTURE.md` et `notes-architecture.md`.
- **Dépendances** : Aucune.
- **Validation** : Structure conforme, imports cohérents, pas de code mort.

---

## 2. `feature/typage-strict`
- **Objectif** : Typage strict TypeScript partout.
- **Actions** :
  - Activer toutes les options strictes dans `tsconfig.json`.
  - Corriger tous les types faibles (`any`, `unknown`, etc.) dans le code applicatif.
  - Vérifier et documenter les interfaces dans `models/`.
  - S’assurer que tous les services, composants et pipes sont typés strictement.
- **Dépendances** : `feature/refonte-architecture`.
- **Validation** : Compilation sans warning/erreur de type, aucun `any` résiduel.

---

## 3. `feature/standalone-components`
- **Objectif** : Tous les composants/pages standalone, suppression des modules Angular.
- **Actions** :
  - Vérifier que chaque composant/page/pipe/directive est standalone (`standalone: true`).
  - Nettoyer les éventuels modules restants.
  - Adapter le routage pour n’utiliser que `loadComponent`.
  - Vérifier la cohérence des imports et la documentation.
- **Dépendances** : `feature/refonte-architecture`.
- **Validation** : Plus de modules, tout standalone, routage moderne.

---

## 4. `feature/accessibilite-ui`
- **Objectif** : Accessibilité (ARIA, navigation clavier), responsive, UI explicite.
- **Actions** :
  - Vérifier/corriger tous les labels, attributs ARIA, contrastes, navigation clavier.
  - S’assurer que les composants d’état (`LoadingIndicatorComponent`, `ErrorMessageComponent`) sont utilisés partout où nécessaire.
  - Tester la responsive sur desktop, tablette, mobile (breakpoints, flex/grid).
  - Rendre explicites tous les états UI (chargement, vide, erreur, succès).
  - Vérifier la conformité avec les recommandations d’accessibilité (audit Lighthouse > 90).
- **Dépendances** : `feature/standalone-components`.
- **Validation** : Audit Lighthouse > 90, navigation clavier, responsive validé.

---

## 5. `feature/gestion-erreur-logs` ✅ TERMINÉ
- **Objectif** : Gestion centralisée des erreurs et logs.
- **Actions réalisées** :
   - Utilisation d’`error-handler.service.ts`, `logger.service.ts` partout.
   - Toutes les erreurs sont capturées et affichées via `error-message.component.ts`.
   - Suppression de tous les `console.log`.
   - Tests d’affichage UI et robustesse validés.
- **Dépendances** : `feature/refonte-architecture`, `feature/typage-strict`.
- **Validation** : Erreurs affichées proprement, logs cohérents, pas d’erreur silencieuse.

---

## 6. Finalisation technique de la refonte : robustesse, accessibilité, réactivité

### Objectifs techniques et organisationnels
- **Chargement unique des données** :
  - Centraliser le chargement du JSON dans `AppComponent` avec `take(1)` pour éviter tout double chargement.
  - Exposer les données via un service (ex : `OlympicDataService`) avec un `BehaviorSubject` ou équivalent.
- **Gestion des souscriptions** :
  - Identifier et corriger toutes les souscriptions non nettoyées (unsubscribe ou `takeUntil`, ou suppression via async pipe/signals).
  - Privilégier l’usage de l’`async` pipe partout où possible.
- **Réactivité moderne** :
  - Utiliser les signals dans `HomeComponent` si pertinent, sinon rester sur l’approche observable classique dans les autres composants.
  - S’assurer que tous les états UI (chargement, vide, erreur, succès) sont explicites et accessibles (ARIA, rôles, messages dynamiques).
- **Accessibilité et responsive** :
  - Vérifier/corriger tous les labels, attributs ARIA, contrastes, navigation clavier.
  - Tester la responsive sur desktop, tablette, mobile (breakpoints, flex/grid).
  - Audit Lighthouse > 90.
- **Nettoyage** :
  - Supprimer tout code mort, imports inutiles, fichiers obsolètes.

### Checklist exhaustive pour la finalisation technique
- [ ] Refactorer le chargement des données dans `AppComponent` (take(1), centralisation).
- [ ] Adapter tous les composants pour consommer les données via le service centralisé.
- [ ] Remplacer toutes les souscriptions manuelles par l’`async` pipe ou signals, ou s’assurer de leur nettoyage.
- [ ] Rendre explicites tous les états UI (chargement, vide, erreur, succès) dans chaque page/composant.
- [ ] Vérifier/corriger l’accessibilité sur tous les composants/pages.
- [ ] Tester la responsive sur tous les breakpoints.
- [ ] Nettoyer le code mort, les imports, les fichiers inutiles.
- [ ] Vérifier la conformité à toutes les instructions, audits et spécifications fonctionnelles.
- [ ] Préparer la PR de finalisation technique avec un message de commit clair et une checklist de validation.

### Points de vigilance
- Ne jamais recharger le JSON plus d’une fois (vérifier navigation rapide).
- Ne jamais laisser de souscription non nettoyée.
- Toujours privilégier l’`async` pipe/signals pour la réactivité.
- S’assurer que chaque état UI est visible, accessible et testé.
- Ne jamais merger de documentation temporaire dans `main`.

### SMART objectifs (rappel)
- Mettre en place un chargement unique des données depuis AppComponent avec take(1).
- Identifier et corriger les souscriptions non correctement gérées dans l’application.
- Appliquer les ajustements restants sur async pipe, signals et finaliser le projet 2.

----

## 7. `feature/documentation-finale`
- **Objectif** : Documentation technique et utilisateur à jour.
- **Actions** :
  - Mettre à jour `README.md`, `/documentation/`, `ARCHITECTURE.md`.
  - Documenter la structure, les choix techniques, l’utilisation, la contribution.
  - Ajouter des exemples d’utilisation, captures d’écran, instructions de lancement.
  - Vérifier la cohérence entre code, structure et documentation.
- **Dépendances** : Toutes les étapes précédentes.
- **Validation** : Documentation complète, claire, structurée.

----

## Checklist actionnable
- [x] Créer chaque branche au moment de démarrer l’étape correspondante (depuis `feature/architecture-refactor`).
- [x] Réaliser les PR dans l’ordre, à merge sur `feature/architecture-refactor`.
- [x] À la fin de chaque étape, fournir :
    - Les commandes de commit Git à exécuter (prêtes à copier-coller).
    - Le titre et la description de la PR
    - Le message de commit principal de la branche
- [x] Valider chaque étape avant de passer à la suivante.
- [ ] Mettre à jour la documentation.
- [ ] Vérifier la conformité à toutes les instructions, audits et spécifications fonctionnelles.
- [ ] Nettoyer le code mort, les imports, les fichiers inutiles.
- [ ] Tester la navigation, la gestion d’erreur, la responsive, l’accessibilité.
- [ ] Une fois la refonte validée, merger `feature/architecture-refactor` vers `main`.

----

Ce plan garantit une organisation claire, une gestion des dépendances et une intégration progressive de la nouvelle architecture Angular moderne, en conformité stricte avec toutes les instructions, audits et bonnes pratiques.
