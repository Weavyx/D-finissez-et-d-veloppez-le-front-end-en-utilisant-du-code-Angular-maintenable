import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../models/country.model';

@Pipe({
  name: 'totalJOs',
  standalone: true,
})
export class TotalJOsPipe implements PipeTransform {
  transform(countries: Country[]): number {
    if (!countries || countries.length === 0) return 0;
    const years = countries.flatMap(c => c.participations.map(p => p.year));
    return new Set(years).size;
  }
}

