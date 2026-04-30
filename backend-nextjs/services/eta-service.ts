import { prisma } from "../lib/prisma";
import { ApiError } from "../lib/response";

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(endLatitude - startLatitude);
  const dLon = toRadians(endLongitude - startLongitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(startLatitude)) *
      Math.cos(toRadians(endLatitude)) *
      Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function getEta(busId: number, stopId: number) {
  const [bus, stop, latestLocation] = await Promise.all([
    prisma.bus.findUnique({ where: { id: busId } }),
    prisma.stop.findUnique({ where: { id: stopId } }),
    prisma.busLocation.findFirst({
      where: { busId },
      orderBy: { recordedAt: "desc" },
    }),
  ]);

  if (!bus) {
    throw new ApiError(404, "NOT_FOUND", "Bus not found");
  }

  if (!stop) {
    throw new ApiError(404, "NOT_FOUND", "Stop not found");
  }

  if (!latestLocation) {
    throw new ApiError(404, "NOT_FOUND", "No location found for bus");
  }

  const distanceKm = haversineDistanceKm(
    latestLocation.latitude.toNumber(),
    latestLocation.longitude.toNumber(),
    stop.latitude.toNumber(),
    stop.longitude.toNumber(),
  );

  const speedKmh = latestLocation.speed?.toNumber() && latestLocation.speed.toNumber() > 0
    ? latestLocation.speed.toNumber()
    : 20;

  const estimatedArrivalMinutes = Math.max(1, Math.round((distanceKm / speedKmh) * 60));

  return {
    bus_id: busId,
    stop_id: stopId,
    estimated_arrival_minutes: estimatedArrivalMinutes,
    distance_km: Number(distanceKm.toFixed(2)),
    based_on_recorded_at: latestLocation.recordedAt,
  };
}
