export type BusLocation = {
  id: number;
  bus_id: number;
  latitude: number;
  longitude: number;
  speed: number | null;
  recorded_at: string;
};
