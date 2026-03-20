/**
 * Représente une participation d'un pays aux Jeux Olympiques.
 */
export interface Participation {
  /** Identifiant unique de la participation */
  id: number;
  /** Année des Jeux Olympiques */
  year: number;
  /** Ville hôte des Jeux Olympiques */
  city: string;
  /** Nombre de médailles remportées */
  medalsCount: number;
  /** Nombre d'athlètes participants */
  athleteCount: number;
}

