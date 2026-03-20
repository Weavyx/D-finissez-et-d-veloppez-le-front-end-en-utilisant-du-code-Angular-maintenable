import { NgModule, Optional, SkipSelf } from '@angular/core';

/**
 * CoreModule
 *
 * Module central de l'application Angular.
 * Utilisé pour déclarer les services singleton, guards, interceptors et configuration globale.
 * À importer uniquement dans AppModule.
 *
 * @remarks
 * Ce module doit être importé une seule fois pour garantir le singleton des services.
 *
 * @example
 * import { CoreModule } from './core/core.module';
 *
 * @see https://angular.io/guide/styleguide#coremodule
 */
@NgModule({
  providers: [], // Ajouter ici les services, guards, interceptors
  imports: [],
  exports: []
})
/**
 * Classe du module Core.
 * Déclenche une erreur si le module est importé plusieurs fois.
 */
export class CoreModule {
  /**
   * Constructeur du module Core.
   * @param parentModule - Instance parent du module Core (pour vérifier l'import unique)
   * @throws Error si le module est importé plusieurs fois
   */
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}



