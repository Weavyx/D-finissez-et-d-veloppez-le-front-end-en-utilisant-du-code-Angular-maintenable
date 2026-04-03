import { enableProdMode, ErrorHandler } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  Routes,
  withComponentInputBinding,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import { CountryComponent } from './app/pages/country/country.component';
import { NotFoundComponent } from './app/pages/not-found/not-found.component';
import { ErrorHandlerService } from './app/services/error-handler.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'country/:countryName', component: CountryComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    { provide: ErrorHandler, useClass: ErrorHandlerService },
  ],
}).catch((err) => console.error(err));
