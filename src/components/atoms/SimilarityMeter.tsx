type SimilarityMeterProps = {
  score: number;
};

export function SimilarityMeter({ score }: SimilarityMeterProps) {
  const width = `${Math.max(0, Math.min(100, Math.round(score * 100)))}%`;

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 w-24 overflow-hidden rounded-full bg-line"
        aria-hidden="true"
      >
        <div className="h-full rounded-full bg-accent" style={{ width }} />
      </div>
      <span className="font-mono text-xs tabular-nums text-muted">
        {score.toFixed(3)}
      </span>
    </div>
  );
}
