import { jwtVerify, SignJWT } from "jose";
import type { NextRequest } from "next/server";

import { ApiError } from "./response";

const encoder = new TextEncoder();

export type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  name: string;
};

function secretKey() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "CONFIGURATION_ERROR", "JWT_SECRET is not configured");
  }

  return encoder.encode(secret);
}

export async function signAccessToken(payload: TokenPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? "1h")
    .sign(secretKey());
}

export async function verifyAccessToken(token: string) {
  const verified = await jwtVerify(token, secretKey());
  const payload = verified.payload;

  if (!payload.sub || typeof payload.email !== "string" || typeof payload.role !== "string") {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid access token");
  }

  return {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    name: typeof payload.name === "string" ? payload.name : "",
  };
}

export function getBearerToken(request: Request | NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "UNAUTHORIZED", "Missing bearer token");
  }

  return header.slice("Bearer ".length);
}
