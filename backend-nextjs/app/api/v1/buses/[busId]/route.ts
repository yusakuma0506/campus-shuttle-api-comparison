import { getBusById } from "@/services/bus-service";
import { handleRouteError, ok } from "@/lib/response";

type RouteContext = {
  params: {
    busId: string;
  };
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const bus = await getBusById(Number(context.params.busId));
    return ok(bus);
  } catch (error) {
    return handleRouteError(error);
  }
}
