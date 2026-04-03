# ARCHITECTURE.md

## Objectif
Ce document présente l’organisation, les choix d’architecture et les fichiers à créer pour garantir la clarté, l’évolutivité et la maintenabilité du front-end Angular, en s’appuyant sur les pratiques Angular modernes (standalone components, routage standalone, signals, OnPush, etc.).

---

## Structure complète du projet (Angular moderne)
```
D-finissez-et-d-veloppez-le-front-end-en-utilisant-du-code-Angular-maintenable/
  ...fichiers racine (config, documentation)...
  src/
    index.html
    favicon.ico
    styles.scss
    main.ts
    polyfills.ts
    test.ts
    app/
      app.component.ts/.html/.scss/.spec.ts # Composant racine (standalone)
      app.routes.ts                        # Définition des routes (standalone)
      pages/
        home/
          home.component.ts/.html/.scss/.spec.ts # Page d'accueil (standalone)
        country/
          country.component.ts/.html/.scss/.spec.ts # Page pays (standalone)
        not-found/
          not-found.component.ts/.html/.scss/.spec.ts # Page erreur 404 (standalone)
      models/
        olympic.model.ts          # Interface Olympic, Participation
        country.model.ts          # Interface pays
        athlete.model.ts          # Interface athlète
      services/
        olympic-data.service.ts   # Service accès données olympiques
        error-handler.service.ts   # Service gestion d'erreur
        logger.service.ts          # Service journalisation
      types/
        filter.type.ts            # Types utilitaires
        enum.ts                   # Enumérations
        response.type.ts          # Typage réponse HTTP/mock
      shared/
        loading-indicator.component.ts  # Composant état de chargement (standalone)
        error-message.component.ts      # Composant affichage erreurs (standalone)
        medal.pipe.ts                   # Pipe format médailles (standalone)
        country-flag.directive.ts       # Directive drapeau pays (standalone)
      components/
        country-summary.component.ts    # UI résumé pays (standalone)
        medal-chart.component.ts        # UI graphique médailles (standalone)
        athlete-list.component.ts       # UI liste athlètes (standalone)
    assets/
      images/
        teleSport.png
      mock/
        olympic.json
    environments/
      environment.ts
      environment.prod.ts
```

---

## Explications par dossier (Angular moderne)
- **models/** : Interfaces TypeScript pour le typage strict des données métier.
- **services/** : Services Angular pour la logique métier, accès données, gestion d’erreur.
- **types/** : Types utilitaires, enums, typage des réponses.
- **shared/** : Composants, pipes, directives réutilisables, tous standalone.
- **components/** : Composants UI spécifiques, standalone, pour le découpage d’éléments complexes.
- **pages/** : Composants de pages, standalone, chaque dossier représente une vue principale.
- **assets/** : Images, données mockées.
- **environments/** : Configurations d’environnement Angular.

---

## Principes et avantages (Angular moderne)
- **Standalone components** : Suppression des modules, chaque composant/directive/pipe est autonome et importable directement.
- **Signals** : Gestion d’état locale réactive, plus simple et performante que RxJS pour les cas courants.
- **ChangeDetection OnPush** : Tous les composants utilisent la stratégie OnPush pour des performances optimales.
- **Typage strict** : Interfaces et types pour fiabiliser le code.
- **Réutilisabilité** : Mutualisation des éléments dans `shared/`.
- **Modularité** : Ajout facile de nouvelles fonctionnalités, découplage maximal.
- **Préparation à l’API** : Services prêts pour l’intégration d’un back-end, injection moderne.
- **Maintenance facilitée** : Structure claire, évolutive, adaptée à la CI/CD.
- **Gestion centralisée des erreurs et du logging** :
  - Toutes les erreurs sont capturées par un service ErrorHandlerService global, qui utilise LoggerService pour la journalisation.
  - Aucun usage direct de `console.log` dans le code applicatif.
- **États UI explicites et accessibilité** :
  - Les états de chargement et d’erreur sont affichés via des composants dédiés (`LoadingIndicatorComponent`, `ErrorMessageComponent`).
  - Les composants d’état utilisent les attributs ARIA et role appropriés pour garantir l’accessibilité (notamment pour les lecteurs d’écran).

---

## Checklist actionnable (Angular moderne)
- [ ] Créer les dossiers `models`, `services`, `types`, `shared`, `components` dans `src/app/`
- [ ] Ajouter les interfaces métier dans `models/`
- [ ] Implémenter les services de données et d’erreur dans `services/`
- [ ] Définir les types utilitaires dans `types/`
- [ ] Mutualiser les composants/pipes/directives standalone dans `shared/`
- [ ] Extraire les UI spécifiques standalone dans `components/`
- [ ] Vérifier la cohérence des pages standalone dans `pages/`
- [ ] Utiliser les signals pour la gestion d’état locale
- [ ] Appliquer la stratégie OnPush partout
- [ ] Documenter et maintenir la structure dans `ARCHITECTURE.md`

---

## Notes
- Cette architecture est évolutive : adaptez-la selon les besoins du projet.
- Pour les anti-patterns et problèmes identifiés, voir `notes-architecture.md`.
- Pour les guides et ressources, voir `guide-utilisation.md`, `nouvelles-pratiques-angular.md` et `ressources.md`.
