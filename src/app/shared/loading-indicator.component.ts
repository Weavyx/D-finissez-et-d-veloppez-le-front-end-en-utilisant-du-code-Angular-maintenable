import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  template: '<div class="loading" aria-live="polite" role="status">Chargement...</div>',
  styleUrls: ['./loading-indicator.component.scss'],
  standalone: true
})
export class LoadingIndicatorComponent {}

