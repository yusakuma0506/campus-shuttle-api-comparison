import { createBus, listBuses } from "@/services/bus-service";
import { created, handleRouteError, ok } from "@/lib/response";
import { createBusSchema } from "@/lib/validators";

export async function GET() {
  try {
    const buses = await listBuses();
    return ok(buses);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = createBusSchema.parse(await request.json());
    const bus = await createBus(body);
    return created(bus);
  } catch (error) {
    return handleRouteError(error);
  }
}
