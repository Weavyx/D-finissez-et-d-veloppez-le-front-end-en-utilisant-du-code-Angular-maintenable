# Revue d'Architecture - Projet Angular Starter

## Objectif
Synthétiser les problèmes, risques, anti-patterns et recommandations pour améliorer la maintenabilité et l’évolutivité du projet Angular.

---

## Contexte et périmètre
- Analyse de `src/app` et `src/main.ts`.
- Résultat `ng lint` du 13 mars 2026.
- Hors périmètre : performance runtime, tests E2E, sécurité avancée.
- Méthode : lecture du code, revue des patterns Angular, consolidation lint, qualification des risques.

---

## Synthèse des risques et dette technique
| Constat                                   | Impact                                       | Priorité | Action recommandée                                                           | Fichier concerné                                                                                                                 |
|-------------------------------------------|----------------------------------------------|----------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Absence de couches `models` et `services` | Couplage fort, duplication des règles métier | P1       | Introduire un service de données olympiques + modèles types partagés         | src/app                                                                                                                          |
| Modularité limitée                        | Évolution fonctionnelle coûteuse             | P2       | Définir des frontières fonctionnelles (standalone components)                | src/app                                                                                                                          |
| Non-conformité lint globale               | Risque d’échec CI, baisse de maintenabilité  | P1       | Corriger `no-explicit-any`, `prefer-inject`, puis les cas restants           | src/app/pages/home/home.component.ts, src/app/pages/country/country.component.ts, src/app/pages/not-found/not-found.component.ts |
| Observabilité insuffisante                | Diagnostic incident lent                     | P2       | Mettre en place un `ErrorHandler` central et une stratégie de journalisation | src/main.ts                                                                                                                      |
| Test racine obsolète                      | Feedback qualité peu fiable                  | P1       | Aligner les assertions sur le comportement réel de `AppComponent`            | src/app/app.component.spec.ts                                                                                                    |

---

## Plan d’action priorisé
- Court terme : corriger les erreurs lint, restaurer les tests racine, retirer le code de debug.
- Moyen terme : créer les modèles métier, un service de données central, fiabiliser les flux RxJS, standardiser l’intégration graphique.
- Long terme : consolider la modularité, industrialiser la qualité, renforcer observabilité et accessibilité.

---

## Revue par composant
### AppComponent
- Composant racine minimal (`router-outlet`).
- Aucun appel HTTP, logique métier ou typage faible.
- Fichier SCSS vide (à nettoyer).

### HomeComponent
- Cumule HTTP, logique métier, graphique et navigation.
- Typage faible (`any`), code de debug, duplication de logique.
- Viol de séparation des responsabilités, dette de maintenance.
- Intégration graphique imperative, accessibilité limitée.

### CountryComponent
- Paramètres de route, HTTP, calculs métier et graphique regroupés.
- Typage faible, duplication de logique, gestion asynchrone fragile.
- Instance chart non détruite, risque de fuite mémoire.

### NotFoundComponent
- Composant simple, focalisé sur l’affichage d’erreur.
- Constructeur vide inutile, dimensions fixes dans le SCSS.

---

## Glossaire des anti-patterns Angular
- Appels HTTP dans les composants : privilégier les services.
- Logique métier dans les composants : extraire dans des services/facades.
- Typage faible (`any`) : formaliser les interfaces.
- Flux RxJS impératifs : composer les flux, utiliser `async` pipe.
- Gestion de cycle de vie des subscriptions : utiliser `takeUntilDestroyed`, `AsyncPipe`.
- Utilisation de `.pipe()` vide : supprimer ou ajouter des opérateurs.
- Intégration DOM imperative : utiliser `@ViewChild`, gérer le cycle de vie.
- Gestion d’erreur limitée à `console.error` : centraliser via un service.
- Logs de debug en production : utiliser un mécanisme de logging maîtrisé.
- Duplication de logique : mutualiser via services/facades.
- Tests non alignés : aligner sur le comportement réel.
- Conventions non homogènes : respecter le style guide Angular.
- Non-adoption de `prefer-inject` : uniformiser l’injection.
- Absence d’états UI explicites : rendre les états visibles dans le template.
- Accessibilité limitée : prévoir alternatives clavier/lecteur d’écran.
- Mise en page rigide : privilégier des layouts flexibles.

---

## Proposition de restructuration et checklist
### Arborescence cible
```
src/app/
  models/
    olympic.model.ts
    country.model.ts
    athlete.model.ts
  services/
    olympic-data.service.ts
    error-handler.service.ts
    logger.service.ts
  types/
    filter.type.ts
    enum.ts
    response.type.ts
  shared/
    loading-indicator.component.ts
    error-message.component.ts
    medal.pipe.ts
    country-flag.directive.ts
  components/
    country-summary.component.ts
    medal-chart.component.ts
    athlete-list.component.ts
  pages/
    home/
    country/
    not-found/
```

### Checklist actionnable
- [ ] Créer les dossiers et fichiers selon l’arborescence cible.
- [ ] Extraire la logique métier et les accès donnés dans des services.
- [ ] Formaliser les interfaces et types.
- [ ] Mutualiser les éléments réutilisables.
- [ ] Corriger les erreurs lint et typage.
- [ ] Améliorer la gestion d’erreur et l’observabilité.
- [ ] Adapter les tests racine.
- [ ] Rendre les états UI explicites et améliorer l’accessibilité.

---

## Notes
- Cette analyse est évolutive : adaptez-la selon les besoins du projet.
- Pour la structure cible, voir `ARCHITECTURE.md`.
- Pour les guides et ressources, voir `guide-utilisation.md` et `ressources.md`.
