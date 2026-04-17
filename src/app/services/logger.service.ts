import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string): void {
    // Journalisation améliorée (future extension : envoi serveur, stockage, etc.)
    // Suppression du console.log pour production
    // Exemple : envoyer à un serveur ou stocker localement
  }
}
