import { assignStopToRoute } from "@/services/route-service";
import { created, handleRouteError } from "@/lib/response";
import { createRouteStopSchema } from "@/lib/validators";

type RouteContext = {
  params: {
    routeId: string;
  };
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = createRouteStopSchema.parse(await request.json());
    const routeStop = await assignStopToRoute(Number(context.params.routeId), body);
    return created(routeStop);
  } catch (error) {
    return handleRouteError(error);
  }
}
