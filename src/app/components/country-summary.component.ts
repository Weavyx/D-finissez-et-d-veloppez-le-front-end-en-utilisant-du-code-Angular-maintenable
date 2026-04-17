import { Component, Input } from '@angular/core';
import { Country } from '../models/country.model.js';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-country-summary',
  templateUrl: './country-summary.component.html',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class CountrySummaryComponent {
  @Input() country!: Country | null;
}
