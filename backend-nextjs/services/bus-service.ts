import { prisma } from "../lib/prisma";
import { ApiError } from "../lib/response";
import { serializeBus } from "../lib/serializers";

export async function createBus(input: {
  bus_number: string;
  name: string;
  status: string;
  route_id?: number | null;
}) {
  if (input.route_id) {
    const route = await prisma.route.findUnique({ where: { id: input.route_id } });

    if (!route) {
      throw new ApiError(404, "NOT_FOUND", "Route not found", { field: "route_id" });
    }
  }

  try {
    const bus = await prisma.bus.create({
      data: {
        busNumber: input.bus_number,
        name: input.name,
        status: input.status,
        routeId: input.route_id ?? null,
      },
      include: {
        route: true,
      },
    });

    return serializeBus(bus);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "CONFLICT", "Bus number already exists", {
        field: "bus_number",
      });
    }

    throw error;
  }
}

export async function listBuses() {
  const buses = await prisma.bus.findMany({
    orderBy: { id: "asc" },
    include: {
      route: true,
    },
  });

  return buses.map(serializeBus);
}

export async function getBusById(busId: number) {
  const bus = await prisma.bus.findUnique({
    where: { id: busId },
    include: {
      route: true,
    },
  });

  if (!bus) {
    throw new ApiError(404, "NOT_FOUND", "Bus not found");
  }

  return serializeBus(bus);
}
