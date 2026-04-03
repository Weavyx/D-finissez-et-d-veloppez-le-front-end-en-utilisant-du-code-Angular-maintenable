import { Component, Input } from '@angular/core';
import { Country } from '../models/country.model';

@Component({
  selector: 'app-country-summary',
  template: '<div>{{country?.country}} ({{country?.participations.length}} participations)</div>',
  standalone: true
})
export class CountrySummaryComponent {
  @Input() country!: Country;
}

