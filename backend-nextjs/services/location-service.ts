import { prisma } from "../lib/prisma";
import { ApiError } from "../lib/response";
import { serializeLocation } from "../lib/serializers";

export async function createLocation(
  busId: number,
  input: {
    latitude: number;
    longitude: number;
    speed?: number | null;
    recorded_at: string;
  },
) {
  const bus = await prisma.bus.findUnique({ where: { id: busId } });

  if (!bus) {
    throw new ApiError(404, "NOT_FOUND", "Bus not found");
  }

  const location = await prisma.busLocation.create({
    data: {
      busId,
      latitude: input.latitude,
      longitude: input.longitude,
      speed: input.speed ?? null,
      recordedAt: new Date(input.recorded_at),
    },
  });

  return serializeLocation(location);
}

export async function getLatestLocation(busId: number) {
  const bus = await prisma.bus.findUnique({ where: { id: busId } });

  if (!bus) {
    throw new ApiError(404, "NOT_FOUND", "Bus not found");
  }

  const latestLocation = await prisma.busLocation.findFirst({
    where: { busId },
    orderBy: { recordedAt: "desc" },
  });

  if (!latestLocation) {
    throw new ApiError(404, "NOT_FOUND", "No location found for bus");
  }

  return serializeLocation(latestLocation);
}
