import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

function serialize(data: unknown): unknown {
  if (data instanceof Date) {
    return data.toISOString();
  }

  if (data instanceof Prisma.Decimal) {
    return data.toNumber();
  }

  if (Array.isArray(data)) {
    return data.map(serialize);
  }

  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serialize(value)]),
    );
  }

  return data;
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(serialize(data), { status });
}

export function created(data: unknown) {
  return ok(data, 201);
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details: serialize(details) } : {}),
      },
    },
    { status },
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof ApiError) {
    return errorResponse(error.status, error.code, error.message, error.details);
  }

  if (error instanceof ZodError) {
    return errorResponse(400, "VALIDATION_ERROR", "Invalid request body", error.flatten());
  }

  console.error(error);
  return errorResponse(500, "INTERNAL_SERVER_ERROR", "Unexpected server error");
}
