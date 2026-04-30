export type Route = {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  routeStops?: Array<{
    id: number;
    routeId?: number;
    stopId?: number;
    stop_order?: number;
    stopOrder?: number;
    estimated_minutes_from_start?: number;
    estimatedMinutesFromStart?: number;
    stop: {
      id: number;
      name: string;
      latitude: number;
      longitude: number;
    };
  }>;
};
