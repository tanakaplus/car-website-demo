import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DealerList } from "@/components/organisms/DealerList";
import { cars, getCar, priceFormatter } from "@/lib/cars";
import { dealersForCar } from "@/lib/dealers";

type DealersPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: DealersPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = getCar(id);
  if (!car) return { title: "Find your dealer | Halden" };
  return { title: `Find your dealer | ${car.make} ${car.model} | Halden` };
}

export default async function DealersPage({ params }: DealersPageProps) {
  const { id } = await params;
  const car = getCar(id);
  if (!car) notFound();

  const stocked = dealersForCar(car.id);

  return (
    <article>
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:px-8">
          <img
            src={car.image}
            alt=""
            className="h-44 w-full object-cover md:w-80"
          />
          <div>
            <p className="text-xs tracking-[0.22em] text-muted uppercase">
              <Link href="/#range" className="hover:text-ink">
                Models
              </Link>
              <span className="px-2">/</span>
              <Link href={`/cars/${car.id}`} className="hover:text-ink">
                {car.model}
              </Link>
            </p>
            <h1 className="mt-3 text-4xl font-light tracking-tight uppercase md:text-5xl">
              Find your dealer
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-muted">
              Showrooms with the {car.make} {car.model} available. Guide price{" "}
              {priceFormatter.format(car.price)}.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
        {stocked.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            This vehicle is not listed at a showroom right now.
          </p>
        ) : (
          <DealerList dealers={stocked} />
        )}
      </div>
    </article>
  );
}
