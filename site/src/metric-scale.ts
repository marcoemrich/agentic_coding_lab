const percentageMetrics = new Set([
  "verification_pct",
  "tdd_discipline",
  "tdd_discipline_test_first",
  "tdd_discipline_step",
  "tdd_discipline_closure",
  "test_first_rate",
  "mutation_score",
]);

export function isPercentageMetric(metric: string): boolean {
  return percentageMetrics.has(metric);
}
