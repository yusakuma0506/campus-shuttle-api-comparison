"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/api";
import { requireText } from "@/lib/validators";
import type { Route } from "@/types/route";

type BusFormProps = {
  routes: Route[];
  onSubmit: (payload: {
    bus_number: string;
    name: string;
    status: string;
    route_id: number | null;
  }) => Promise<void>;
};

export function BusForm({ routes, onSubmit }: BusFormProps) {
  const [busNumber, setBusNumber] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [routeId, setRouteId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      requireText(busNumber, "Bus number");
      requireText(name, "Bus name");
      setIsSaving(true);
      await onSubmit({
        bus_number: busNumber.trim(),
        name: name.trim(),
        status,
        route_id: routeId ? Number(routeId) : null,
      });
      setBusNumber("");
      setName("");
      setStatus("active");
      setRouteId("");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="surface stack" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Create bus</p>
        <h3>Register a shuttle</h3>
      </div>
      <div className="form-grid">
        <label>
          <span>Bus number</span>
          <input value={busNumber} onChange={(event) => setBusNumber(event.target.value)} />
        </label>
        <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="maintenance">maintenance</option>
          </select>
        </label>
        <label>
          <span>Route</span>
          <select value={routeId} onChange={(event) => setRouteId(event.target.value)}>
            <option value="">Unassigned</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" disabled={isSaving} type="submit">
        {isSaving ? "Saving..." : "Create bus"}
      </button>
    </form>
  );
}
