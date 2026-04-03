import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string): void {
    // TODO: Implémenter la journalisation
    console.log('[LOG]', message);
  }
}

