import { Component, Input } from '@angular/core';
import { Athlete } from '../models/athlete.model.js';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-athlete-list',
  templateUrl: './athlete-list.component.html',
  standalone: true,
  imports: [
    NgIf
  ]
})
export class AthleteListComponent {
  @Input() athletes: Athlete[] | null = null;

  trackByName(index: number, athlete: Athlete) {
    return athlete?.name;
  }
}
