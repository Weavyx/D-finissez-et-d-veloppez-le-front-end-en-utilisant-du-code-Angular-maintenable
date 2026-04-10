import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component.js').then((m) => m.HomeComponent),
  },
  {
    path: 'country/:countryName',
    loadComponent: () =>
      import('./pages/country/country.component.js').then(
        (m) => m.CountryComponent,
      ),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./pages/not-found/not-found.component.js').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
