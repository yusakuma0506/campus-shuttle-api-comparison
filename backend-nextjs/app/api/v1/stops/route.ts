import { createStop, listStops } from "@/services/stop-service";
import { created, handleRouteError, ok } from "@/lib/response";
import { createStopSchema } from "@/lib/validators";

export async function GET() {
  try {
    const stops = await listStops();
    return ok(stops);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = createStopSchema.parse(await request.json());
    const stop = await createStop(body);
    return created(stop);
  } catch (error) {
    return handleRouteError(error);
  }
}
