import { Component, Input } from '@angular/core';
import { Country } from '../models/country.model.js';

@Component({
  selector: 'app-country-summary',
  template:
    '@if (country) { {{country.country}} ({{country.participations.length}} participations) }',
  standalone: true,
})
export class CountrySummaryComponent {
  @Input() country!: Country;
}
