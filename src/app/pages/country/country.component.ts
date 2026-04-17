import {
  Component,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Country } from '../../models/country.model';
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
export class CountryComponent {
  private route = inject(ActivatedRoute);
  private olympicService = inject(OlympicDataService);
  private errorHandlerService = inject(ErrorHandlerService);

  public loading$ = this.olympicService.loading$;
  public error$ = this.errorHandlerService.error$;
  public countries$ = this.olympicService.countries$;

  public countryName: string | null = this.route.snapshot.paramMap.get('countryName');

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
}
