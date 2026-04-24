import {
  Component,
  inject,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed, effect } from '@angular/core';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnDestroy {
  @ViewChild('dashboardPieChart', { static: true }) pieChartRef!: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);

  public countries = toSignal(this.olympicService.countries$, { initialValue: [] as Country[] });
  titlePage = 'Medals per Country';
  public numberOfCountries = computed(() => (this.countries() ?? []).length);
  public numberOfJOs = computed(() => (this.countries() ?? []).reduce((acc: number, c: Country) => acc + (c.participations?.length ?? 0), 0));
  private pieChart?: Chart<'pie', number[], string>;

  constructor() {
    effect(() => {
      const countries = this.countries() ?? [];
      const canvas = this.pieChartRef?.nativeElement;
      if (countries.length > 0 && canvas) {
        const countryNames = countries.map((c: Country) => c.country);
        const sumOfAllMedalsYears = countries.map((c: Country) =>
          c.participations.reduce((acc: number, p: { medalsCount: number }) => acc + p.medalsCount, 0)
        );
        if (this.pieChart) {
          this.pieChart.destroy();
        }
        this.pieChart = new Chart(canvas, {
          type: 'pie',
          data: {
            labels: countryNames,
            datasets: [
              {
                label: 'Medals',
                data: sumOfAllMedalsYears,
                backgroundColor: [
                  '#0b868f',
                  '#adc3de',
                  '#7a3c53',
                  '#8f6263',
                  'orange',
                  '#94819d',
                ],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            aspectRatio: 2.5,
            onClick: (e) => {
              if (e.native) {
                const points = this.pieChart!.getElementsAtEventForMode(
                  e.native,
                  'point',
                  { intersect: true },
                  true,
                );
                if (points.length) {
                  const firstPoint = points[0];
                  const countryName = this.pieChart!.data.labels
                    ? this.pieChart!.data.labels[firstPoint.index]
                    : '';
                  this.router.navigate(['country', countryName]).catch((err) => {
                    this.errorHandlerService.handleError(err);
                  });
                }
              }
            },
          },
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }
}
