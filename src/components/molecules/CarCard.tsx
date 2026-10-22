import Link from "next/link";
import { SimilarityMeter } from "@/components/atoms/SimilarityMeter";
import { priceFormatter } from "@/lib/cars";
import type { ScoredCar } from "@/lib/types";

type CarCardProps = {
  car: ScoredCar;
  rank: number;
};

export function CarCard({ car, rank }: CarCardProps) {
  return (
    <article className="border border-line bg-white">
      <Link href={`/cars/${car.id}`} className="block">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="aspect-video w-full object-cover"
        />
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                Match {String(rank).padStart(2, "0")}
              </p>
              <h2 className="mt-1 text-2xl font-light">
                {car.make} {car.model}
              </h2>
            </div>
            <p className="text-sm">{priceFormatter.format(car.price)}</p>
          </div>
          <SimilarityMeter score={car.score} />
          {car.reason ? <p className="text-sm leading-6 text-ink">{car.reason}</p> : null}
          <span className="text-sm font-medium text-accent">View vehicle</span>
        </div>
      </Link>
    </article>
  );
}
