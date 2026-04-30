"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApiStatusBadge } from "@/components/ApiStatusBadge";
import { api } from "@/lib/api";

export default function HomePage() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    api
      .health()
      .then((response) => setStatus(response.status))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <main className="stack-lg">
      <section className="hero">
        <div className="stack">
          <p className="eyebrow">Campus Shuttle MVP</p>
          <h1>One frontend, interchangeable backends, shared campus operations flows.</h1>
          <p className="lede">
            Use this frontend to exercise auth, buses, routes, stops, live locations, and ETA
            against the active backend implementation.
          </p>
          <div className="row wrap">
            <ApiStatusBadge status={status} />
            <Link className="primary-button" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="ghost-button" href="/login">
              Sign in or register
            </Link>
          </div>
        </div>
      </section>
      <section className="grid-3">
        <Link href="/buses" className="card nav-card">
          <p className="eyebrow">Buses</p>
          <h3>Manage fleet records</h3>
          <p className="muted">Create buses, inspect route assignments, and open bus details.</p>
        </Link>
        <Link href="/routes" className="card nav-card">
          <p className="eyebrow">Routes</p>
          <h3>Shape the shuttle loops</h3>
          <p className="muted">Create routes and attach stops with ordered timing estimates.</p>
        </Link>
        <Link href="/eta" className="card nav-card">
          <p className="eyebrow">ETA</p>
          <h3>Check arrival predictions</h3>
          <p className="muted">Compare bus locations to stop coordinates in one quick screen.</p>
        </Link>
      </section>
    </main>
  );
}
