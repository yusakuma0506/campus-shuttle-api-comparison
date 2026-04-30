"use client";

import { useEffect, useState } from "react";

import { api, getErrorMessage } from "@/lib/api";
import type { Bus } from "@/types/bus";
import type { EtaResponse } from "@/types/location";
import type { Stop } from "@/types/stop";

export default function EtaPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedBusId, setSelectedBusId] = useState("");
  const [selectedStopId, setSelectedStopId] = useState("");
  const [eta, setEta] = useState<EtaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [nextBuses, nextStops] = await Promise.all([api.listBuses(), api.listStops()]);
        setBuses(nextBuses);
        setStops(nextStops);
        if (nextBuses[0]) {
          setSelectedBusId(String(nextBuses[0].id));
        }
        if (nextStops[0]) {
          setSelectedStopId(String(nextStops[0].id));
        }
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      }
    }

    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const nextEta = await api.getEta(selectedBusId, selectedStopId);
      setEta(nextEta);
    } catch (submitError) {
      setEta(null);
      setError(getErrorMessage(submitError));
    }
  }

  return (
    <main className="grid-2">
      <form className="surface stack" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Simple arrival estimate</p>
          <h1>ETA</h1>
        </div>
        <label>
          <span>Bus</span>
          <select value={selectedBusId} onChange={(event) => setSelectedBusId(event.target.value)}>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.bus_number} · {bus.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Stop</span>
          <select value={selectedStopId} onChange={(event) => setSelectedStopId(event.target.value)}>
            {stops.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" type="submit">
          Calculate ETA
        </button>
      </form>
      <section className="surface stack">
        <p className="eyebrow">Result</p>
        {eta ? (
          <>
            <div className="line-item">
              <strong>Arrival</strong>
              <span>{eta.estimated_arrival_minutes} minutes</span>
            </div>
            <div className="line-item">
              <strong>Distance</strong>
              <span>{eta.distance_km} km</span>
            </div>
            <div className="line-item">
              <strong>Recorded at</strong>
              <span>{new Date(eta.based_on_recorded_at).toLocaleString()}</span>
            </div>
          </>
        ) : (
          <p className="muted">Choose a bus and a stop to calculate a simple ETA.</p>
        )}
      </section>
    </main>
  );
}
