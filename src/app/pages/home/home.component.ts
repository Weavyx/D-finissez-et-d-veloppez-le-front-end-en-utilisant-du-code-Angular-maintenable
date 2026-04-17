import {
  Component,
  ChangeDetectionStrategy,
  inject,
  AfterViewInit,
  AfterViewChecked,
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
import { TotalJOsPipe } from '../../shared/total-jos.pipe';
import { Subscription } from 'rxjs';
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
    TotalJOsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  public pieChart!: Chart<'pie', number[], string>;
  @ViewChild('dashboardPieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);
  public error$;
  public loading$;
  public countries$;
  titlePage = 'Medals per Country';
  private countriesSub?: Subscription;
  private latestCountries: Country[] = [];
  private chartBuilt = false;

  constructor() {
    this.error$ = this.errorHandlerService.error$;
    this.loading$ = this.olympicService.loading$;
    this.countries$ = this.olympicService.countries$;
  }

  ngAfterViewInit() {
    // Subscribe and store latest countries data
    this.countriesSub = this.countries$.subscribe((countries) => {
      this.latestCountries = countries || [];
      this.chartBuilt = false; // allow rebuild if data changes
    });
  }

  ngAfterViewChecked() {
    if (
      this.pieChartRef &&
      this.latestCountries &&
      this.latestCountries.length > 0 &&
      !this.chartBuilt
    ) {
      const countryNames = this.latestCountries.map((c) => c.country);
      const sumOfAllMedalsYears = this.latestCountries.map((c) =>
        c.participations.reduce((acc: number, p: { medalsCount: number }) => acc + p.medalsCount, 0)
      );
      this.buildPieChart(countryNames, sumOfAllMedalsYears);
      this.chartBuilt = true;
    }
  }

  ngOnDestroy() {
    this.countriesSub?.unsubscribe();
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
