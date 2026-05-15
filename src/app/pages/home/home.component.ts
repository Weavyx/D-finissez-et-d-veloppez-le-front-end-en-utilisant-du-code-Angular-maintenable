import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  ViewChild,
  ElementRef,
  computed,
  afterNextRender,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Country } from '../../models/country.model';
import { TotalJOsPipe } from '../../shared/total-jos.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TotalJOsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('dashboardPieChart', { static: true }) pieChartRef!: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);

  public countries = toSignal(this.olympicService.countries$, { requireSync: true });
  public titlePage = 'Medals per Country';
  public numberOfCountries = computed(() => this.countries()?.length ?? 0);
  private pieChart?: Chart<'pie', number[], string>;

  constructor() {
    this.destroyRef.onDestroy(() => this.pieChart?.destroy());

    afterNextRender(() => {
      this.olympicService.countries$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(countries => {
          if (countries && countries.length > 0) {
            this.buildPieChart(countries);
          }
        });
    });
  }

  public onChartClick(event: MouseEvent): void {
    if (!this.pieChart) return;
    const points = this.pieChart.getElementsAtEventForMode(event, 'point', { intersect: true }, true);
    if (points.length) {
      const countryName = this.pieChart.data.labels?.[points[0].index] ?? '';
      this.router.navigate(['country', countryName]).catch(err => {
        this.errorHandlerService.handleError(err);
      });
    }
  }

  private buildPieChart(countries: Country[]) {
    this.pieChart?.destroy();
    const labels = countries.map(c => c.country);
    const data = countries.map(c => c.participations.reduce((acc, p) => acc + p.medalsCount, 0));
    this.pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Medals',
          data,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
