export type MetricDirection = "higher" | "lower" | "informative";

const higher = new Set(["verification_pct", "tests_passing", "completed_within_budget", "tdd_discipline", "tdd_discipline_test_first", "tdd_discipline_step", "tdd_discipline_closure", "test_first_rate", "chain_opens_red", "chain_ends_green", "predictions_correct_rate"]);
const lower = new Set(["red_batch_size", "red_batch_max", "red_batch_unmeasurable", "green_batch_size", "chain_deviations", "avg_loc_per_function", "longest_function", "cognitive_max", "mccabe_max", "smell_total", "code_mass", "duration_seconds", "total_tokens", "cost_usd"]);

export function metricDirection(metric: string): MetricDirection {
  if (higher.has(metric)) return "higher";
  if (lower.has(metric)) return "lower";
  return "informative";
}

export function compareMetricMeansBestFirst(metric: string, a: number, b: number): number {
  return metricDirection(metric) === "lower" ? a - b : b - a;
}

