import { getCurrentUser } from "@/services/auth-service";
import { handleRouteError, ok } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    return ok(user);
  } catch (error) {
    return handleRouteError(error);
  }
}
