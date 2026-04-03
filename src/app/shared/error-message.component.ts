import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template:
    '<div class="error" aria-live="assertive" role="alert">{{message}}</div>',
  styleUrls: ['./error-message.component.scss'],
  standalone: true,
})
export class ErrorMessageComponent {
  @Input() message = 'Une erreur est survenue.';
}
