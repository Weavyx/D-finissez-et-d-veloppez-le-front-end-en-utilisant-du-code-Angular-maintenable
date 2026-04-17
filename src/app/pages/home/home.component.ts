import {
  Component,
  ChangeDetectionStrategy,
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
import { ErrorMessageComponent } from '../../shared/error-message.component';
import { LoadingIndicatorComponent } from '../../shared/loading-indicator.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed, effect } from '@angular/core';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ErrorMessageComponent,
    LoadingIndicatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  public pieChart!: Chart<'pie', number[], string>;
  @ViewChild('dashboardPieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);

  // Signals pour la donnée olympique
  public countries = toSignal(this.olympicService.countries$, { initialValue: [] as Country[] });
  public loading = toSignal(this.olympicService.loading$, { initialValue: true });
  public error = toSignal(this.errorHandlerService.error$, { initialValue: null });

  titlePage = 'Medals per Country';

  // Calculs dérivés
  public numberOfCountries = computed(() => (this.countries() ?? []).length);
  public numberOfJOs = computed(() => (this.countries() ?? []).reduce((acc: number, c: Country) => acc + (c.participations?.length ?? 0), 0));

  constructor() {
    effect(() => {
      const countries = this.countries() ?? [];
      if (countries.length > 0 && this.pieChartRef) {
        const countryNames = countries.map((c: Country) => c.country);
        const sumOfAllMedalsYears = countries.map((c: Country) =>
          c.participations.reduce((acc: number, p: { medalsCount: number }) => acc + p.medalsCount, 0)
        );
        this.buildPieChart(countryNames, sumOfAllMedalsYears);
      }
    });
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (!this.pieChartRef?.nativeElement) {
      return;
    }
    const pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: countries,
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
            const points = pieChart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true,
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels
                ? pieChart.data.labels[firstPoint.index]
                : '';
              this.router.navigate(['country', countryName]).catch((err) => {
                this.errorHandlerService.handleError(err);
              });
            }
          }
        },
      },
    });
    this.pieChart = pieChart;
  }
}
