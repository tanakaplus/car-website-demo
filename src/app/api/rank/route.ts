import { cars } from "@/lib/cars";
import { filterCars, isKnownFilter } from "@/lib/filters";
import { rankCarsWithGemini } from "@/lib/gemini-rank";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { query?: unknown; filters?: unknown }
    | null;
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const filters = Array.isArray(body?.filters)
    ? body.filters.filter((id): id is string => typeof id === "string" && isKnownFilter(id))
    : [];

  if (!query) {
    return Response.json({ error: "Describe the car you want." }, { status: 400 });
  }

  const pool = filterCars(cars, filters);
  if (pool.length === 0) {
    return Response.json({ results: [], filters: [] });
  }

  try {
    const ranked = await rankCarsWithGemini(query, pool);
    return Response.json(ranked);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ranking failed.";
    const status = message.includes("GEMINI_API_KEY") ? 503 : 502;
    return Response.json({ error: message }, { status });
  }
}
