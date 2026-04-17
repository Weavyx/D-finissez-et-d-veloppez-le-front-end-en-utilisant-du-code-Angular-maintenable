import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../models/country.model';

@Pipe({
  name: 'totalJOs',
  standalone: true,
})
export class TotalJOsPipe implements PipeTransform {
  transform(countries: Country[]): number {
    if (!countries || countries.length === 0) return 0;
    // Compte le nombre total de participations (JOs) pour tous les pays
    return countries.reduce((acc, country) => acc + (country.participations?.length || 0), 0);
  }
}

