import { HomeShowroom } from "@/components/organisms/HomeShowroom";

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[72vh] bg-black text-white">
        <img
          src="/cars/e-class.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
        <div className="relative z-10 flex min-h-[72vh] flex-col justify-end px-5 pb-28 md:px-8">
          <p className="text-xs tracking-[0.28em] uppercase">New vehicles</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-light tracking-tight uppercase md:text-7xl">
            The right car for the way you drive.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
            Tell us the job. We match it against the cars on the floor, then you
            open the one you want.
          </p>
        </div>
      </section>

      <HomeShowroom />
    </div>
  );
}
