import { PrismaClient } from "@prisma/client";

declare global {
  var __campusPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__campusPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__campusPrisma__ = prisma;
}
