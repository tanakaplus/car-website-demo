import dealersData from "../../data/dealers.json";
import type { Dealer } from "@/lib/types";

export const dealers = dealersData as Dealer[];

export function dealersForCar(carId: string): Dealer[] {
  return dealers.filter((dealer) => dealer.stock.includes(carId));
}

export function distanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number {
  const earthKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const startLat = toRadians(from.lat);
  const endLat = toRadians(to.lat);
  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

  return earthKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(km)} km away`;
}
