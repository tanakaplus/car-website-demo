import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function Button({
  className = "",
  variant = "solid",
  children,
  ...props
}: ButtonProps) {
  const look =
    variant === "outline"
      ? "border border-ink bg-white text-ink hover:bg-black hover:text-white"
      : "bg-accent text-accent-ink hover:bg-accent-deep";

  return (
    <button
      className={`inline-flex h-12 shrink-0 items-center justify-center px-6 text-sm font-medium tracking-wide transition disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${look} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
