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
│   └── medal-chart.component.ts   # Graphique line chart Chart.js (médailles par année)
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
│   ├── medal.pipe.ts
│   └── total-jos.pipe.ts
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
Appliqué sur tous les composants de page (`HomeComponent`, `CountryComponent`). Avec les signaux, Angular sait exactement quand re-rendre sans inspecter tout l'arbre. Avec les async pipes, chaque émission déclenche `markForCheck()` automatiquement.

### Typage strict
Aucun `any`. Toutes les données sont typées via les interfaces dans `models/`. Les types discriminés (ex. `ChartState`) remplacent les booléens et les valeurs `null` ambiguës dans les composants.

### Gestion des erreurs
`ErrorHandlerService` (implémente `ErrorHandler`) centralise la capture et la diffusion des erreurs via un `BehaviorSubject<string>`. `LoggerService` prend en charge toute journalisation. Aucun `console.log` ou `console.error` dans le code applicatif.

---

## Centralisation de la donnée olympique

`OlympicDataService` expose un `BehaviorSubject<Country[] | null>` initialisé à `null`. Le chargement HTTP est déclenché **une seule fois** depuis `AppComponent.ngOnInit` via `loadOlympicCountries().pipe(take(1)).subscribe()`. Un flag `loaded` empêche tout rechargement accidentel.

```typescript
// OlympicDataService
private countriesSubject = new BehaviorSubject<Country[] | null>(null);

get countries$(): Observable<Country[] | null> {
  return this.countriesSubject.asObservable();
}

loadOlympicCountries(): Observable<Country[] | null> {
  if (this.loaded) return this.countriesSubject.asObservable();
  return this.http.get<Country[]>(this.olympicUrl).pipe(
    tap((countries) => {
      this.countriesSubject.next(countries);
      this.loaded = true;
    }),
    catchError(() => { this.countriesSubject.next(null); return of(null); })
  );
}
```

Le service **n'expose pas** d'observables `loading$` ou `error$` : les états de chargement sont gérés localement dans les composants via la valeur `null` du BehaviorSubject (données non encore chargées) et les erreurs via `ErrorHandlerService`.

---

## Patterns de réactivité par composant

### HomeComponent — Angular Signals + `afterNextRender`

`HomeComponent` utilise `toSignal` avec `{ requireSync: true }` pour convertir `countries$` en signal. `requireSync: true` est l'option correcte pour un `BehaviorSubject` : il émet toujours de façon synchrone à la souscription, donc le type du signal est `Country[] | null` (sans `undefined` superflu). Les valeurs dérivées sont exposées via `computed`.

```typescript
public countries = toSignal(this.olympicService.countries$, { requireSync: true });
public numberOfCountries = computed(() => this.countries()?.length ?? 0);
public numberOfJOs = computed(() => this.countries()?.reduce((acc, c) => acc + c.participations.length, 0) ?? 0);
```

Le graphique Chart.js est créé dans `afterNextRender`, qui garantit que le DOM est prêt avant toute manipulation du canvas. À l'intérieur, `countries$` est souscrit directement et nettoyé automatiquement via `takeUntilDestroyed`.

```typescript
constructor() {
  afterNextRender(() => {
    this.olympicService.countries$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(countries => {
        if (countries && countries.length > 0) this.buildPieChart(countries);
      });
  });
}
```

> **Pourquoi pas `effect()` ?** `effect()` réagit aux changements de signaux mais peut s'exécuter avant le premier rendu — le canvas n'est pas encore dans le DOM. `afterNextRender` est l'API dédiée aux interactions DOM post-rendu.

Le clic sur une part du pie chart est géré via `(click)="onChartClick($event)"` dans le template Angular. Cela évite de passer par les callbacks de Chart.js qui s'exécutent hors zone, rendant `NgZone` inutile.

---

### CountryComponent — RxJS + async pipe

`CountryComponent` consomme `countries$` via des observables dérivés affichés dans le template avec `| async`. `country$` est partagé via `shareReplay(1)` pour éviter que chaque `| async` déclenche une exécution indépendante de la pipeline.

```typescript
public country$ = this.olympicService.countries$.pipe(
  filter((countries): countries is Country[] => countries !== null),
  map(countries => countries.find(c => c.country === this.countryName)),
  shareReplay(1)
);

public totalMedals$ = this.country$.pipe(map(country => ...));
public totalAthletes$ = this.country$.pipe(map(country => ...));
```

L'état du graphique est modélisé via un **type discriminé** `ChartState`, dérivé de `countries$` directement (avant le `filter`) pour capturer tous les états y compris le chargement :

```typescript
type ChartState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'empty' }
  | { status: 'ready'; labels: string[]; data: number[] };

public chartState$: Observable<ChartState> = this.olympicService.countries$.pipe(
  map(countries => {
    if (countries === null) return { status: 'loading' };
    const country = countries.find(c => c.country === this.countryName);
    if (!country) return { status: 'not-found' };
    if (country.participations.length === 0) return { status: 'empty' };
    return { status: 'ready', labels: [...], data: [...] };
  }),
  shareReplay(1)
);
```

Le canvas est **toujours dans le DOM** (`@ViewChild` avec `static: true`) et caché via `[hidden]` tant que `chartState.status !== 'ready'`. La création du chart dans `ngAfterViewInit` utilise `cdr.detectChanges()` avant `buildLineChart` pour retirer `[hidden]` de façon synchrone (contrainte OnPush) et garantir que Chart.js dispose des dimensions réelles du canvas.

Les souscriptions sont nettoyées automatiquement via `takeUntilDestroyed(this.destroyRef)` — aucun `ngOnDestroy` ni `Subscription` manuelle.

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
| `toSignal({ requireSync: true })` | Oui (Angular 16+) |
| Signal inputs/outputs | Non — Angular 17.1+ |

---

## Notes

- Pour les anti-patterns identifiés et l'historique des décisions, voir `notes-architecture.md`.
- Pour les nouvelles pratiques Angular appliquées, voir `nouvelles-pratiques-angular.md`.
