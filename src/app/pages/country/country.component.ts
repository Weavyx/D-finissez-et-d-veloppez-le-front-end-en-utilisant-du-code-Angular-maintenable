import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import { Country } from '../../models/country.model';
import { Participation } from '../../models/participation.model';
import { CommonModule } from '@angular/common';
import { OlympicDataService } from '../../services/olympic-data.service';
import { ErrorMessageComponent } from '../../shared/error-message.component';
import { LoadingIndicatorComponent } from '../../shared/loading-indicator.component';

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
export class CountryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicDataService);
  public lineChart!: Chart<'line', string[], number>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;
  public loading = true;

  ngOnInit() {
    this.loading = true;
    let countryName: string | null = null;
    this.route.paramMap.subscribe(
      (param: ParamMap) => (countryName = param.get('countryName')),
    );
    this.olympicService.getOlympicCountries().subscribe({
      next: (data: Country[]) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find(
            (i: Country) => i.country === countryName,
          );
          if (selectedCountry) {
            this.titlePage = selectedCountry.country;
            const participations = selectedCountry.participations;
            this.totalEntries = participations.length;
            const years = participations.map((i: Participation) => i.year);
            const medals = participations.map((i: Participation) =>
              i.medalsCount.toString(),
            );
            this.totalMedals = medals.reduce(
              (accumulator: number, item: string) =>
                accumulator + parseInt(item),
              0,
            );
            const nbAthletes = participations.map((i: Participation) =>
              i.athleteCount.toString(),
            );
            this.totalAthletes = nbAthletes.reduce(
              (accumulator: number, item: string) =>
                accumulator + parseInt(item),
              0,
            );
            this.buildChart(years, medals);
          }
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.message;
        this.loading = false;
      },
    });
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
