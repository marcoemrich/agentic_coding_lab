import { metricEntry } from "./metric-registry.js";

export function isPercentageMetric(metric: string): boolean {
  return metricEntry(metric)?.scale === "fraction";
}
