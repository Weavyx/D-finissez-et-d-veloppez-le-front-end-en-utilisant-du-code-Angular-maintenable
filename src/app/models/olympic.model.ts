import { Country } from './country.model.js';

/**
 * Structure globale des données olympiques.
 */
export interface Olympic {
  /** Liste des pays participants */
  countries: Country[];
}
