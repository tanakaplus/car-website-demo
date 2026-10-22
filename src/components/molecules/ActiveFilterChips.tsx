import { filterLabel } from "@/lib/filters";

type ActiveFilterChipsProps = {
  ids: string[];
  onDismiss: (id: string) => void;
};

export function ActiveFilterChips({ ids, onDismiss }: ActiveFilterChipsProps) {
  if (ids.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filters applied to these results">
      {ids.map((id) => {
        const label = filterLabel(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onDismiss(id)}
            className="inline-flex h-9 items-center gap-2 border border-accent bg-accent px-3 text-sm text-white hover:bg-accent-deep"
          >
            {label}
            <span aria-hidden="true">×</span>
            <span className="sr-only">Remove {label}</span>
          </button>
        );
      })}
    </div>
  );
}
