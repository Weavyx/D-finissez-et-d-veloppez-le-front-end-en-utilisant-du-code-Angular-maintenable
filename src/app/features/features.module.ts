/**
 * FeaturesModule
 *
 * Module regroupant les pages et composants spécifiques à chaque fonctionnalité métier.
 * À importer dans AppModule pour intégrer les pages principales.
 *
 * @remarks
 * Ce module permet d'organiser le code par domaine fonctionnel.
 *
 * @example
 * import { FeaturesModule } from './features/features.module';
 */
import { NgModule } from '@angular/core';
import { HomeComponent } from '../pages/home/home.component';
import { CountryComponent } from '../pages/country/country.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';

@NgModule({
  declarations: [HomeComponent, CountryComponent, NotFoundComponent],
  imports: [],
  exports: [HomeComponent, CountryComponent, NotFoundComponent]
})
/**
 * Classe du module Features.
 */
export class FeaturesModule {}



