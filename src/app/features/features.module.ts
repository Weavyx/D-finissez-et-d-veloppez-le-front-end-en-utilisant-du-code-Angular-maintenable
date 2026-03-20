import { NgModule } from '@angular/core';
import { HomeComponent } from '../pages/home/home.component';
import { CountryComponent } from '../pages/country/country.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';

@NgModule({
  declarations: [HomeComponent, CountryComponent, NotFoundComponent],
  imports: [],
  exports: [HomeComponent, CountryComponent, NotFoundComponent]
})
export class FeaturesModule {}


