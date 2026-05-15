import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Observable, map, shareReplay, filter} from 'rxjs';
import {OlympicDataService} from '../../services/olympic-data.service';
import {CommonModule} from '@angular/common';
import {MedalChartComponent} from '../../components/medal-chart.component';
import {MedalPipe} from '../../shared/medal.pipe';

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
  imports: [CommonModule, RouterModule, MedalChartComponent, MedalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryComponent {
  private olympicService = inject(OlympicDataService);

  @Input() countryName!: string;

  public country$ = this.olympicService.countries$.pipe(
    filter(countries => countries !== null),
    map(countries => countries!.find(c => c.country === this.countryName)),
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
      if (countries === null) return {status: 'loading'} as ChartState;
      const country = countries.find(c => c.country === this.countryName);
      if (!country) return {status: 'not-found'} as ChartState;
      if (country.participations.length === 0) return {status: 'empty'} as ChartState;
      return {
        status: 'ready',
        labels: country.participations.map(p => p.year.toString()),
        data: country.participations.map(p => p.medalsCount),
      } as ChartState;
    }),
    shareReplay(1)
  );
}
