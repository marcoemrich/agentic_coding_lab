import { metricDirection, type MetricDirection } from "./metric-direction.js";
import type { buildResultTables } from "./result-table.js";
import { correctnessGateReason } from "./external-correctness-eligibility.js";
import { isComparableForTrophy } from "./metric-comparability.js";

type Row = ReturnType<typeof buildResultTables>[number]["rows"][number];

function withinOneStandardDeviationOfBest(mean: number, sd: number, bestMean: number, bestSd: number): boolean {
  return Math.abs(mean - bestMean) <= Math.max(sd, bestSd);
}

function standardDeviationForTrophy(row: Row, metric: string): number {
  const value = row.values![metric]!;
  return "sd" in value ? value.sd ?? 0 : 0;
}

function bestRowForDirection(rows: Row[], metric: string, direction: Exclude<MetricDirection, "informative">): Row {
  const values = rows.map(row => row.values![metric]!.value!);
  const best = direction === "higher" ? Math.max(...values) : Math.min(...values);
  return rows.find(row => row.values![metric]!.value === best)!;
}

function trophyContestDirection(rows: Row[], metric: string): Exclude<MetricDirection, "informative"> | undefined {
  const direction = metricDirection(metric);
  if (direction === "informative") return undefined;
  const values = rows.map(row => row.values![metric]!.value!);
  if (!values.some(value => value !== values[0])) return undefined;
  return direction;
}

export function trophyWinners(rows: Row[], metric: string, outcomes: readonly string[] = [], mixedWorkflowStyles = false): Set<Row> {
  if (!isComparableForTrophy(metric, mixedWorkflowStyles)) return new Set();
  const measured = rows.filter(row => row.n > 0 && row.values?.[metric]?.value !== undefined);
  const direction = trophyContestDirection(measured, metric);
  if (!direction) return new Set();
  const eligible = measured.filter(row => !correctnessGateReason(row, metric, outcomes));
  if (!eligible.length) return new Set();
  const bestRow = bestRowForDirection(eligible, metric, direction);
  const best = bestRow.values![metric]!.value!;
  return new Set(eligible.filter(row => withinOneStandardDeviationOfBest(
    row.values![metric]!.value!, standardDeviationForTrophy(row, metric), best, standardDeviationForTrophy(bestRow, metric),
  )));
}
