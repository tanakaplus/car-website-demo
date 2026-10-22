"use client";

import { useMemo, useState } from "react";
import { distanceKm, formatDistance } from "@/lib/dealers";
import type { Dealer } from "@/lib/types";

type DealerListProps = {
  dealers: Dealer[];
};

type Origin = {
  lat: number;
  lng: number;
};

type LocateStatus = "idle" | "locating" | "ready" | "denied" | "unavailable";

export function DealerList({ dealers }: DealerListProps) {
  const [origin, setOrigin] = useState<Origin | null>(null);
  const [status, setStatus] = useState<LocateStatus>("idle");

  const listed = useMemo(() => {
    const withDistance = dealers.map((dealer) => ({
      dealer,
      distance: origin ? distanceKm(origin, dealer) : null,
    }));

    if (!origin) return withDistance;
    return withDistance.sort((left, right) => (left.distance ?? 0) - (right.distance ?? 0));
  }, [dealers, origin]);

  function searchNearMe() {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }

    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOrigin({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("ready");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {status === "ready"
            ? "Nearest showrooms first."
            : `${dealers.length} ${dealers.length === 1 ? "showroom has" : "showrooms have"} this vehicle.`}
        </p>
        <button
          type="button"
          onClick={searchNearMe}
          disabled={status === "locating"}
          className="inline-flex h-12 items-center justify-center bg-accent px-6 text-sm font-medium text-white hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          {status === "locating" ? "Finding you…" : "Search near me"}
        </button>
      </div>

      {status === "denied" ? (
        <p role="alert" className="text-sm text-red-700">
          Location access was blocked. The list stays in showroom order.
        </p>
      ) : null}
      {status === "unavailable" ? (
        <p role="alert" className="text-sm text-red-700">
          This browser cannot share a location. The list stays in showroom order.
        </p>
      ) : null}

      <ul className="flex flex-col gap-px bg-line">
        {listed.map(({ dealer, distance }) => (
          <li key={dealer.id} className="bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.16em] text-muted uppercase">
                  {dealer.city}
                </p>
                <h2 className="mt-1 text-2xl font-light">{dealer.name}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {dealer.address}
                  <br />
                  {dealer.city}
                </p>
                <a href={`tel:${dealer.phone.replace(/\s/g, "")}`} className="mt-3 inline-block text-sm text-accent">
                  {dealer.phone}
                </a>
              </div>
              <div className="text-sm sm:text-right">
                <p className="font-medium">In stock</p>
                {distance !== null ? (
                  <p className="mt-1 text-muted">{formatDistance(distance)}</p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
