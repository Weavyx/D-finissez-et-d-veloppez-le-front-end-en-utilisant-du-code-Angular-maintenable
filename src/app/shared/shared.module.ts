/**
 * SharedModule
 *
 * Module destiné à regrouper les composants, pipes et directives réutilisables dans l'application.
 * À importer dans tous les modules nécessitant des éléments partagés.
 *
 * @remarks
 * Ce module favorise la réutilisabilité et la cohérence du code Angular.
 *
 * @example
 * import { SharedModule } from './shared/shared.module';
 *
 * @see https://angular.io/guide/styleguide#sharedmodule
 */
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [], // Ajouter ici les composants, pipes, directives réutilisables
  imports: [],
  exports: []
})
/**
 * Classe du module Shared.
 */
export class SharedModule {}



