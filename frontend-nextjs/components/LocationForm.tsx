"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/api";
import { requireNumberInRange } from "@/lib/validators";

type LocationFormProps = {
  onSubmit: (payload: {
    latitude: number;
    longitude: number;
    speed: number | null;
    recorded_at: string;
  }) => Promise<void>;
};

export function LocationForm({ onSubmit }: LocationFormProps) {
  const [latitude, setLatitude] = useState("1.2967");
  const [longitude, setLongitude] = useState("103.7765");
  const [speed, setSpeed] = useState("28.5");
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 16));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const nextLatitude = Number(latitude);
      const nextLongitude = Number(longitude);
      const nextSpeed = speed ? Number(speed) : null;

      requireNumberInRange(nextLatitude, "Latitude", -90, 90);
      requireNumberInRange(nextLongitude, "Longitude", -180, 180);

      setIsSaving(true);
      await onSubmit({
        latitude: nextLatitude,
        longitude: nextLongitude,
        speed: nextSpeed,
        recorded_at: new Date(recordedAt).toISOString(),
      });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="surface stack" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Update location</p>
        <h3>Send the latest bus coordinates</h3>
      </div>
      <div className="form-grid">
        <label>
          <span>Latitude</span>
          <input value={latitude} onChange={(event) => setLatitude(event.target.value)} />
        </label>
        <label>
          <span>Longitude</span>
          <input value={longitude} onChange={(event) => setLongitude(event.target.value)} />
        </label>
        <label>
          <span>Speed (km/h)</span>
          <input value={speed} onChange={(event) => setSpeed(event.target.value)} />
        </label>
        <label>
          <span>Recorded at</span>
          <input
            type="datetime-local"
            value={recordedAt}
            onChange={(event) => setRecordedAt(event.target.value)}
          />
        </label>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" disabled={isSaving} type="submit">
        {isSaving ? "Posting..." : "Post location"}
      </button>
    </form>
  );
}
