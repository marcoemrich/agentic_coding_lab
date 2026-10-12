import { metricEntry } from "./metric-registry.js";

export type MetricDirection = "higher" | "lower" | "informative";

export function metricDirection(metric: string): MetricDirection {
  return metricEntry(metric)?.direction ?? "informative";
}

export function compareMetricMeansBestFirst(metric: string, a: number, b: number): number {
  return metricDirection(metric) === "lower" ? a - b : b - a;
}
