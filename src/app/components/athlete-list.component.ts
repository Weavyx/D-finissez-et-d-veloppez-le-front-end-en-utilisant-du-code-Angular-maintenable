import { Component, Input } from '@angular/core';
import { Athlete } from '../models/athlete.model';

@Component({
  selector: 'app-athlete-list',
  template: '<div>Liste des athlètes (à implémenter)</div>',
  standalone: true
})
export class AthleteListComponent {
  @Input() athletes: Athlete[] = [];
}
