import { Country } from './country.model';

/**
 * Structure globale des données olympiques.
 */
export interface Olympic {
  /** Liste des pays participants */
  countries: Country[];
}
