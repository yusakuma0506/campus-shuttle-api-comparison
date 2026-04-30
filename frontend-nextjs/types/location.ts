export type BusLocation = {
  id: number;
  bus_id: number;
  latitude: number;
  longitude: number;
  speed: number | null;
  recorded_at: string;
  created_at?: string;
};

export type EtaResponse = {
  bus_id: number;
  stop_id: number;
  estimated_arrival_minutes: number;
  distance_km: number;
  based_on_recorded_at: string;
};
