"use client";

import { useEffect, useState } from "react";

import { ApiStatusBadge } from "@/components/ApiStatusBadge";
import { api, getErrorMessage } from "@/lib/api";
import type { Bus } from "@/types/bus";
import type { Route } from "@/types/route";
import type { Stop } from "@/types/stop";

export default function DashboardPage() {
  const [status, setStatus] = useState("checking");
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [health, nextBuses, nextRoutes, nextStops] = await Promise.all([
          api.health(),
          api.listBuses(),
          api.listRoutes(),
          api.listStops(),
        ]);

        setStatus(health.status);
        setBuses(nextBuses);
        setRoutes(nextRoutes);
        setStops(nextStops);
      } catch (loadError) {
        setStatus("offline");
        setError(getErrorMessage(loadError));
      }
    }

    void load();
  }, []);

  return (
    <main className="stack-lg">
      <section className="row wrap between">
        <div>
          <p className="eyebrow">Operations dashboard</p>
          <h1>Shared backend snapshot</h1>
        </div>
        <ApiStatusBadge status={status} />
      </section>
      {error ? <p className="error-text">{error}</p> : null}
      <section className="grid-3">
        <article className="card">
          <p className="eyebrow">Buses</p>
          <h2>{buses.length}</h2>
          <p className="muted">Fleet records currently available.</p>
        </article>
        <article className="card">
          <p className="eyebrow">Routes</p>
          <h2>{routes.length}</h2>
          <p className="muted">Defined campus loops.</p>
        </article>
        <article className="card">
          <p className="eyebrow">Stops</p>
          <h2>{stops.length}</h2>
          <p className="muted">Pickup points loaded into the shared database.</p>
        </article>
      </section>
      <section className="grid-2">
        <article className="surface stack">
          <h3>Route coverage</h3>
          {routes.length ? (
            routes.map((route) => (
              <div className="line-item" key={route.id}>
                <strong>{route.name}</strong>
                <span className="muted">
                  {(route.routeStops ?? []).length} mapped stop
                  {(route.routeStops ?? []).length === 1 ? "" : "s"}
                </span>
              </div>
            ))
          ) : (
            <p className="muted">No routes yet.</p>
          )}
        </article>
        <article className="surface stack">
          <h3>Fleet assignment</h3>
          {buses.length ? (
            buses.map((bus) => (
              <div className="line-item" key={bus.id}>
                <strong>{bus.bus_number}</strong>
                <span className="muted">{bus.route?.name ?? "Unassigned"}</span>
              </div>
            ))
          ) : (
            <p className="muted">No buses yet.</p>
          )}
        </article>
      </section>
    </main>
  );
}
