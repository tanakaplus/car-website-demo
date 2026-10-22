export type Car = {
  id: string;
  make: string;
  model: string;
  price: number;
  image: string;
  body: string;
  doors: number;
  drivetrain: string;
  fuel: string;
  seats: number;
  transmission: string;
  colour: string;
  highlights: string[];
  description: string;
};

export type Dealer = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  stock: string[];
};

export type ScoredCar = Car & {
  /** Fit from 0 to 1. Higher means the car matches the request more closely. */
  score: number;
  reason?: string;
};

export type EmbedRequest = {
  type: "embed";
  requestId: string;
  texts: string[];
  /** Queries get the retrieval instruction prefix. Passages are embedded as written. */
  role: "query" | "passage";
};

export type WorkerOutbound =
  | {
      type: "progress";
      status: string;
      file?: string;
      progress?: number;
    }
  | { type: "ready" }
  | { type: "embeddings"; requestId: string; embeddings: number[][] }
  | { type: "error"; requestId?: string; message: string };
