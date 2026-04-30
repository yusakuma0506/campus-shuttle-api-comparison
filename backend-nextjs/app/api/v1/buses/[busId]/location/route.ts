import { createLocation, getLatestLocation } from "@/services/location-service";
import { created, handleRouteError, ok } from "@/lib/response";
import { createLocationSchema } from "@/lib/validators";

type RouteContext = {
  params: {
    busId: string;
  };
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const location = await getLatestLocation(Number(context.params.busId));
    return ok(location);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const body = createLocationSchema.parse(await request.json());
    const location = await createLocation(Number(context.params.busId), body);
    return created(location);
  } catch (error) {
    return handleRouteError(error);
  }
}
