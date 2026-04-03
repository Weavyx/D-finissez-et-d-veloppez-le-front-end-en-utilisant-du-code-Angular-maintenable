import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { Country } from '../models/country.model';

@Injectable({ providedIn: 'root' })
export class OlympicDataService {
  private olympicUrl = './assets/mock/olympic.json';

  private countriesCache: Country[] | null = null;
  private countriesRequest$: Observable<Country[]> | null = null;

  getOlympicCountries(): Observable<Country[]> {
    const http = inject(HttpClient);
    if (this.countriesCache) {
      return new Observable<Country[]>(observer => {
        observer.next(this.countriesCache!);
        observer.complete();
      });
    }
    if (this.countriesRequest$) {
      return this.countriesRequest$;
    }
    this.countriesRequest$ = http.get<Country[]>(this.olympicUrl).pipe(
      tap(countries => this.countriesCache = countries),
      catchError(this.handleError),
      finalize(() => this.countriesRequest$ = null)
    );
    return this.countriesRequest$;
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
