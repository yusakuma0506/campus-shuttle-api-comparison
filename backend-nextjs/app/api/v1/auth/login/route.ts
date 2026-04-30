import { loginUser } from "@/services/auth-service";
import { handleRouteError, ok } from "@/lib/response";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const session = await loginUser(body);
    return ok(session);
  } catch (error) {
    return handleRouteError(error);
  }
}
