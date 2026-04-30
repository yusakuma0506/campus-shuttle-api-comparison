import { getEta } from "@/services/eta-service";
import { ApiError, handleRouteError, ok } from "@/lib/response";

type RouteContext = {
  params: {
    busId: string;
  };
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const url = new URL(request.url);
    const stopId = Number(url.searchParams.get("stop_id"));

    if (!Number.isInteger(stopId) || stopId <= 0) {
      throw new ApiError(400, "VALIDATION_ERROR", "stop_id query parameter is required");
    }

    const eta = await getEta(Number(context.params.busId), stopId);
    return ok(eta);
  } catch (error) {
    return handleRouteError(error);
  }
}
