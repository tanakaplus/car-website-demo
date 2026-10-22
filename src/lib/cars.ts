import carsData from "../../data/cars.json";
import type { Car } from "@/lib/types";

export const cars = carsData as Car[];

export function getCar(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}

export const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
