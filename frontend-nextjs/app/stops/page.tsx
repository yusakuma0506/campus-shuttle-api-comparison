"use client";

import { useEffect, useState } from "react";

import { StopForm } from "@/components/StopForm";
import { api, getErrorMessage } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { Stop } from "@/types/stop";

export default function StopsPage() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      setStops(await api.listStops());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreateStop(payload: {
    name: string;
    latitude: number;
    longitude: number;
  }) {
    await api.createStop(payload, getAccessToken());
    setSuccess("Stop created.");
    setError(null);
    await load();
  }

  return (
    <main className="stack-lg">
      <section className="row between wrap">
        <div>
          <p className="eyebrow">Campus map</p>
          <h1>Stops</h1>
        </div>
        <p className="muted">{stops.length} stops loaded</p>
      </section>
      <StopForm onSubmit={handleCreateStop} />
      {success ? <p className="success-text">{success}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <section className="grid-3">
        {stops.map((stop) => (
          <article className="card stack-sm" key={stop.id}>
            <p className="eyebrow">Stop {stop.id}</p>
            <h3>{stop.name}</h3>
            <p className="muted">
              {stop.latitude}, {stop.longitude}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
