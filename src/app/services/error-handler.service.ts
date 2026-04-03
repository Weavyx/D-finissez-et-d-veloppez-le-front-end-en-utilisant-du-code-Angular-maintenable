import { Injectable, ErrorHandler, inject } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  private logger = inject(LoggerService);

  handleError(error: Error | string): void {
    this.logger.log('Erreur interceptée: ' + (error instanceof Error ? error.message : error));
    // Affichage console pour le dev
    console.error('Erreur interceptée:', error);
    // TODO: Affichage UI global si besoin (ex: via un service de notification)
  }
}
