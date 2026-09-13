export type UnitType = 'HABITACION' | 'CABANA';

/** Debe coincidir exactamente con el enum Amenity del backend (catalog). */
export type Amenity =
  | 'WIFI'
  | 'DESAYUNO_INCLUIDO'
  | 'ESTACIONAMIENTO'
  | 'VISTA_MONTANA'
  | 'VISTA_LAGO'
  | 'JACUZZI'
  | 'CALEFACCION'
  | 'PET_FRIENDLY'
  | 'COCINA_EQUIPADA'
  | 'CHIMENEA'
  | 'TERRAZA'
  | 'ACCESO_SENDEROS';

export const AMENITY_LABELS: Record<Amenity, string> = {
  WIFI: 'WiFi',
  DESAYUNO_INCLUIDO: 'Desayuno incluido',
  ESTACIONAMIENTO: 'Estacionamiento',
  VISTA_MONTANA: 'Vista a la montaña',
  VISTA_LAGO: 'Vista al lago',
  JACUZZI: 'Jacuzzi',
  CALEFACCION: 'Calefacción',
  PET_FRIENDLY: 'Pet friendly',
  COCINA_EQUIPADA: 'Cocina equipada',
  CHIMENEA: 'Chimenea',
  TERRAZA: 'Terraza',
  ACCESO_SENDEROS: 'Acceso a senderos',
};

export interface CatalogUnit {
  id: number;
  code: string;
  type: UnitType;
  capacity: number;
  nightlyRate: number;
  totalUnits: number;
  availableUnits: number;
  active: boolean;
  amenities: Amenity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCatalogUnitRequest {
  code: string;
  type: UnitType;
  capacity: number;
  nightlyRate: number;
  totalUnits: number;
  amenities: Amenity[];
}

export interface UpdateCatalogUnitRequest {
  nightlyRate: number;
  availableUnits: number;
  active: boolean;
  amenities: Amenity[];
}
