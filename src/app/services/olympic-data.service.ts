import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Country } from '../models/country.model';

@Injectable({ providedIn: 'root' })
export class OlympicDataService {
  private olympicUrl = './assets/mock/olympic.json';

  private countriesSubject = new BehaviorSubject<Country[] | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private loaded = false;

  private http: HttpClient = inject(HttpClient);

  /** Observable pour les composants */
  get countries$(): Observable<Country[] | null> {
    return this.countriesSubject.asObservable();
  }
  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
  get error$(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  /** Chargement unique des données olympiques */
  loadOlympicCountries(): void {
    if (this.loaded || this.loadingSubject.value) return;
    this.loadingSubject.next(true);
    this.http.get<Country[]>(this.olympicUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorSubject.next(error.message);
        this.countriesSubject.next(null);
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: (countries: Country[]) => {
        this.countriesSubject.next(countries);
        this.errorSubject.next(null);
        this.loaded = true;
      },
      error: () => {
        this.countriesSubject.next(null);
      }
    });
  }

  /** Pour forcer un rafraîchissement
  refreshOlympicCountries(): void {
    this.loaded = false;
   this.loadOlympicCountries();
  }*/
}
