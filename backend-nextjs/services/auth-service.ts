import { compare, hash } from "bcryptjs";

import { getBearerToken, signAccessToken, verifyAccessToken } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { ApiError } from "../lib/response";

function toPublicUser(user: {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt?: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.createdAt,
    ...(user.updatedAt ? { updated_at: user.updatedAt } : {}),
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ApiError(409, "CONFLICT", "Email already exists", { field: "email" });
  }

  const passwordHash = await hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
  });

  return toPublicUser(user);
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const passwordMatches = await compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const accessToken = await signAccessToken({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    name: user.name,
  });

  return {
    access_token: accessToken,
    token_type: "bearer",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getCurrentUser(request: Request) {
  const token = getBearerToken(request);
  const payload = await verifyAccessToken(token);
  const userId = Number(payload.sub);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "User not found");
  }

  return toPublicUser(user);
}
