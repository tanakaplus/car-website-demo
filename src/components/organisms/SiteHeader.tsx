import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-black/85 px-5 text-white backdrop-blur md:px-8">
      <Link href="/" className="text-sm font-semibold tracking-[0.28em] uppercase">
        Halden
      </Link>
      <nav className="flex items-center gap-6 text-xs tracking-[0.16em] uppercase">
        <Link href="/#range" className="hover:text-white/70">
          Models
        </Link>
        <Link href="/#find" className="hover:text-white/70">
          Find a car
        </Link>
      </nav>
    </header>
  );
}
