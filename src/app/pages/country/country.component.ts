import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Country } from '../../models/country.model';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);

  public countries$ = this.olympicService.countries$;

  public countryName: string | null = this.route.snapshot.paramMap.get('countryName');

  @ViewChild('countryChart') countryChartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'line', number[], string> | null = null;
  private chartSub?: Subscription;

  // Méthodes utilitaires pour le template
  getCountry(data: Country[] | null): Country | undefined {
    return data?.find((i: Country) => i.country === this.countryName);
  }
  getTotalEntries(country: Country | undefined): number {
    return country?.participations.length ?? 0;
  }
  getTotalMedals(country: Country | undefined): number {
    return country?.participations.reduce((acc, p) => acc + p.medalsCount, 0) ?? 0;
  }
  getTotalAthletes(country: Country | undefined): number {
    return country?.participations.reduce((acc, p) => acc + p.athleteCount, 0) ?? 0;
  }

  ngAfterViewInit() {
    this.chartSub = this.countries$
      .pipe(filter((countries) => !!countries && !!this.countryChartRef))
      .subscribe((countries) => {
        const country = this.getCountry(countries);
        if (country && this.countryChartRef) {
          const labels = country.participations.map(p => p.year.toString());
          const data = country.participations.map(p => p.medalsCount);
          this.buildLineChart(labels, data);
        }
      });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.chartSub) {
      this.chartSub.unsubscribe();
    }
  }

  private buildLineChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    if (!this.countryChartRef?.nativeElement || !labels.length || !data.length) {
      return;
    }
    try {
      this.chart = new Chart(this.countryChartRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Medals per year',
              data,
              borderColor: '#0b868f',
              backgroundColor: 'rgba(11,134,143,0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 2.5,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { title: { display: true, text: 'Year' } },
            y: { title: { display: true, text: 'Medals' }, beginAtZero: true },
          },
        },
      });
    } catch (e) {
      console.error('[buildLineChart] Erreur lors de la création du chart', e);
    }
  }
}
