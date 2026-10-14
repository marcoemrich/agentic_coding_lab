import registry from "../../experiments/metrics-registry.yaml";
import type { MetricDirection } from "./metric-direction.js";
import type { MetricGroup } from "./metric-group.js";

export interface MetricEntry {
  group?: MetricGroup;
  direction: MetricDirection;
  scale?: "fraction";
  not_comparable_across?: "test-list-boundary"[];
  description?: string;
}

const entries = registry as Record<string, MetricEntry>;

export function metricEntry(metric: string): MetricEntry | undefined {
  return entries[metric];
}
