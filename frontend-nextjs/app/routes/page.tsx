"use client";

import { useEffect, useState } from "react";

import { RouteForm } from "@/components/RouteForm";
import { api, getErrorMessage } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Route } from "@/types/route";
import type { Stop } from "@/types/stop";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      const [nextRoutes, nextStops] = await Promise.all([api.listRoutes(), api.listStops()]);
      setRoutes(nextRoutes);
      setStops(nextStops);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreateRoute(payload: { name: string; description: string | null }) {
    await api.createRoute(payload, getAccessToken());
    setSuccess("Route created.");
    setError(null);
    await load();
  }

  async function handleAssignStop(
    routeId: number,
    stopId: string,
    stopOrder: string,
    estimatedMinutesFromStart: string,
  ) {
    await api.assignStopToRoute(
      routeId,
      {
        stop_id: Number(stopId),
        stop_order: Number(stopOrder),
        estimated_minutes_from_start: Number(estimatedMinutesFromStart),
      },
      getAccessToken(),
    );
    setSuccess("Stop assigned to route.");
    setError(null);
    await load();
  }

  return (
    <main className="stack-lg">
      <section className="row between wrap">
        <div>
          <p className="eyebrow">Network design</p>
          <h1>Routes</h1>
        </div>
        <p className="muted">{routes.length} routes loaded</p>
      </section>
      <RouteForm onSubmit={handleCreateRoute} />
      {success ? <p className="success-text">{success}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <section className="stack">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            stops={stops}
            onAssign={handleAssignStop}
          />
        ))}
      </section>
    </main>
  );
}

function RouteCard({
  route,
  stops,
  onAssign,
}: {
  route: Route;
  stops: Stop[];
  onAssign: (
    routeId: number,
    stopId: string,
    stopOrder: string,
    estimatedMinutesFromStart: string,
  ) => Promise<void>;
}) {
  const [stopId, setStopId] = useState(stops[0]?.id ? String(stops[0].id) : "");
  const [stopOrder, setStopOrder] = useState(String((route.routeStops ?? []).length));
  const [minutes, setMinutes] = useState("0");

  return (
    <article className="surface stack">
      <div className="row between wrap">
        <div>
          <p className="eyebrow">Route {route.id}</p>
          <h3>{route.name}</h3>
        </div>
        <span className="pill">{(route.routeStops ?? []).length} stops</span>
      </div>
      <p className="muted">{route.description ?? "No route summary yet."}</p>
      <div className="stack-sm">
        {(route.routeStops ?? []).length ? (
          (route.routeStops ?? []).map((routeStop) => (
            <div className="line-item" key={routeStop.id}>
              <strong>
                {routeStop.stopOrder ?? routeStop.stop_order} · {routeStop.stop.name}
              </strong>
              <span className="muted">
                {routeStop.estimatedMinutesFromStart ??
                  routeStop.estimated_minutes_from_start}{" "}
                min
              </span>
            </div>
          ))
        ) : (
          <p className="muted">No stops assigned yet.</p>
        )}
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          void onAssign(route.id, stopId, stopOrder, minutes);
        }}
      >
        <label>
          <span>Stop</span>
          <select value={stopId} onChange={(event) => setStopId(event.target.value)}>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Order</span>
          <input value={stopOrder} onChange={(event) => setStopOrder(event.target.value)} />
        </label>
        <label>
          <span>Minutes from start</span>
          <input value={minutes} onChange={(event) => setMinutes(event.target.value)} />
        </label>
        <button className="primary-button" type="submit">
          Assign stop
        </button>
      </form>
    </article>
  );
}
