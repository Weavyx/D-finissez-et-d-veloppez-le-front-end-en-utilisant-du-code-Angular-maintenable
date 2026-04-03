import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string): void {
    // Journalisation améliorée (future extension: envoi serveur, stockage, etc.)
    console.log('[LOG]', message);
  }
}
