import { prisma } from "../lib/prisma";
import { ApiError } from "../lib/response";
import { serializeRoute, serializeRouteStop } from "../lib/serializers";

export async function createRoute(input: { name: string; description?: string | null }) {
  const route = await prisma.route.create({
    data: {
      name: input.name,
      description: input.description ?? null,
    },
  });

  return serializeRoute(route);
}

export async function listRoutes() {
  const routes = await prisma.route.findMany({
    orderBy: { id: "asc" },
    include: {
      routeStops: {
        orderBy: { stopOrder: "asc" },
        include: { stop: true },
      },
    },
  });

  return routes.map(serializeRoute);
}

export async function assignStopToRoute(
  routeId: number,
  input: {
    stop_id: number;
    stop_order: number;
    estimated_minutes_from_start: number;
  },
) {
  const [route, stop] = await Promise.all([
    prisma.route.findUnique({ where: { id: routeId } }),
    prisma.stop.findUnique({ where: { id: input.stop_id } }),
  ]);

  if (!route) {
    throw new ApiError(404, "NOT_FOUND", "Route not found");
  }

  if (!stop) {
    throw new ApiError(404, "NOT_FOUND", "Stop not found");
  }

  try {
    const routeStop = await prisma.routeStop.create({
      data: {
        routeId,
        stopId: input.stop_id,
        stopOrder: input.stop_order,
        estimatedMinutesFromStart: input.estimated_minutes_from_start,
      },
    });

    return serializeRouteStop(routeStop);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "CONFLICT", "Route stop already exists", {
        route_id: routeId,
        stop_id: input.stop_id,
        stop_order: input.stop_order,
      });
    }

    throw error;
  }
}
