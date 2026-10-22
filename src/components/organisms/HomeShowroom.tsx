"use client";

import { useState } from "react";
import { IntentSearch } from "@/components/organisms/IntentSearch";
import { ModelTile } from "@/components/molecules/ModelTile";
import { cars } from "@/lib/cars";
import { filterCars } from "@/lib/filters";

export function HomeShowroom() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const visible = filterCars(cars, selectedFilters);

  function toggleFilter(id: string) {
    setSelectedFilters((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <>
      <section id="find" className="relative z-20 -mt-16 px-5 md:px-8">
        <div className="mx-auto max-w-6xl bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.12)] md:p-8">
          <IntentSearch
            selectedFilters={selectedFilters}
            onToggleFilter={toggleFilter}
            onClearFilters={() => setSelectedFilters([])}
          />
        </div>
      </section>

      <section id="range" className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">The range</p>
        <h2 className="mt-3 text-4xl font-light">Models in the showroom</h2>
        {visible.length === 0 ? (
          <p className="mt-8 max-w-xl text-sm leading-6 text-muted">
            No models match those filters.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {visible.map((car) => (
              <ModelTile key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
