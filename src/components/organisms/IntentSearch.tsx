"use client";

import { useState, type FormEvent } from "react";
import { ActiveFilterChips } from "@/components/molecules/ActiveFilterChips";
import { CarCard } from "@/components/molecules/CarCard";
import { FilterPills } from "@/components/molecules/FilterPills";
import { ModelStatus } from "@/components/molecules/ModelStatus";
import { QueryChips } from "@/components/molecules/QueryChips";
import { SearchBar } from "@/components/molecules/SearchBar";
import { SearchProgress } from "@/components/molecules/SearchProgress";
import { cars } from "@/lib/cars";
import { autoFilters, filterCars } from "@/lib/filters";
import type { ScoredCar } from "@/lib/types";

type IntentSearchProps = {
  selectedFilters: string[];
  onToggleFilter: (id: string) => void;
  onClearFilters: () => void;
};

export function IntentSearch({
  selectedFilters,
  onToggleFilter,
  onClearFilters,
}: IntentSearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [results, setResults] = useState<ScoredCar[] | null>(null);
  const [resultFilters, setResultFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const matches = filterCars(cars, selectedFilters);
  const filtersActive = selectedFilters.length > 0;
  const shown = results ? filterCars(results, [...selectedFilters, ...resultFilters]) : null;

  function dismissResultFilter(id: string) {
    setResultFilters((current) => current.filter((item) => item !== id));
  }

  async function search(nextQuery: string, filters: string[]) {
    const trimmed = nextQuery.trim();
    if (!trimmed || isSearching) return;

    setQuery(trimmed);
    setIsSearching(true);
    setError(null);
    setResultFilters([]);

    try {
      const response = await fetch("/api/rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, filters }),
      });
      const payload = (await response.json()) as {
        results?: ScoredCar[];
        filters?: string[];
        error?: string;
      };

      if (!response.ok || !payload.results) {
        throw new Error(payload.error || "Ranking failed.");
      }

      setResults(payload.results);
      setResultFilters(autoFilters(payload.results, payload.filters ?? []));
    } catch (searchError) {
      setResults(null);
      setError(searchError instanceof Error ? searchError.message : "Ranking failed.");
    } finally {
      setIsSearching(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void search(query, selectedFilters);
  }

  function handleExample(nextQuery: string) {
    onClearFilters();
    void search(nextQuery, []);
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SearchBar
          query={query}
          isSearching={isSearching}
          onQueryChange={setQuery}
          onSubmit={handleSubmit}
        />
        <QueryChips disabled={isSearching} onSelect={handleExample} />
        <div>
          <button
            type="button"
            aria-expanded={refineOpen}
            onClick={() => setRefineOpen((open) => !open)}
            className="text-sm font-medium text-ink hover:text-accent"
          >
            {refineOpen ? "Hide filters" : "Refine filters"}
            {filtersActive ? ` (${selectedFilters.length})` : ""}
          </button>
          {refineOpen ? (
            <div className="mt-4">
              <FilterPills
                selected={selectedFilters}
                onToggle={onToggleFilter}
                onClear={onClearFilters}
              />
            </div>
          ) : null}
        </div>
        {isSearching ? <SearchProgress query={query.trim()} /> : null}
        <ModelStatus
          phase="ready"
          detail={
            filtersActive
              ? `Compared with ${matches.length} ${matches.length === 1 ? "car" : "cars"} matching the filters`
              : "Compared with every car currently in the showroom"
          }
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!isSearching && results && results.length > 0 ? (
        <div className="flex flex-col gap-4">
          <ActiveFilterChips ids={resultFilters} onDismiss={dismissResultFilter} />
          {shown && shown.length > 0 ? (
            <ol className="flex flex-col gap-4">
              {shown.map((car, index) => (
                <li key={car.id}>
                  <CarCard car={car} rank={index + 1} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="max-w-xl text-sm leading-6 text-muted">
              Nothing in that selection fits the request well enough to show.
            </p>
          )}
        </div>
      ) : null}

      {!isSearching && results && results.length === 0 ? (
        <p className="max-w-xl text-sm leading-6 text-muted">
          {filtersActive
            ? "Nothing in that selection fits the request well enough to show."
            : "Nothing in the catalog fits that request well enough to show."}
        </p>
      ) : null}

      {!isSearching && !results && filtersActive && matches.length === 0 ? (
        <p className="max-w-xl text-sm leading-6 text-muted">
          No cars in the showroom match those filters.
        </p>
      ) : null}

      {!isSearching && !results && matches.length > 0 && filtersActive ? (
        <p className="max-w-xl text-sm leading-6 text-muted">
          {matches.length} {matches.length === 1 ? "model matches" : "models match"} these
          filters. Add a description and search to rank them for a specific job.
        </p>
      ) : null}

      {!isSearching && !results && !filtersActive ? (
        <p className="max-w-xl text-sm leading-6 text-muted">
          Describe the job the car has to do, or try an example. Strong matches open onto a
          vehicle page where you can request an offer.
        </p>
      ) : null}
    </section>
  );
}
