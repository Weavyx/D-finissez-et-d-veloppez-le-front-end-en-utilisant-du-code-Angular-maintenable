import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  providers: [], // Ajouter ici les services, guards, interceptors
  imports: [],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}


