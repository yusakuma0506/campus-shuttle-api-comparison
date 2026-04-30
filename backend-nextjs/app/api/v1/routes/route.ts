import { createRoute, listRoutes } from "@/services/route-service";
import { created, handleRouteError, ok } from "@/lib/response";
import { createRouteSchema } from "@/lib/validators";

export async function GET() {
  try {
    const routes = await listRoutes();
    return ok(routes);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = createRouteSchema.parse(await request.json());
    const route = await createRoute(body);
    return created(route);
  } catch (error) {
    return handleRouteError(error);
  }
}
