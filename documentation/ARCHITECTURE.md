# ARCHITECTURE.md

## Objectif

Ce document décrit l'organisation, les choix d'architecture et les patterns techniques du projet Angular 16.2.12 Olympic Games App.

---

## Structure du projet

```
src/app/
├── pages/
│   ├── home/           # Dashboard (pie chart, stats globales)
│   ├── country/        # Détail pays (line chart, stats par pays)
│   └── not-found/      # Page 404
├── components/
│   ├── country-summary.component.ts
│   ├── medal-chart.component.ts
│   └── athlete-list.component.ts
├── services/
│   ├── olympic-data.service.ts    # Chargement et diffusion des données
│   ├── error-handler.service.ts   # Gestion centralisée des erreurs
│   └── logger.service.ts          # Journalisation
├── models/
│   ├── country.model.ts           # Interface Country
│   ├── participation.model.ts     # Interface Participation
│   └── athlete.model.ts           # Interface Athlete
├── shared/
│   ├── error-message.component.ts
│   ├── loading-indicator.component.ts
│   ├── medal.pipe.ts
│   ├── total-jos.pipe.ts
│   └── country-flag.directive.ts
└── types/
    ├── filter.type.ts
    ├── enum.ts
    └── response.type.ts
```

---

## Principes appliqués

### Standalone components
Tous les composants, pipes et directives utilisent `standalone: true`. Aucun `NgModule`. Le routage utilise `loadComponent` pour le lazy loading.

### ChangeDetectionStrategy.OnPush
`CountryComponent` utilise `OnPush`. `HomeComponent` sera migré lors de l'étape 10 du plan de refonte.

### Typage strict
Aucun `any`. Toutes les données sont typées via les interfaces dans `models/`.

### Gestion des erreurs
`ErrorHandlerService` (implémente `ErrorHandler`) centralise la capture et la diffusion des erreurs via un `BehaviorSubject<string>`. `LoggerService` prend en charge toute journalisation. Aucun `console.log` ou `console.error` dans le code applicatif.

---

## Centralisation de la donnée olympique

`OlympicDataService` expose un `BehaviorSubject<Country[] | null>` initialisé à `null`. Le chargement HTTP est déclenché **une seule fois** depuis `AppComponent.ngOnInit` via `loadOlympicCountries().pipe(take(1)).subscribe()`. Un flag `loaded` empêche tout rechargement accidentel.

```typescript
// OlympicDataService — pattern actuel
private countriesSubject = new BehaviorSubject<Country[] | null>(null);

get countries$(): Observable<Country[] | null> {
  return this.countriesSubject.asObservable();
}

loadOlympicCountries(): Observable<Country[] | null> {
  if (this.loaded) return this.countriesSubject.asObservable();
  return this.http.get<Country[]>(this.olympicUrl).pipe(
    tap((countries) => {
      this.countriesSubject.next(countries.map(c => ({ ...c, participations: c.participations.map(p => ({ ...p })) })));
      this.loaded = true;
    }),
    catchError(() => { this.countriesSubject.next(null); return of(null); })
  );
}
```

Le service **n'expose pas** d'observables `loading$` ou `error$` : les états de chargement sont gérés localement dans les composants via la valeur `null` du BehaviorSubject (non chargé) et les erreurs via `ErrorHandlerService`.

---

## Patterns de réactivité par composant

### HomeComponent — Angular Signals
`HomeComponent` utilise `toSignal` pour convertir `countries$` en signal, et `computed` pour les valeurs dérivées. Le graphique Chart.js est créé dans un `effect()` réagissant au signal `countries`.

```typescript
public countries = toSignal(this.olympicService.countries$, { initialValue: [] as Country[] });
public numberOfCountries = computed(() => (this.countries() ?? []).length);
public numberOfJOs = computed(() => (this.countries() ?? []).reduce((acc, c) => acc + c.participations.length, 0));
```

> Note : l'utilisation de `effect()` pour Chart.js sera remplacée par `afterNextRender` (Angular 16.2) lors de l'étape 10 du plan — pattern plus correct pour la manipulation DOM.

### CountryComponent — RxJS + async pipe
`CountryComponent` consomme `countries$` via l'async pipe dans le template et construit le graphique Chart.js dans `ngAfterViewInit` via une souscription manuelle nettoyée dans `ngOnDestroy`.

---

## Routage

```typescript
// app.routes.ts
{ path: '', loadComponent: () => import('./pages/home/home.component.js').then(m => m.HomeComponent) },
{ path: 'country/:countryName', loadComponent: () => import('./pages/country/country.component.js').then(m => m.CountryComponent) },
{ path: 'not-found', loadComponent: () => import('./pages/not-found/not-found.component.js').then(m => m.NotFoundComponent) },
{ path: '**', redirectTo: 'not-found' }
```

Toutes les routes utilisent `loadComponent` (lazy loading). Les URL inconnues et les paramètres de pays invalides redirigent vers `/not-found`.

---

## Contraintes de version à connaître

| Fonctionnalité | Disponible en 16.2.12 |
|---|---|
| `*ngIf` / `*ngFor` | Oui |
| `@if` / `@for` (nouvelle syntaxe) | Non — Angular 17+ uniquement |
| `toSignal`, `computed`, `effect` | Oui (developer preview) |
| `afterNextRender` / `afterRender` | Oui (Angular 16.2+) |
| `takeUntilDestroyed` | Oui (Angular 16+) |
| Signal inputs/outputs | Non — Angular 17.1+ |

---

## Notes

- Pour les anti-patterns identifiés et l'historique des décisions, voir `notes-architecture.md`.
- Pour les nouvelles pratiques Angular appliquées, voir `nouvelles-pratiques-angular.md`.
