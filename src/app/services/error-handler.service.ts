import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: Error | string): void {
    // TODO: Implémenter la gestion centralisée des erreurs
    console.error('Erreur interceptée:', error);
  }
}
