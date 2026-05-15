import { Component, OnInit, inject } from '@angular/core';
import { take } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { OlympicDataService } from './services/olympic-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private olympicService = inject(OlympicDataService);

  ngOnInit() {
    this.olympicService.loadOlympicCountries().pipe(take(1)).subscribe();
  }
}
