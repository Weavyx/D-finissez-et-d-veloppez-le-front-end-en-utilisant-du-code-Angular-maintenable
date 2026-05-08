import {
  Component,
  Input,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import Chart from 'chart.js/auto';
import {ErrorHandlerService} from '../services/error-handler.service';

@Component({
  selector: 'app-medal-chart',
  templateUrl: './medal-chart.component.html',
  styleUrls: ['./medal-chart.component.scss'],
  standalone: true,
})
export class MedalChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];

  @ViewChild('chartCanvas', {static: true}) private canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart<'line', number[], string> | null = null;
  private errorHandlerService = inject(ErrorHandlerService);

  // ngOnChanges runs before the view is initialized — skip until canvasRef is ready
  ngOnChanges(): void {
    if (this.canvasRef) {
      this.buildChart();
    }
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChart(): void {
    this.chart?.destroy();

    try {
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Medals per year',
            data: this.data,
            borderColor: '#0b868f',
            backgroundColor: 'rgba(11,134,143,0.2)',
            fill: true,
            tension: 0.3,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {legend: {display: false}},
          scales: {
            x: {title: {display: true, text: 'Year'}},
            y: {title: {display: true, text: 'Medals'}, beginAtZero: true},
          },
        },
      });
    } catch (e) {
      this.errorHandlerService.handleError(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
