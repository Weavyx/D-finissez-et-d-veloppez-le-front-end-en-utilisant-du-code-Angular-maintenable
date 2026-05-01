import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  Injector,
  inject,
  ViewChild,
  ElementRef,
  computed,
  afterNextRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { toSignal, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Country } from '../../models/country.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('dashboardPieChart', { static: true }) pieChartRef!: ElementRef<HTMLCanvasElement>;
  private router = inject(Router);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  public countries = toSignal(this.olympicService.countries$, { requireSync: true });
  public titlePage = 'Medals per Country';
  public numberOfCountries = computed(() => this.countries()?.length ?? 0);
  public numberOfJOs = computed(() => this.countries()?.reduce((acc, c) => acc + c.participations.length, 0) ?? 0);
  private pieChart?: Chart<'pie', number[], string>;

  constructor() {
    this.destroyRef.onDestroy(() => this.pieChart?.destroy());

    afterNextRender(() => {
      toObservable(this.countries, { injector: this.injector })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(countries => {
          if (countries && countries.length > 0) {
            this.buildPieChart(countries);
          }
        });
    });
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
        aspectRatio: 2.5,
        onClick: (e) => {
          if (!e.native) return;
          const points = this.pieChart!.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true);
          if (points.length) {
            const countryName = this.pieChart!.data.labels?.[points[0].index] ?? '';
            this.router.navigate(['country', countryName]).catch(err => {
              this.errorHandlerService.handleError(err);
            });
          }
        },
      },
    });
  }
}
