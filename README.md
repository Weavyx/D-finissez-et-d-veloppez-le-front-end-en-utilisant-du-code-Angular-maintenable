# OlympicGamesStarter

Ce projet est une application Angular permettant de gérer et visualiser des données liées aux Jeux Olympiques. Il met l'accent sur une architecture front-end maintenable et une documentation claire.

## Installation

Avant de démarrer, installez les dépendances :

```
npm install
```

## Démarrage du serveur de développement

Lancez le serveur avec :

```
ng serve
```

Naviguez sur `http://localhost:4200/` pour accéder à l'application. Les modifications des fichiers sources rechargeront automatiquement l'application.

## Build

Pour générer le build de production :

```
ng build
```

Les fichiers seront placés dans le dossier `dist/`.

## Architecture du projet

L'organisation du code est la suivante :

- `components` : composants réutilisables
- `pages` : composants liés au routage
- `core` : logique métier (services, modèles)
- `documentation` : documents d'architecture et notes techniques

## Pratiques Angular modernes

- **Composants standalone** : Tous les composants, pipes et directives sont standalone, sans modules classiques.
- **Stratégie OnPush** : Tous les composants standalone utilisent ChangeDetectionStrategy.OnPush pour de meilleures performances.
- **Typage strict** : Aucun usage de `any` ou `unknown`, tout est typé via interfaces/types.
- **Gestion centralisée des erreurs** : Un service ErrorHandlerService gère toutes les erreurs globalement et utilise LoggerService pour la journalisation.
- **Logging uniforme** : Tous les logs passent par LoggerService, jamais directement par `console.log`.
- **États UI explicites** : Les états de chargement et d’erreur sont affichés via des composants dédiés (`LoadingIndicatorComponent`, `ErrorMessageComponent`).
- **Accessibilité** : Les composants d’état utilisent les attributs ARIA et role appropriés pour l’accessibilité.
- **Signals** : Utilisés uniquement si pertinent pour la gestion d’état locale réactive (pas pour les flux HTTP).

## Centralisation de la donnée olympique

Le service `OlympicDataService` centralise le chargement des données olympiques via un `BehaviorSubject`. Les composants consomment la donnée de manière réactive, sans risque de requêtes multiples.

**Exemple d'utilisation dans un composant :**

```typescript
@Component({ /* ... */ })
export class HomeComponent implements OnInit {
  public totalCountries = 0;
  public totalJOs = 0;
  public error: string | null = null;
  public loading = true;
  private olympicService = inject(OlympicDataService);

  ngOnInit() {
    this.olympicService.loadOlympicCountries();
    this.olympicService.loading$.subscribe((loading) => this.loading = loading);
    this.olympicService.error$.subscribe((err) => this.error = err);
    this.olympicService.countries$.subscribe((data) => {
      if (data && data.length > 0) {
        this.totalCountries = data.length;
        this.totalJOs = /* ...calcul... */;
      }
    });
  }
}
```

- Le service garantit un seul chargement depuis l'API/mock.
- Tous les composants accèdent à la donnée centralisée, même après le chargement initial.
- Les états de chargement et d'erreur sont exposés pour l'UI.

## Documentation

Le dossier `documentation` contient des informations sur l'architecture, les choix techniques et des notes pour faciliter la compréhension et la maintenance du projet.

## Contribution

Pour contribuer, créez une branche dédiée, effectuez vos modifications, puis ouvrez une Pull Request.

---

Ce README reflète l'état actuel du projet et son organisation. N'hésitez pas à compléter la documentation ou à proposer des améliorations.
