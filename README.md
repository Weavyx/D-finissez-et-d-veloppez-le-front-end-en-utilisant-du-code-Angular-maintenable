# Olympic Games App

Application Angular 16 affichant les statistiques de médailles olympiques par pays, avec graphiques interactifs (Chart.js).

## Prérequis

- Node.js >= 18
- Angular CLI 16 : `npm install -g @angular/cli@16`

## Installation

```bash
npm install
```

## Commandes

```bash
ng serve       # Serveur de développement → http://localhost:4200
ng build       # Build de production (sortie dans dist/)
ng lint        # Analyse ESLint
ng test        # Tests unitaires (Karma + Jasmine)
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — pie chart des médailles par pays, clic sur un pays pour naviguer |
| `/country/:countryName` | Détail d'un pays — statistiques et line chart par année |
| `/not-found` | Page 404, redirigée sur toute route inconnue ou pays absent |

---

## Architecture

```
src/app/
├── pages/          # Composants de routes (Home, Country, NotFound)
├── components/     # Sous-composants réutilisables
├── services/       # OlympicDataService, ErrorHandlerService, LoggerService
├── models/         # Interfaces TypeScript (Country, Participation, Athlete)
├── shared/         # Pipes, directives, composants d'état partagés
└── types/          # Types utilitaires et enums
```

### Flux de données

`AppComponent.ngOnInit` déclenche **un seul** chargement HTTP via `OlympicDataService.loadOlympicCountries()`. Les données sont stockées dans un `BehaviorSubject<Country[] | null>` et exposées via `countries$`. Les composants consomment cette observable sans jamais déclencher de nouveau chargement.

Les données sont mockées dans `src/assets/mock/olympic.json`.

### Réactivité

- `HomeComponent` utilise les **Angular Signals** (`toSignal`, `computed`) et `afterNextRender` pour initialiser le graphique Chart.js une fois le DOM prêt. Le clic sur le pie chart est géré via `(click)` Angular natif.
- `CountryComponent` utilise l'**async pipe** avec des observables dérivés (`map`, `shareReplay`) et un type discriminé `ChartState` pour modéliser les états du graphique.
- Toute souscription manuelle est nettoyée automatiquement via `takeUntilDestroyed`.

### Gestion des erreurs

Les erreurs sont centralisées dans `ErrorHandlerService` (implémente `ErrorHandler`) et journalisées via `LoggerService`. Aucun `console.log` ou `console.error` dans le code applicatif.

---

## Documentation technique

Voir `documentation/ARCHITECTURE.md` pour le détail des choix d'architecture et des patterns utilisés.
