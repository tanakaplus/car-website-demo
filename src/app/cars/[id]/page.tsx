import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PurchasePanel } from "@/components/organisms/PurchasePanel";
import { cars, getCar, priceFormatter } from "@/lib/cars";

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = getCar(id);
  if (!car) return { title: "Vehicle | Halden" };
  return { title: `${car.make} ${car.model} | Halden` };
}

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;
  const car = getCar(id);
  if (!car) notFound();

  const specs = [
    ["Body", car.body],
    ["Doors", String(car.doors)],
    ["Drivetrain", car.drivetrain],
    ["Fuel", car.fuel],
    ["Seats", String(car.seats)],
    ["Transmission", car.transmission],
    ["Colour", car.colour],
  ];

  return (
    <article>
      <section className="relative min-h-[68vh] bg-black text-white">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
        <div className="relative z-10 flex min-h-[68vh] flex-col justify-end px-5 pb-12 md:px-8">
          <p className="text-xs tracking-[0.22em] uppercase">
            <Link href="/#range" className="hover:text-white/70">
              Models
            </Link>
            <span className="px-2 text-white/50">/</span>
            {car.make}
          </p>
          <h1 className="mt-3 max-w-3xl text-5xl font-light tracking-tight uppercase md:text-6xl">
            {car.model}
          </h1>
          <p className="mt-3 text-lg">{priceFormatter.format(car.price)}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#offer"
              className="inline-flex h-12 items-center justify-center bg-accent px-6 text-sm font-medium text-white hover:bg-accent-deep"
            >
              Request an offer
            </a>
            <a
              href="#offer"
              className="inline-flex h-12 items-center justify-center border border-ink px-6 text-sm font-medium hover:bg-black hover:text-white"
            >
              Book a test drive
            </a>
            <Link
              href={`/cars/${car.id}/dealers`}
              className="inline-flex h-12 items-center justify-center border border-ink px-6 text-sm font-medium hover:bg-black hover:text-white"
            >
              Find your dealer
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
            {specs.map(([label, value]) => (
              <div key={label} className="bg-white p-4">
                <dt className="text-xs tracking-[0.14em] text-muted uppercase">{label}</dt>
                <dd className="mt-2 text-lg font-light">{value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h2 className="text-2xl font-light">About this vehicle</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{car.description}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {car.highlights.map((highlight) => (
                <li key={highlight} className="border border-line px-3 py-2 text-sm">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PurchasePanel modelName={`${car.make} ${car.model}`} price={car.price} />
      </div>
    </article>
  );
}
