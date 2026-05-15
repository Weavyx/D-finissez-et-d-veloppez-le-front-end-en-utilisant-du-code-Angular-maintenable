import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string): void {
    if (isDevMode()) {
      console.log(message);
    }
  }
}
