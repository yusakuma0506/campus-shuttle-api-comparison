import { registerUser } from "@/services/auth-service";
import { created, handleRouteError } from "@/lib/response";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const user = await registerUser(body);
    return created(user);
  } catch (error) {
    return handleRouteError(error);
  }
}
