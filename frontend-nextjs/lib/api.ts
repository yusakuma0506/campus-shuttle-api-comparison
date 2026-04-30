import type { Bus, BusDetail } from "@/types/bus";
import type { BusLocation, EtaResponse } from "@/types/location";
import type { Route } from "@/types/route";
import type { Stop } from "@/types/stop";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error?.message ?? `Request failed with status ${response.status}`;

    throw new ApiClientError(message, response.status, payload?.error?.details);
  }

  return payload as T;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
}

export const api = {
  health: () => request<{ status: string; service?: string; frontend_url?: string }>("/health"),
  register: (body: { name: string; email: string; password: string; role: string }) =>
    request<{
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    }>("/auth/register", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    request<{
      access_token: string;
      token_type: string;
      user: { id: number; name: string; email: string; role: string };
    }>("/auth/login", { method: "POST", body }),
  me: (token: string) =>
    request<{
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
      updated_at: string;
    }>("/auth/me", { token }),
  listBuses: () => request<Bus[]>("/buses"),
  getBus: (busId: string | number) => request<BusDetail>(`/buses/${busId}`),
  createBus: (
    body: { bus_number: string; name: string; status: string; route_id: number | null },
    token?: string | null,
  ) => request<Bus>("/buses", { method: "POST", body, token }),
  listRoutes: () => request<Route[]>("/routes"),
  createRoute: (body: { name: string; description: string | null }, token?: string | null) =>
    request<Route>("/routes", { method: "POST", body, token }),
  assignStopToRoute: (
    routeId: number,
    body: { stop_id: number; stop_order: number; estimated_minutes_from_start: number },
    token?: string | null,
  ) => request(`/routes/${routeId}/stops`, { method: "POST", body, token }),
  listStops: () => request<Stop[]>("/stops"),
  createStop: (
    body: { name: string; latitude: number; longitude: number },
    token?: string | null,
  ) => request<Stop>("/stops", { method: "POST", body, token }),
  getLatestLocation: (busId: string | number) =>
    request<BusLocation>(`/buses/${busId}/location`),
  postLocation: (
    busId: string | number,
    body: { latitude: number; longitude: number; speed: number | null; recorded_at: string },
    token?: string | null,
  ) => request<BusLocation>(`/buses/${busId}/location`, { method: "POST", body, token }),
  getEta: (busId: string | number, stopId: string | number) =>
    request<EtaResponse>(`/buses/${busId}/eta?stop_id=${stopId}`),
};
