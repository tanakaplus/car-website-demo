type ModelStatusProps = {
  phase: "booting" | "downloading" | "ready" | "error";
  detail: string;
};

const tone: Record<ModelStatusProps["phase"], string> = {
  booting: "bg-amber-500",
  downloading: "bg-amber-500",
  ready: "bg-emerald-600",
  error: "bg-red-600",
};

export function ModelStatus({ phase, detail }: ModelStatusProps) {
  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <span className={`h-2 w-2 rounded-full ${tone[phase]}`} aria-hidden="true" />
      <span>{detail}</span>
    </p>
  );
}
