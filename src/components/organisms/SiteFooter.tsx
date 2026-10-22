import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-black px-5 py-14 text-white md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase">Showroom</p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Halden Motor House
            <br />
            18 Grayston Drive, Sandton
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.22em] uppercase">Buy</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/#find" className="hover:text-white">
                Find a car
              </Link>
            </li>
            <li>
              <Link href="/#range" className="hover:text-white">
                All models
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.22em] uppercase">Visit</p>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Monday to Friday, 08:00–17:30
            <br />
            Saturday, 09:00–13:00
          </p>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-white/50">
        © 2026 Halden Motor House. Guide prices exclude on-road costs.
      </p>
    </footer>
  );
}
