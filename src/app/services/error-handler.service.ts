import { Injectable, ErrorHandler, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  private logger = inject(LoggerService);
  private errorSubject = new BehaviorSubject<string>('');
  public error$ = this.errorSubject.asObservable();

  handleError(error: Error | string): void {
    const message = 'Erreur interceptée: ' + (error instanceof Error ? error.message : error);
    this.logger.log(message);
    this.errorSubject.next(message);
    // TODO: Affichage UI global si besoin (ex: via un service de notification)
  }

  clearError() {
    this.errorSubject.next('');
  }
}
