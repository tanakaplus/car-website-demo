/**
 * Embedding worker.
 *
 * Loads Xenova/bge-small-en-v1.5 once and turns text into vectors.
 * All inference stays off the UI thread. The main thread posts
 * `{ type: "embed", requestId, texts, role }` and receives either
 * `{ type: "embeddings", requestId, embeddings }` or an error with the
 * same requestId.
 */

import { env, pipeline } from "@xenova/transformers";

// The catalog and queries are embedded in the browser. Do not look for
// model files on the Node filesystem, and reuse the browser cache so the
// ONNX weights download only once per machine.
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL = "Xenova/bge-small-en-v1.5";

// BGE retrieval models are trained with this instruction on the query only.
// Passages stay unprefixed. Without it, short queries drift toward any
// text that shares a common word like "road".
const QUERY_PREFIX = "Represent this sentence for searching relevant passages: ";

class PipelineSingleton {
  static instance = null;

  static getInstance(progressCallback) {
    if (this.instance === null) {
      this.instance = pipeline("feature-extraction", MODEL, {
        progress_callback: progressCallback,
      }).catch((error) => {
        // A failed download should not stick; the next message can retry.
        this.instance = null;
        throw error;
      });
    }

    return this.instance;
  }
}

function reportProgress(update) {
  self.postMessage({
    type: "progress",
    status: update?.status ?? "progress",
    file: update?.file,
    progress: typeof update?.progress === "number" ? update.progress : undefined,
  });
}

self.addEventListener("message", async (event) => {
  const message = event.data;
  if (!message || message.type !== "embed") return;

  const { requestId, texts, role } = message;

  if (!Array.isArray(texts) || texts.length === 0) {
    self.postMessage({
      type: "error",
      requestId,
      message: "Nothing to embed.",
    });
    return;
  }

  try {
    const extractor = await PipelineSingleton.getInstance(reportProgress);
    const prepared =
      role === "query" ? texts.map((text) => `${QUERY_PREFIX}${text}`) : texts;
    const output = await extractor(prepared, {
      pooling: "mean",
      normalize: true,
    });

    self.postMessage({
      type: "embeddings",
      requestId,
      embeddings: output.tolist(),
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      requestId,
      message: error instanceof Error ? error.message : "Embedding failed.",
    });
  }
});

// Warm the pipeline as soon as the worker starts so the first search
// spends less time waiting on the model download.
PipelineSingleton.getInstance(reportProgress)
  .then(() => {
    self.postMessage({ type: "ready" });
  })
  .catch((error) => {
    self.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : "Failed to load the embedding model.",
    });
  });
