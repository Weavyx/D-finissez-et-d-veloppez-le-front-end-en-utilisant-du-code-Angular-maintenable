import { Injectable, ErrorHandler, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  private logger = inject(LoggerService);
  private errorSubject = new BehaviorSubject<string>('');
  public error$ = this.errorSubject.asObservable();

  handleError(error: unknown): void {
    const message = 'Erreur interceptée: ' + (error instanceof Error ? error.message : String(error));
    this.logger.log(message);
    this.errorSubject.next(message);
  }

  clearError() {
    this.errorSubject.next('');
  }
}
