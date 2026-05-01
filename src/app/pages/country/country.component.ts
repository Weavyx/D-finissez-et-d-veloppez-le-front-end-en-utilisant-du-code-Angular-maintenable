import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map, filter, shareReplay } from 'rxjs';
import { Country } from '../../models/country.model';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type ChartState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'empty' }
  | { status: 'ready'; labels: string[]; data: number[] };

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);

  private countryName = this.route.snapshot.paramMap.get('countryName');

  public country$ = this.olympicService.countries$.pipe(
    filter((countries): countries is Country[] => countries !== null),
    map(countries => countries.find(c => c.country === this.countryName)),
    shareReplay(1)
  );

  public totalMedals$ = this.country$.pipe(
    map(country => country ? country.participations.reduce((acc, p) => acc + p.medalsCount, 0) : 0)
  );

  public totalAthletes$ = this.country$.pipe(
    map(country => country ? country.participations.reduce((acc, p) => acc + p.athleteCount, 0) : 0)
  );

  public chartState$: Observable<ChartState> = this.olympicService.countries$.pipe(
    map(countries => {
      if (countries === null) return { status: 'loading' } as ChartState;
      const country = countries.find(c => c.country === this.countryName);
      if (!country) return { status: 'not-found' } as ChartState;
      if (country.participations.length === 0) return { status: 'empty' } as ChartState;
      return {
        status: 'ready',
        labels: country.participations.map(p => p.year.toString()),
        data: country.participations.map(p => p.medalsCount),
      } as ChartState;
    }),
    shareReplay(1)
  );

  @ViewChild('countryChart', { static: true }) countryChartRef?: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'line', number[], string> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  ngAfterViewInit(): void {
    this.chartState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        if (state.status === 'ready') {
          this.cdr.detectChanges();
          this.buildLineChart(state.labels, state.data);
        } else {
          this.chart?.destroy();
          this.chart = null;
        }
      });
  }

  private buildLineChart(labels: string[], data: number[]): void {
    this.chart?.destroy();

    if (!this.countryChartRef) {
      return;
    }

    try {
      this.chart = new Chart(this.countryChartRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Medals per year',
            data,
            borderColor: '#0b868f',
            backgroundColor: 'rgba(11,134,143,0.2)',
            fill: true,
            tension: 0.3,
          }],
        },
        options: {
          responsive: true,
          aspectRatio: 2.5,
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: 'Year' } },
            y: { title: { display: true, text: 'Medals' }, beginAtZero: true },
          },
        },
      });
    } catch (e) {
      this.errorHandlerService.handleError(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
