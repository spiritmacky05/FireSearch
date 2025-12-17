export enum EstablishmentType {
  Residential = 'Residential',
  Business = 'Business',
  Mercantile = 'Mercantile',
  Educational = 'Educational',
  Assembly = 'Assembly',
  Industrial = 'Industrial',
  Storage = 'Storage',
  HealthCare = 'Health Care',
  SpecialOccupancy = 'Special Occupancy',
  Others = 'Others'
}

export enum OccupancyType {
  FSIC_Occupancy = 'FSIC For Occupancy',
  New_Business = 'New Business (Occupancy)',
  Renewal = 'Renewal of Business Permit'
}

export interface SearchParams {
  establishmentType: EstablishmentType | '';
  area: string;
  occupancyType: OccupancyType | '';
}

export interface AiResponse {
  markdown: string;
}

export interface User {
  email: string;
  name: string;
  password?: string; // Only for local storage logic, normally hashed
}

export interface SavedReport {
  id: string;
  timestamp: number;
  params: SearchParams;
  result: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
