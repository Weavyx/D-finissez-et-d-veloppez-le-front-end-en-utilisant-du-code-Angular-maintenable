import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { Country } from '../../models/country.model';
import { Participation } from '../../models/participation.model';

import { OlympicDataService } from '../../services/olympic-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries = 0;
  public totalJOs = 0;
  public error!:string
  titlePage = "Medals per Country";

  private http = inject(HttpClient);
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);

  ngOnInit() {
    this.olympicService.getOlympicCountries().subscribe(
      (data: Country[]) => {
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: Country) => i.participations.map((f: Participation) => f.year)).flat())).length;
          const countries: string[] = data.map((i: Country) => i.country);
          this.totalCountries = countries.length;
          const medals = data.map((i: Country) => i.participations.map((i: Participation) => i.medalsCount));
          const sumOfAllMedalsYears = medals.map((i: number[]) => i.reduce((acc: number, val: number) => acc + val, 0));
          this.buildPieChart(countries, sumOfAllMedalsYears);
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message;
      }
    );
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.pieChart = pieChart;
  }
}
