"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { TextInput } from "@/components/atoms/TextInput";
import { priceFormatter } from "@/lib/cars";

type PurchasePanelProps = {
  modelName: string;
  price: number;
};

export function PurchasePanel({ modelName, price }: PurchasePanelProps) {
  const [submitted, setSubmitted] = useState<"offer" | "drive" | null>(null);
  const deposit = Math.round(price * 0.1);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitted(data.get("intent") === "drive" ? "drive" : "offer");
  }

  if (submitted) {
    return (
      <div className="border border-line bg-white p-6">
        <p className="text-xs tracking-[0.18em] text-accent uppercase">Request received</p>
        <h2 className="mt-3 text-2xl font-light">
          {submitted === "drive" ? "Test drive requested" : "Offer request received"}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
          A product specialist will contact you about the {modelName}. Nothing has been
          charged. The cash price remains {priceFormatter.format(price)}.
        </p>
      </div>
    );
  }

  return (
    <form id="offer" onSubmit={handleSubmit} className="border border-line bg-white p-6">
      <p className="text-xs tracking-[0.18em] text-accent uppercase">Ready to purchase</p>
      <h2 className="mt-3 text-2xl font-light">Request an offer</h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs tracking-[0.14em] text-muted uppercase">Cash price</dt>
          <dd className="mt-1 text-xl">{priceFormatter.format(price)}</dd>
        </div>
        <div>
          <dt className="text-xs tracking-[0.14em] text-muted uppercase">Suggested deposit</dt>
          <dd className="mt-1 text-xl">{priceFormatter.format(deposit)}</dd>
        </div>
      </dl>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Name
          <TextInput name="name" required autoComplete="name" className="mt-1" />
        </label>
        <label className="text-sm">
          Email
          <TextInput name="email" type="email" required autoComplete="email" className="mt-1" />
        </label>
        <label className="text-sm sm:col-span-2">
          Phone
          <TextInput name="phone" type="tel" required autoComplete="tel" className="mt-1" />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" name="intent" value="offer">
          Request an offer
        </Button>
        <Button type="submit" name="intent" value="drive" variant="outline">
          Book a test drive
        </Button>
      </div>
    </form>
  );
}
