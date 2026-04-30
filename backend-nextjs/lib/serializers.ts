type RouteRecord = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type StopRecord = {
  id: number;
  name: string;
  latitude: unknown;
  longitude: unknown;
  createdAt: Date;
  updatedAt: Date;
};

type RouteStopRecord = {
  id: number;
  routeId: number;
  stopId: number;
  stopOrder: number;
  estimatedMinutesFromStart: number;
  createdAt: Date;
  updatedAt: Date;
  stop?: StopRecord;
};

type BusRecord = {
  id: number;
  busNumber: string;
  name: string;
  status: string;
  routeId: number | null;
  createdAt: Date;
  updatedAt: Date;
  route?: RouteRecord | null;
};

type LocationRecord = {
  id: number;
  busId: number;
  latitude: unknown;
  longitude: unknown;
  speed: unknown;
  recordedAt: Date;
  createdAt: Date;
};

function toNumber(value: unknown) {
  return typeof value === "object" && value && "toNumber" in value
    ? (value as { toNumber(): number }).toNumber()
    : Number(value);
}

export function serializeRoute(route: RouteRecord & { routeStops?: RouteStopRecord[] }) {
  return {
    id: route.id,
    name: route.name,
    description: route.description,
    created_at: route.createdAt,
    updated_at: route.updatedAt,
    ...(route.routeStops
      ? {
          routeStops: route.routeStops.map(serializeRouteStop),
        }
      : {}),
  };
}

export function serializeStop(stop: StopRecord) {
  return {
    id: stop.id,
    name: stop.name,
    latitude: toNumber(stop.latitude),
    longitude: toNumber(stop.longitude),
    created_at: stop.createdAt,
    updated_at: stop.updatedAt,
  };
}

export function serializeRouteStop(routeStop: RouteStopRecord) {
  return {
    id: routeStop.id,
    route_id: routeStop.routeId,
    stop_id: routeStop.stopId,
    stop_order: routeStop.stopOrder,
    estimated_minutes_from_start: routeStop.estimatedMinutesFromStart,
    created_at: routeStop.createdAt,
    updated_at: routeStop.updatedAt,
    ...(routeStop.stop ? { stop: serializeStop(routeStop.stop) } : {}),
  };
}

export function serializeBus(bus: BusRecord) {
  return {
    id: bus.id,
    bus_number: bus.busNumber,
    name: bus.name,
    status: bus.status,
    route_id: bus.routeId,
    created_at: bus.createdAt,
    updated_at: bus.updatedAt,
    ...(bus.route ? { route: serializeRoute(bus.route) } : { route: null }),
  };
}

export function serializeLocation(location: LocationRecord) {
  return {
    id: location.id,
    bus_id: location.busId,
    latitude: toNumber(location.latitude),
    longitude: toNumber(location.longitude),
    speed:
      location.speed === null || location.speed === undefined ? null : toNumber(location.speed),
    recorded_at: location.recordedAt,
    created_at: location.createdAt,
  };
}
