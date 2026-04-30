import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8),
  role: z.string().trim().min(1).default("operator"),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const createBusSchema = z.object({
  bus_number: z.string().trim().min(1),
  name: z.string().trim().min(1),
  status: z.string().trim().min(1).default("active"),
  route_id: z.number().int().positive().nullable().optional(),
});

export const createRouteSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1).nullable().optional(),
});

export const createStopSchema = z.object({
  name: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const createRouteStopSchema = z.object({
  stop_id: z.number().int().positive(),
  stop_order: z.number().int().min(0),
  estimated_minutes_from_start: z.number().int().min(0),
});

export const createLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().min(0).nullable().optional(),
  recorded_at: z.string().datetime({ offset: true }),
});
