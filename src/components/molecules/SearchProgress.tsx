"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  "Reading what you want the car to do",
  "Comparing that with every description",
  "Setting aside cars that only sound similar",
  "Writing a reason for the order",
];

type SearchProgressProps = {
  query: string;
};

export function SearchProgress({ query }: SearchProgressProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 2800),
      window.setTimeout(() => setStep(2), 7000),
      window.setTimeout(() => setStep(3), 12000),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const progress = Math.round(((step + 0.45) / STEPS.length) * 100);

  return (
    <div
      ref={panelRef}
      role="status"
      aria-live="polite"
      className="flex flex-col gap-5 border border-line bg-white p-6"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Ranking your request
        </p>
        <p className="text-2xl font-light tracking-tight text-ink">“{query}”</p>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="flex flex-col gap-3">
        {STEPS.map((label, index) => {
          const state = index < step ? "done" : index === step ? "active" : "waiting";

          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  state === "waiting" ? "bg-line" : "bg-accent"
                } ${state === "active" ? "animate-pulse" : ""}`}
                aria-hidden="true"
              />
              <span className={state === "waiting" ? "text-sm text-muted/70" : "text-sm text-ink"}>
                {label}
                {state === "active" ? "…" : null}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
