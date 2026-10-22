import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = "", ...props }: TextInputProps) {
  return (
    <input
      className={`h-12 w-full border border-line bg-white px-4 text-base text-ink outline-none transition placeholder:text-muted focus:border-accent ${className}`}
      {...props}
    />
  );
}
