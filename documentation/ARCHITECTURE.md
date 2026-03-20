# ARCHITECTURE.md

## Objectif
Ce document présente l’organisation, les choix d’architecture et les fichiers à créer pour garantir la clarté, l’évolutivité et la maintenabilité du front-end Angular.

---

## Structure complète du projet
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
      app.module.ts                # Module racine
      app-routing.module.ts        # Module de routage
      app.component.ts/.html/.scss/.spec.ts # Composant racine
      pages/
        home/
          home.component.ts/.html/.scss/.spec.ts # Page d'accueil
        country/
          country.component.ts/.html/.scss/.spec.ts # Page pays
        not-found/
          not-found.component.ts/.html/.scss/.spec.ts # Page erreur 404
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
        loading-indicator.component.ts  # Composant état de chargement
        error-message.component.ts      # Composant affichage erreurs
        medal.pipe.ts                   # Pipe format médailles
        country-flag.directive.ts       # Directive drapeau pays
      components/
        country-summary.component.ts    # UI résumé pays
        medal-chart.component.ts        # UI graphique médailles
        athlete-list.component.ts       # UI liste athlètes
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

## Explications par dossier
- **models/** : Interfaces TypeScript pour le typage strict des données métier.
- **services/** : Services Angular pour la logique métier, accès données, gestion d’erreur.
- **types/** : Types utilitaires, enums, typage des réponses.
- **shared/** : Composants, pipes, directives réutilisables.
- **components/** : Composants UI spécifiques, découpage d’éléments complexes.
- **pages/** : Composants de pages, chaque dossier représente une vue principale.
- **assets/** : Images, données mockées.
- **environments/** : Configurations d’environnement Angular.

---

## Principes et avantages
- **Séparation des responsabilités** : Composants pour l’affichage, services pour la logique métier.
- **Typage strict** : Interfaces et types pour fiabiliser le code.
- **Réutilisabilité** : Mutualisation des éléments dans `shared/`.
- **Modularité** : Ajout facile de nouvelles fonctionnalités.
- **Préparation à l’API** : Services prêts pour l’intégration d’un back-end.
- **Maintenance facilitée** : Structure claire, évolutive, adaptée à la CI/CD.

---

## Checklist actionnable
- [ ] Créer les dossiers `models`, `services`, `types`, `shared`, `components` dans `src/app/`
- [ ] Ajouter les interfaces métier dans `models/`
- [ ] Implémenter les services de données et d’erreur dans `services/`
- [ ] Définir les types utilitaires dans `types/`
- [ ] Mutualiser les composants/pipes/directives dans `shared/`
- [ ] Extraire les UI spécifiques dans `components/`
- [ ] Vérifier la cohérence des pages dans `pages/`
- [ ] Documenter et maintenir la structure dans `ARCHITECTURE.md`

---

## Notes
- Cette architecture est évolutive : adaptez-la selon les besoins du projet.
- Pour les anti-patterns et problèmes identifiés, voir `notes-architecture.md`.
- Pour les guides et ressources, voir `guide-utilisation.md` et `ressources.md`.


