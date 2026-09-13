export interface HourlyCount {
  hour: string;
  reservations: number;
}

export interface KpisResponse {
  range: string;
  reservationsPerHour: HourlyCount[];
  avgCycleTimeMinutes: number | null;
  activeOccupancy: number;
}

export interface TopUnitResponse {
  unitId: number;
  reservations: number;
}
