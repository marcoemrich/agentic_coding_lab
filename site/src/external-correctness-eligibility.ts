import type { buildResultTables } from "./result-table.js";
import { metricGroup } from "./metric-group.js";

type Row = ReturnType<typeof buildResultTables>[number]["rows"][number];

export function correctnessGateReason(row: Row, metric: string, outcomes: readonly string[]): string | undefined {
  if (!outcomes.includes("verification_pct") || (metricGroup(metric) !== "Code quality" && metricGroup(metric) !== "Cost")) return undefined;
  const correctness = row.values?.verification_pct?.value;
  if (correctness === undefined) return "external correctness not collected";
  return correctness < 0.90 ? "below 90 % external correctness" : undefined;
}
