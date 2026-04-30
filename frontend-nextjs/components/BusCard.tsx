"use client";

import Link from "next/link";

import type { Bus } from "@/types/bus";

type BusCardProps = {
  bus: Bus;
};

export function BusCard({ bus }: BusCardProps) {
  return (
    <article className="card stack-sm">
      <div className="row">
        <div>
          <p className="eyebrow">{bus.bus_number}</p>
          <h3>{bus.name}</h3>
        </div>
        <span className="pill">{bus.status}</span>
      </div>
      <p className="muted">
        {bus.route ? `Assigned to ${bus.route.name}` : "No route assigned yet."}
      </p>
      <Link className="link-button" href={`/buses/${bus.id}`}>
        View bus details
      </Link>
    </article>
  );
}
