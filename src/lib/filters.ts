import type { Car } from "@/lib/types";

export type FilterOption = {
  id: string;
  label: string;
  match: (car: Car) => boolean;
};

export type FilterGroup = {
  id: string;
  label: string;
  options: FilterOption[];
};

/** Within a group, any selected pill matches. Across groups, every group must match. */
export const filterGroups: FilterGroup[] = [
  {
    id: "body",
    label: "Body",
    options: [
      { id: "body:suv", label: "SUV", match: (car) => car.body === "SUV" },
      { id: "body:sedan", label: "Sedan", match: (car) => car.body === "Sedan" },
      { id: "body:hatchback", label: "Hatchback", match: (car) => car.body === "Hatchback" },
      { id: "body:minivan", label: "Minivan", match: (car) => car.body === "Minivan" },
      { id: "body:convertible", label: "Convertible", match: (car) => car.body === "Convertible" },
    ],
  },
  {
    id: "doors",
    label: "Doors",
    options: [
      { id: "doors:2", label: "2 doors", match: (car) => car.doors === 2 },
      { id: "doors:4", label: "4 doors", match: (car) => car.doors === 4 },
      { id: "doors:5", label: "5 doors", match: (car) => car.doors === 5 },
    ],
  },
  {
    id: "transmission",
    label: "Gearbox",
    options: [
      {
        id: "transmission:automatic",
        label: "Automatic",
        match: (car) => car.transmission === "Automatic",
      },
      {
        id: "transmission:manual",
        label: "Manual",
        match: (car) => car.transmission === "Manual",
      },
    ],
  },
  {
    id: "fuel",
    label: "Fuel",
    options: [
      { id: "fuel:hybrid", label: "Hybrid", match: (car) => car.fuel === "Hybrid" },
    ],
  },
];

const optionsById = new Map(
  filterGroups.flatMap((group) => group.options.map((option) => [option.id, option] as const)),
);

export function matchesFilters(car: Car, selectedIds: string[]): boolean {
  if (selectedIds.length === 0) return true;
  const selected = new Set(selectedIds);

  return filterGroups.every((group) => {
    const active = group.options.filter((option) => selected.has(option.id));
    if (active.length === 0) return true;
    return active.some((option) => option.match(car));
  });
}

export function filterCars<T extends Car>(cars: T[], selectedIds: string[]): T[] {
  return cars.filter((car) => matchesFilters(car, selectedIds));
}

export function isKnownFilter(id: string): boolean {
  return optionsById.has(id);
}

export function filterLabel(id: string): string {
  return optionsById.get(id)?.label ?? id;
}

/** Body styles present in the results, plus gearbox, fuel, and door chips shared by all of them. */
export function autoFilters(results: Car[], suggested: string[]): string[] {
  if (results.length === 0) return [];

  const bodies = filterGroups
    .find((group) => group.id === "body")!
    .options.filter((option) => results.some((car) => option.match(car)))
    .map((option) => option.id);

  const shared = filterGroups.flatMap((group) => {
    if (group.id === "body") return [];
    return group.options
      .filter((option) => results.every((car) => option.match(car)))
      .map((option) => option.id);
  });

  const chosen = new Set<string>([...bodies, ...shared]);
  for (const id of suggested) {
    if (!isKnownFilter(id) || chosen.has(id)) continue;
    if (results.every((car) => matchesFilters(car, [id]))) chosen.add(id);
  }

  const order = filterGroups.flatMap((group) => group.options.map((option) => option.id));
  return order.filter((id) => chosen.has(id));
}
