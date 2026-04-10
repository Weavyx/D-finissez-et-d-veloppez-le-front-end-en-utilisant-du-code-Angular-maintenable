# NOUVELLES PRATIQUES ANGULAR (2026)

Ce document synthétise les nouvelles pratiques recommandées pour le développement Angular moderne, en expliquant pour chaque point : le pourquoi du changement, ce que permet la nouvelle approche, et ses avantages/inconvénients, en s'appuyant sur la documentation officielle.

---

## 1. Standalone Components, Directives et Pipes

**Pourquoi ce changement ?**
Angular a introduit les standalone components pour simplifier la modularité et réduire la complexité liée aux NgModules. Les modules étaient souvent source de confusion et de sur-ingénierie.

**Ce que permet la nouvelle approche :**
- Déclarer un composant, une directive ou un pipe comme "standalone" (`standalone: true`)
- Importer directement ces entités dans d'autres composants ou dans le routage, sans passer par un module
- Réduire le couplage et la taille des bundles

**Avantages :**
- Simplicité d’utilisation et de partage
- Démarrage plus rapide d’un projet
- Meilleure tree-shaking (élimination du code mort)
- Moins de boilerplate

**Limites :**
- Les modules restent utiles pour regrouper des providers ou des configurations globales
- Migration progressive nécessaire sur les gros projets

