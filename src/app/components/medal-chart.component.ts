import { Component, Input } from '@angular/core';

// À adapter selon la structure réelle des données du graphique
export interface MedalChartData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  standalone: true,
})
export class MedalChartComponent {
  @Input() data!: MedalChartData | null;
}
