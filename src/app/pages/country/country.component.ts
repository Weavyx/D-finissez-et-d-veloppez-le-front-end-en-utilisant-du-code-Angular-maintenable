import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { Country } from '../../models/country.model';
import { Participation } from '../../models/participation.model';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ErrorMessageComponent } from '../../shared/error-message.component';
import { LoadingIndicatorComponent } from '../../shared/loading-indicator.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ErrorMessageComponent,
    LoadingIndicatorComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicDataService) as OlympicDataService;
  private errorHandlerService = inject(ErrorHandlerService);
  public lineChart!: Chart<'line', string[], number>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error = '';
  public loading = true;
  private chartData: { years: number[]; medals: string[] } | null = null;

  ngOnInit() {
    this.olympicService.loadOlympicCountries();
    this.olympicService.loading$?.subscribe((loading: boolean | null) => {
      this.loading = !!loading;
    });
    this.errorHandlerService.error$.subscribe((err: string) => {
      this.error = err || '';
    });
    this.olympicService.error$?.subscribe((err: string | null) => {
      if (err) {
        this.errorHandlerService.handleError(err);
      }
    });
    const countryName: string | null = this.route.snapshot.paramMap.get('countryName');
    this.olympicService.countries$?.subscribe((data: Country[] | null) => {
      if (Array.isArray(data) && data.length > 0) {
        const selectedCountry = data.find((i: Country) => i.country === countryName);
        if (selectedCountry) {
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry.participations;
          this.totalEntries = participations.length;
          const years = participations.map((i: Participation) => i.year);
          const medals = participations.map((i: Participation) => i.medalsCount.toString());
          this.totalMedals = medals.reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
          const nbAthletes = participations.map((i: Participation) => i.athleteCount.toString());
          this.totalAthletes = nbAthletes.reduce((accumulator: number, item: string) => accumulator + parseInt(item), 0);
          this.chartData = { years, medals };
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.chartData) {
      this.buildChart(this.chartData.years, this.chartData.medals);
    }
  }

  buildChart(years: number[], medals: string[]) {
    this.lineChart = new Chart('countryChart', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'medals',
            data: medals,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
