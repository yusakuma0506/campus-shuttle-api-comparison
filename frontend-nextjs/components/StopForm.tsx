"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/api";
import { requireNumberInRange, requireText } from "@/lib/validators";

type StopFormProps = {
  onSubmit: (payload: { name: string; latitude: number; longitude: number }) => Promise<void>;
};

export function StopForm({ onSubmit }: StopFormProps) {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("1.2966");
  const [longitude, setLongitude] = useState("103.7764");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const nextLatitude = Number(latitude);
      const nextLongitude = Number(longitude);

      requireText(name, "Stop name");
      requireNumberInRange(nextLatitude, "Latitude", -90, 90);
      requireNumberInRange(nextLongitude, "Longitude", -180, 180);

      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        latitude: nextLatitude,
        longitude: nextLongitude,
      });
      setName("");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="surface stack" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Create stop</p>
        <h3>Add a campus pickup point</h3>
      </div>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          <span>Latitude</span>
          <input value={latitude} onChange={(event) => setLatitude(event.target.value)} />
        </label>
        <label>
          <span>Longitude</span>
          <input value={longitude} onChange={(event) => setLongitude(event.target.value)} />
        </label>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" disabled={isSaving} type="submit">
        {isSaving ? "Saving..." : "Create stop"}
      </button>
    </form>
  );
}
