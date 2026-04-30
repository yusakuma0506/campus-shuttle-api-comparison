"use client";

import { useEffect, useState } from "react";

import { BusCard } from "@/components/BusCard";
import { BusForm } from "@/components/BusForm";
import { api, getErrorMessage } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Bus } from "@/types/bus";
import type { Route } from "@/types/route";

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      const [nextBuses, nextRoutes] = await Promise.all([api.listBuses(), api.listRoutes()]);
      setBuses(nextBuses);
      setRoutes(nextRoutes);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreateBus(payload: {
    bus_number: string;
    name: string;
    status: string;
    route_id: number | null;
  }) {
    await api.createBus(payload, getAccessToken());
    setSuccess("Bus created.");
    setError(null);
    await load();
  }

  return (
    <main className="stack-lg">
      <section className="row between wrap">
        <div>
          <p className="eyebrow">Fleet management</p>
          <h1>Buses</h1>
        </div>
        <p className="muted">{buses.length} fleet records loaded</p>
      </section>
      <BusForm routes={routes} onSubmit={handleCreateBus} />
      {success ? <p className="success-text">{success}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <section className="grid-3">
        {buses.map((bus) => (
          <BusCard key={bus.id} bus={bus} />
        ))}
      </section>
    </main>
  );
}
