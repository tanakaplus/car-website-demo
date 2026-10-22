const exampleQueries = [
  "Spacious SUV under $40k",
  "Commuter car with high fuel efficiency",
  "Reliable family hauler for school runs",
  "Quiet luxury sedan for long highway trips",
  "Lightweight convertible for weekend drives",
];

type QueryChipsProps = {
  disabled: boolean;
  onSelect: (query: string) => void;
};

export function QueryChips({ disabled, onSelect }: QueryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Example searches">
      {exampleQueries.map((query) => (
        <button
          key={query}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(query)}
          className="border border-line bg-white px-3 py-2 text-left text-sm text-ink transition hover:border-ink disabled:cursor-not-allowed disabled:text-muted"
        >
          {query}
        </button>
      ))}
    </div>
  );
}
