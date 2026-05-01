import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { Country } from '../models/country.model';
import {catchError, tap} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class OlympicDataService {
  private olympicUrl = './assets/mock/olympic.json';

  private countriesSubject = new BehaviorSubject<Country[] | null>(null);
  private loaded = false;

  private http: HttpClient = inject(HttpClient);

  /** Observable pour les composants */
  get countries$(): Observable<Country[] | null> {
    return this.countriesSubject.asObservable();
  }


  /** Chargement unique des données olympiques, à appeler depuis AppComponent */
  loadOlympicCountries(): Observable<Country[] | null> {
    if (this.loaded) {
      return this.countriesSubject.asObservable();
    }
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((countries) => {
        this.countriesSubject.next(countries);
        this.loaded = true;
      }),
      catchError(() => {
        this.countriesSubject.next(null);
        return of(null);
      })
    );
  }

}
