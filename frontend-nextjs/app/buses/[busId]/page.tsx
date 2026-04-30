"use client";

import { useEffect, useState } from "react";

import { LocationForm } from "@/components/LocationForm";
import { api, getErrorMessage } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { BusDetail } from "@/types/bus";
import type { BusLocation } from "@/types/location";

type BusDetailsPageProps = {
  params: {
    busId: string;
  };
};

export default function BusDetailsPage({ params }: BusDetailsPageProps) {
  const [bus, setBus] = useState<BusDetail | null>(null);
  const [location, setLocation] = useState<BusLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      const [nextBus, nextLocation] = await Promise.all([
        api.getBus(params.busId),
        api.getLatestLocation(params.busId).catch(() => null),
      ]);
      setBus(nextBus);
      setLocation(nextLocation);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    }
  }

  useEffect(() => {
    void load();
  }, [params.busId]);

  async function handleLocationSubmit(payload: {
    latitude: number;
    longitude: number;
    speed: number | null;
    recorded_at: string;
  }) {
    const nextLocation = await api.postLocation(params.busId, payload, getAccessToken());
    setLocation(nextLocation);
    setSuccess("Location update saved.");
    setError(null);
  }

  return (
    <main className="stack-lg">
      <section className="surface stack">
        <p className="eyebrow">Bus details</p>
        <h1>{bus ? `${bus.bus_number} · ${bus.name}` : `Bus ${params.busId}`}</h1>
        <p className="muted">
          {bus?.route ? `Current route: ${bus.route.name}` : "This bus has no route assignment yet."}
        </p>
      </section>
      {success ? <p className="success-text">{success}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <section className="grid-2">
        <LocationForm onSubmit={handleLocationSubmit} />
        <article className="surface stack">
          <p className="eyebrow">Latest location</p>
          {location ? (
            <>
              <div className="line-item">
                <strong>Latitude</strong>
                <span>{location.latitude}</span>
              </div>
              <div className="line-item">
                <strong>Longitude</strong>
                <span>{location.longitude}</span>
              </div>
              <div className="line-item">
                <strong>Speed</strong>
                <span>{location.speed ?? "n/a"} km/h</span>
              </div>
              <div className="line-item">
                <strong>Recorded at</strong>
                <span>{new Date(location.recorded_at).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <p className="muted">No location recorded yet for this bus.</p>
          )}
        </article>
      </section>
    </main>
  );
}
