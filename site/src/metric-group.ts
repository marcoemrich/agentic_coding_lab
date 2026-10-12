import { metricEntry } from "./metric-registry.js";

export type MetricGroup = "Correctness" | "TDD discipline" | "Code quality" | "Cost";

export function metricGroup(metric: string): MetricGroup {
  const group = metricEntry(metric)?.group;
  if (!group) throw new Error(`Unknown metric: ${metric}`);
  return group;
}
