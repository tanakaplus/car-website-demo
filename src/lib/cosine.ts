/**
 * Cosine similarity between two equal-length embedding vectors.
 * With `normalize: true` on the feature-extraction pipeline this is the
 * same value as the dot product, but the full formula stays correct if a
 * vector is not perfectly unit-length.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < length; index += 1) {
    const left = a[index] ?? 0;
    const right = b[index] ?? 0;
    dot += left * right;
    normA += left * left;
    normB += right * right;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dot / denominator;
}
