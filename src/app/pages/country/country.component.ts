import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  public countries$ = this.olympicService.countries$;
  public countryName: string | null = this.route.snapshot.paramMap.get('countryName');
  public chartVisible = false;
  public chartNoData = false;

  @ViewChild('countryChart', { static: true }) countryChartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'line', number[], string> | null = null;
  private chartSub?: Subscription;

  getCountry(data: Country[] | null): Country | undefined {
    return data?.find((c: Country) => c.country === this.countryName);
  }
  getTotalEntries(country: Country): number {
    return country.participations.length;
  }
  getTotalMedals(country: Country): number {
    return country.participations.reduce((acc, p) => acc + p.medalsCount, 0);
  }
  getTotalAthletes(country: Country): number {
    return country.participations.reduce((acc, p) => acc + p.athleteCount, 0);
  }

  ngAfterViewInit() {
    this.chartSub = this.countries$
      .pipe(filter((countries): countries is Country[] => countries !== null))
      .subscribe((countries) => {
        const country = this.getCountry(countries);
        if (!country) {
          this.router.navigate(['/not-found']);
          return;
        }
        const labels = country.participations.map(p => p.year.toString());
        const data = country.participations.map(p => p.medalsCount);
        if (labels.length > 0) {
          this.buildLineChart(labels, data);
          this.chartVisible = true;
        } else {
          this.chartNoData = true;
        }
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.chart?.destroy();
    this.chartSub?.unsubscribe();
  }

  private buildLineChart(labels: string[], data: number[]) {
    this.chart?.destroy();
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
