import { Participation } from './participation.model';

/**
 * Représente un pays et ses participations aux Jeux Olympiques.
 */
export interface Country {
  /** Identifiant unique du pays */
  id: number;
  /** Nom du pays */
  country: string;
  /** Liste des participations du pays */
  participations: Participation[];
}
