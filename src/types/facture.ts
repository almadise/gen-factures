export interface LigneFacture {
  designation: string;
  quantite: number;
  prixUnitaire: number;
  tauxTva: number; // ex. 20 pour 20%
}

export interface Emetteur {
  nom: string;
  siret?: string;
  tva?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  email?: string;
}

export interface Client {
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

/** Position du logo dans l'en-tête de la facture */
export type LogoPosition = "left" | "center";

export interface DonneesFacture {
  numero: string;
  date: string; // YYYY-MM-DD
  dateEcheance?: string;
  emetteur: Emetteur;
  client: Client;
  lignes: LigneFacture[];
  devise: string;
  mentionsLegales?: string;
  conditionsPaiement?: string;
  /** Logo en base64 (PNG/JPEG pour le PDF ; SVG converti en PNG côté client) */
  logoBase64?: string;
  /** Dimensions naturelles du logo (pour redimensionnement max 80px hauteur) */
  logoNaturalWidth?: number;
  logoNaturalHeight?: number;
  logoPosition?: LogoPosition;
  showLogo?: boolean;
  /** Pied de page personnalisé (max 500 caractères) */
  footer?: string;
  showFooter?: boolean;
  /** Micro-entrepreneur en franchise de TVA : pas de colonne TVA, mention art. 293 B, Total Net à payer */
  isAutoEntrepreneur?: boolean;
}
