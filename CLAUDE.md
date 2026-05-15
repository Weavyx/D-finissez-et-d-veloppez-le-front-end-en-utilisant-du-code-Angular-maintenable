# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
ng serve          # Dev server at http://localhost:4200
ng build          # Production build
ng test           # Unit tests (Karma + Jasmine)
ng lint           # ESLint with angular-eslint
ng generate component pages/<name>   # Generate a page component
ng generate component components/<name>  # Generate a sub-component
ng generate service services/<name>  # Generate a service
```

## Architecture

**Angular 16 — all components are standalone, no NgModule.**

### Data flow

`AppComponent.ngOnInit` triggers a single HTTP load via `OlympicDataService.loadOlympicCountries()`. The service stores the result in a `BehaviorSubject<Country[] | null>` and guards against duplicate loads with a `loaded` flag. All components read from `countries$` — they never fetch data themselves.

Mock data lives in `src/assets/mock/olympic.json` and simulates a future REST API. The service layer is the intended swap point when a real backend is added.

### Folder responsibilities

| Folder | Role |
|---|---|
| `pages/` | Route-level components (`HomeComponent`, `CountryComponent`, `NotFoundComponent`) |
| `components/` | Reusable sub-components (`MedalChartComponent`) |
| `services/` | `OlympicDataService` (data), `ErrorHandlerService` (global errors), `LoggerService` (logging) |
| `models/` | TypeScript interfaces — `Country`, `Participation`, `Athlete`, `Olympic` |
| `shared/` | Standalone components (`ErrorMessageComponent`), pipes (`MedalPipe`, `TotalJosPipe`) |
| `types/` | Type aliases (`ApiResponse`, `FilterType`) and enums |

### Routing

Routes in `app.routes.ts` use `loadComponent` for lazy loading. Navigation to a country detail page passes the country name as a route param (`/country/:countryName`). Unknown routes redirect to `/not-found`.

### Reactivity patterns

- `HomeComponent` uses Angular Signals (`toSignal`, `computed`) and `afterNextRender` — Chart.js pie chart is built inside `afterNextRender`, subscribing directly to `countries$` via `takeUntilDestroyed`. Canvas click is handled via Angular's native `(click)` binding, no `NgZone` needed.
- `CountryComponent` uses RxJS (`filter`, `map`, `shareReplay`) with `async` pipe and `ChangeDetectionStrategy.OnPush`. Chart state is modelled as a discriminated union type `ChartState` derived from `countries$`.

### ESLint

`@angular-eslint/template/prefer-control-flow` is disabled for HTML templates (`.eslintrc.json`). Do not enable it — the project intentionally uses `*ngIf`/`*ngFor` syntax.
