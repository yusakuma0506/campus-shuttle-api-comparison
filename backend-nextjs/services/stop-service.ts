import { prisma } from "../lib/prisma";
import { serializeStop } from "../lib/serializers";

export async function createStop(input: {
  name: string;
  latitude: number;
  longitude: number;
}) {
  const stop = await prisma.stop.create({
    data: {
      name: input.name,
      latitude: input.latitude,
      longitude: input.longitude,
    },
  });

  return serializeStop(stop);
}

export async function listStops() {
  const stops = await prisma.stop.findMany({
    orderBy: { id: "asc" },
  });

  return stops.map(serializeStop);
}
