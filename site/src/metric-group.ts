export type MetricGroup = "Correctness" | "TDD discipline" | "Code quality" | "Cost";

const metricsByGroup: Record<MetricGroup, string[]> = {
  Correctness: ["verification_pct", "tests_passing", "completed_within_budget"],
  "TDD discipline": [
    "tdd_discipline", "tdd_discipline_test_first", "tdd_discipline_step", "tdd_discipline_closure", "test_first_rate",
    "red_batch_size", "red_batch_max", "red_batch_unmeasurable", "green_batch_size", "chain_suite_runs", "cycles_total",
    "cycles_closed", "refactor_events", "skip_events", "refactor_per_cycle", "green_attempts", "chain_deviations",
    "chain_opens_red", "chain_ends_green", "predictions_correct_rate",
  ],
  "Code quality": ["avg_loc_per_function", "longest_function", "cognitive_max", "mccabe_max", "smell_total", "code_mass"],
  Cost: ["duration_seconds", "total_tokens", "cost_usd"],
};

export function metricGroup(metric: string): MetricGroup {
  for (const [name, metrics] of Object.entries(metricsByGroup) as [MetricGroup, string[]][]) {
    if (metrics.includes(metric)) return name;
  }
  throw new Error(`Unknown metric: ${metric}`);
}
