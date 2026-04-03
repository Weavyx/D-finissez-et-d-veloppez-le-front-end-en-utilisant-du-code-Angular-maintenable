import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorMessageComponent } from './shared/error-message.component';
import { LoadingIndicatorComponent } from './shared/loading-indicator.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, ErrorMessageComponent, LoadingIndicatorComponent],
})
export class AppComponent {}
