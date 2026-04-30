"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/api";
import { requireText } from "@/lib/validators";

type RouteFormProps = {
  onSubmit: (payload: { name: string; description: string | null }) => Promise<void>;
};

export function RouteForm({ onSubmit }: RouteFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      requireText(name, "Route name");
      setIsSaving(true);
      await onSubmit({
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
      });
      setName("");
      setDescription("");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="surface stack" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Create route</p>
        <h3>Define a shuttle loop</h3>
      </div>
      <div className="form-grid">
        <label>
          <span>Name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label>
          <span>Description</span>
          <input value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" disabled={isSaving} type="submit">
        {isSaving ? "Saving..." : "Create route"}
      </button>
    </form>
  );
}
