import type { FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { TextInput } from "@/components/atoms/TextInput";

type SearchBarProps = {
  query: string;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SearchBar({
  query,
  isSearching,
  onQueryChange,
  onSubmit,
}: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor="intent-query">
        Describe the car you want
      </label>
      <TextInput
        id="intent-query"
        name="query"
        value={query}
        placeholder='Try "a car for off-road camping"'
        autoComplete="off"
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <Button type="submit" disabled={isSearching || query.trim().length === 0}>
        {isSearching ? "Ranking…" : "Search"}
      </Button>
    </form>
  );
}
