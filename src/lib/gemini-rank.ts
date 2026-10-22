import { cars } from "@/lib/cars";
import { filterGroups, isKnownFilter } from "@/lib/filters";
import type { Car, ScoredCar } from "@/lib/types";

const FILTER_IDS = filterGroups.flatMap((group) => group.options.map((option) => option.id)).join(", ");

const MODEL = "gemini-3.5-flash-lite";

/** Fits below this are weak enough to hide. The model scores from 0 to 1. */
const MIN_FIT = 0.5;

const responseSchema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          score: { type: "number" },
          reason: { type: "string" },
        },
        required: ["id", "score", "reason"],
      },
    },
    filters: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["results", "filters"],
} as const;

type GeminiRank = {
  id: string;
  score: number;
  reason: string;
};

function catalogPrompt(query: string, pool: Car[]): string {
  const catalog = pool
    .map(
      (car) =>
        `- id: ${car.id}\n  name: ${car.make} ${car.model}\n  price: ${car.price}\n  body: ${car.body}\n  doors: ${car.doors}\n  transmission: ${car.transmission}\n  fuel: ${car.fuel}\n  description: ${car.description}`,
    )
    .join("\n");

  return `Rank these cars for the shopper's request. Judge the job the car has to do. A shared word is not a match: "off roading" is not the same as a car that only mentions roads, and a quiet commute is not the same as a quiet luxury highway sedan.

Include every car id exactly once. Score fit from 0 to 1. Use 0.5 or higher only when the car actually does the job in the request. A poor or merely related car stays below 0.5. Give each car a one-sentence reason.

Also return filters: the ids that describe the cars which can do this job. Use only these ids: ${FILTER_IDS}. Include every body style that can actually do the job. Include a gearbox, door, or fuel id only when the fitting cars share it. Do not include an id that would hide a car scored 0.5 or higher.

Request: ${query}

Cars:
${catalog}`;
}

function parseRanking(payload: unknown): { ranks: GeminiRank[]; filters: string[] } {
  const parsed = JSON.parse(readCandidateText(payload)) as { results?: unknown; filters?: unknown };
  if (!Array.isArray(parsed.results)) {
    throw new Error("Gemini returned a ranking in an unexpected shape.");
  }

  const filters = Array.isArray(parsed.filters)
    ? parsed.filters.filter((id): id is string => typeof id === "string" && isKnownFilter(id))
    : [];

  const ranks = parsed.results.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const rank = item as { id?: unknown; score?: unknown; reason?: unknown };
    if (typeof rank.id !== "string" || typeof rank.reason !== "string") return [];
    const score = typeof rank.score === "number" ? rank.score : Number(rank.score);
    if (!Number.isFinite(score)) return [];
    return [{ id: rank.id, score: Math.min(1, Math.max(0, score)), reason: rank.reason }];
  });

  return { ranks, filters };
}

function readCandidateText(payload: unknown): string {
  const candidates = (payload as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
    .candidates;
  const text = candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) {
    throw new Error("Gemini returned an empty ranking.");
  }

  return text;
}

function orderCars(ranks: GeminiRank[], pool: Car[]): ScoredCar[] {
  const byId = new Map(ranks.map((rank) => [rank.id, rank]));
  const ranked = pool
    .filter((car) => byId.has(car.id))
    .map((car) => {
      const rank = byId.get(car.id)!;
      return { ...car, score: rank.score, reason: rank.reason };
    })
    .filter((car) => car.score >= MIN_FIT)
    .sort((left, right) => right.score - left.score);

  return ranked;
}

export type RankedSearch = {
  results: ScoredCar[];
  filters: string[];
};

export async function rankCarsWithGemini(
  query: string,
  pool: Car[] = cars,
): Promise<RankedSearch> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Add GEMINI_API_KEY to .env.local, then restart the dev server.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: catalogPrompt(query, pool) }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
          responseSchema,
        },
      }),
    },
  );

  const payload = (await response.json().catch(() => null)) as
    | { error?: { message?: string } }
    | unknown;

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? payload.error?.message
        : undefined;
    throw new Error(message || "Gemini could not rank the cars.");
  }

  const ranking = parseRanking(payload);
  return { results: orderCars(ranking.ranks, pool), filters: ranking.filters };
}
