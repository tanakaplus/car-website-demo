import type { Car } from "@/lib/types";

/**
 * Short chunks for retrieval. A single vector of the whole description
 * averages every sentence together, so a query like "off roading car"
 * can lose to a shorter paragraph that merely mentions roads. Scoring the
 * closest chunk keeps the name and the relevant sentence intact.
 */
export function passagesFor(car: Car): string[] {
  const sentences = car.description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  return [`${car.make} ${car.model}`, ...sentences];
}
