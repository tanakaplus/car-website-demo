import { filterGroups } from "@/lib/filters";

type FilterPillsProps = {
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
};

export function FilterPills({ selected, onToggle, onClear }: FilterPillsProps) {
  return (
    <div className="flex flex-col gap-3" role="group" aria-label="Filter the showroom">
      {filterGroups.map((group) => (
        <div key={group.id} className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 text-[11px] tracking-[0.16em] text-muted uppercase">
            {group.label}
          </span>
          {group.options.map((option) => {
            const active = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(option.id)}
                className={`h-9 border px-3 text-sm transition ${
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-white text-ink hover:border-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ))}
      {selected.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="self-start text-sm font-medium text-accent hover:text-accent-deep"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