**Documentation :**
[Angular Standalone Components](https://angular.io/guide/standalone-components)

---

## 2. Signals (Gestion d’état réactive)

**Pourquoi ce changement ?**
RxJS est puissant mais complexe pour la gestion d’état local ou simple. Les signals offrent une alternative plus simple et plus performante pour la réactivité locale.

**Ce que permet la nouvelle approche :**
- Déclarer des signaux réactifs (`signal()`) pour gérer l’état local
- Réagir automatiquement aux changements de valeur dans le template
- Remplacer les usages simples de BehaviorSubject ou Observable

**Avantages :**
- Syntaxe plus simple et plus lisible
- Moins de code boilerplate
- Performances accrues (moins de subscriptions, pas de memory leaks)

**Limites :**
- RxJS reste nécessaire pour les flux complexes, les effets secondaires, ou l’interopérabilité avec des APIs asynchrones
- Les signaux ne remplacent pas NgRx ou d’autres solutions de gestion d’état globale

**Documentation :**
[Angular Signals](https://angular.io/guide/signals)

---

## 3. Change Detection Strategy : OnPush par défaut

**Pourquoi ce changement ?**
La stratégie de détection de changement par défaut (Default) peut entraîner des rendus inutiles et des problèmes de performance. OnPush optimise la détection en ne réévaluant le composant que si ses inputs changent.

**Ce que permet la nouvelle approche :**
- Déclarer `changeDetection: ChangeDetectionStrategy.OnPush` sur tous les composants
- Réduire le nombre de cycles de détection
- Améliorer la performance, surtout sur les gros projets

**Avantages :**
- Meilleure performance
- Moins de bugs liés à la détection de changement
- Encourage l’immuabilité et la gestion d’état claire

**Limites :**
- Nécessite de bien comprendre la propagation des changements
- Peut surprendre lors de la migration de code existant

**Documentation :**
[Angular Change Detection](https://angular.io/guide/change-detection)

---

## 4. Injection de dépendances moderne (`providedIn`)

**Pourquoi ce changement ?**
Déclarer les services dans les modules pouvait entraîner des singletons non désirés ou des problèmes de scope. L’injection moderne via `providedIn` simplifie la gestion du scope des services.

**Ce que permet la nouvelle approche :**
- Déclarer un service avec `providedIn: 'root'` (singleton global) ou `providedIn: 'any'` (nouvelle instance par lazy module)
- Éviter d’avoir à déclarer les services dans les providers des modules

**Avantages :**
- Simplicité, moins de boilerplate
- Contrôle précis du scope des services
- Meilleure testabilité

**Limites :**
- Peut nécessiter une adaptation lors de la migration de services existants

**Documentation :**
[Angular Dependency Injection](https://angular.io/guide/dependency-injection-providers)

---

## 5. Typage strict et interfaces

**Pourquoi ce changement ?**
Le typage faible (`any`) est source de bugs et de maintenance difficile. Angular recommande un typage strict pour fiabiliser le code.

**Ce que permet la nouvelle approche :**
- Définir toutes les entités métier en interfaces/types
- Bénéficier de l’autocomplétion et de la vérification statique

**Avantages :**
- Moins de bugs
- Documentation implicite du code
- Meilleure maintenabilité

**Limites :**
- Nécessite une rigueur accrue lors de l’évolution du modèle de données

**Documentation :**
[TypeScript strict mode](https://www.typescriptlang.org/tsconfig#strict)

---

## 6. Routage basé sur les standalone components

**Pourquoi ce changement ?**
Le routage Angular supporte désormais l’import direct de standalone components, simplifiant la configuration et la modularité.

**Ce que permet la nouvelle approche :**
- Utiliser `loadComponent` dans les routes pour charger dynamiquement un composant standalone
- Réduire la dépendance aux modules de routing

**Avantages :**
- Routage plus simple et plus flexible
- Meilleure séparation des responsabilités

**Limites :**
- Migration progressive nécessaire

**Documentation :**
[Angular Routing with Standalone Components](https://angular.io/guide/standalone-components#routing)

---

## 7. Tests adaptés aux standalone components et aux signals

**Pourquoi ce changement ?**
Les tests classiques Angular supposaient l’existence de modules. Les standalone components et les signals nécessitent des patterns de test adaptés.

**Ce que permet la nouvelle approche :**
- Tester un composant sans module
- Utiliser des helpers pour tester les signaux

**Avantages :**
- Tests plus ciblés, plus rapides
- Moins de configuration

**Limites :**
- Nécessite d’adapter les anciens tests

**Documentation :**
[Testing Standalone Components](https://angular.io/guide/standalone-components#testing)

---

## 8. Observabilité et gestion d’erreur centralisée

**Pourquoi ce changement ?**
La gestion d’erreur dispersée et les logs non centralisés compliquent le diagnostic. Angular recommande d’utiliser un ErrorHandler et des services de logging dédiés.

**Ce que permet la nouvelle approche :**
- Centraliser la gestion d’erreur
- Uniformiser la journalisation

**Avantages :**
- Diagnostic plus rapide
- Meilleure traçabilité

**Limites :**
- Nécessite une implémentation initiale

**Documentation :**
[Angular Error Handling](https://angular.io/guide/errors)

---

## 9. Accessibilité et UI explicite

**Pourquoi ce changement ?**
L’accessibilité est une exigence croissante. Angular encourage la création d’états UI explicites et l’accessibilité native.

**Ce que permet la nouvelle approche :**
- Déclarer explicitement les états UI dans les templates
- Utiliser les attributs ARIA et les bonnes pratiques d’accessibilité

**Avantages :**
- Meilleure expérience utilisateur
- Conformité aux standards

**Limites :**
- Demande une attention continue lors du développement

**Documentation :**
[Angular Accessibility](https://angular.io/guide/accessibility)

---

## 10. Style guide et conventions

**Pourquoi ce changement ?**
Un style de code homogène facilite la maintenance et la collaboration. Angular fournit un style guide officiel.

**Ce que permet la nouvelle approche :**
- Uniformiser le nommage, la structure des fichiers, les conventions de code

**Avantages :**
- Code plus lisible, plus facile à maintenir

**Limites :**
- Nécessite une adoption collective

**Documentation :**
[Angular Style Guide](https://angular.io/guide/styleguide)

---

### BehaviorSubject vs Signal pour la centralisation de la donnée

**BehaviorSubject (RxJS)**

- **Avantages :**
  - Compatible avec tout l'écosystème RxJS et Angular (services, guards, effets, etc.).
  - Permet de gérer des flux asynchrones complexes, des transformations, des combinaisons de streams.
  - Les nouveaux abonnés reçoivent toujours la dernière valeur (replay).
  - Peut être utilisé dans des contextes non Angular (Node.js, tests, etc.).
- **Inconvénients :**
  - Syntaxe plus verbeuse, nécessite la gestion des subscriptions (unsubscribe).
  - Risque de memory leaks si les subscriptions ne sont pas nettoyées.
  - Moins intuitif pour la gestion d'état local simple.
  - Nécessite RxJS, donc une dépendance supplémentaire.

**Signal (Angular 16+)**

- **Avantages :**
  - Syntaxe très simple et intégration native avec Angular (template, composants, DI).
  - Pas besoin de gérer les subscriptions manuellement (pas de memory leaks).
  - Idéal pour la gestion d'état local ou partagé simple.
  - Performances accrues grâce à la réactivité fine-grainée.
  - Moins de boilerplate, plus lisible.
- **Inconvénients :**
  - Moins adapté aux flux asynchrones complexes ou à la composition de streams (préférer RxJS dans ces cas).
  - Moins d'outils de transformation/composition que RxJS.
  - Nécessite Angular 16+.

**Résumé :**
- Utiliser **BehaviorSubject** pour la centralisation de données asynchrones complexes ou si l'écosystème RxJS est déjà utilisé.
- Privilégier **Signal** pour la gestion d'état local ou partagé simple, surtout dans les nouveaux projets Angular 16+.

> Ce document doit être mis à jour à chaque évolution majeure d’Angular ou de ses recommandations officielles.
