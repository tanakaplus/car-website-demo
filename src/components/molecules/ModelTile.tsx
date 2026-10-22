import Link from "next/link";
import { priceFormatter } from "@/lib/cars";
import type { Car } from "@/lib/types";

type ModelTileProps = {
  car: Car;
};

export function ModelTile({ car }: ModelTileProps) {
  return (
    <Link href={`/cars/${car.id}`} className="group block bg-white">
      <img
        src={car.image}
        alt=""
        className="aspect-video w-full object-cover"
      />
      <div className="flex items-end justify-between gap-4 border border-t-0 border-line px-4 py-5">
        <div>
          <p className="text-xs tracking-[0.16em] text-muted uppercase">{car.make}</p>
          <h2 className="mt-1 text-xl font-light group-hover:text-accent">{car.model}</h2>
        </div>
        <p className="text-sm text-muted">{priceFormatter.format(car.price)}</p>
      </div>
    </Link>
  );
}
