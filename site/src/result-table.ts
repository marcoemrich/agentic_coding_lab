import { groupedHeaders } from "./group-headers.js";
import { incompleteRunReasonsFor } from "./incomplete-run-reasons.js";
import { compareMetricMeansBestFirst } from "./metric-direction.js";
import { workflowStyleFor } from "./metric-comparability.js";
import type { ValueCell } from "./format-value.js";
import { rqVaryingLabelColumnsFor } from "./rq-factor-variation.js";
import { labelsFor } from "./row-labels.js";
import { listedRunLinksFor } from "./run-links.js";

type AggregatedMetric = ValueCell | { value?: number; n?: number; sd?: number };

export interface ResultTableInput {
  katas: string[];
  cells: { kata: string; model?: string; workflow?: string; prompt?: string; runs?: { id: string; started_at?: string; exit_reason?: string }[]; values?: Record<string, AggregatedMetric | null> }[];
  outcomes: string[];
  min_replicates?: number;
  workflowStyles?: Record<string, "test list" | "ad hoc" | null>;
  sort?: { metric: string; clicks: number };
}

export function partialMetricRunCount(value: AggregatedMetric, cellRunCount: number): number | undefined {
  return "n" in value && value.n !== undefined && value.n < cellRunCount ? value.n : undefined;
}

function runCountFor(cell: ResultTableInput["cells"][number]): number {
  return cell.runs?.length ?? 0;
}

export function isUnderReplicated(runCount: number, minReplicates: number | undefined): boolean {
  return minReplicates !== undefined && runCount > 0 && runCount < minReplicates;
}

function columnsForOutcomes(outcomes: ResultTableInput["outcomes"]): string[] {
  return outcomes.includes("cost_usd") ? outcomes : [...outcomes, "cost_usd"];
}

const ISO_YEAR_END = 4;
const ISO_MONTH_START = 5;
const ISO_DATE_END = 10;
const SORT_DIRECTIONS = 2;

function endDateForSpan(first: string, last: string): string {
  return first.slice(0, ISO_YEAR_END) === last.slice(0, ISO_YEAR_END) ? last.slice(ISO_MONTH_START) : last;
}

function formatRunDateSpan(first: string, last: string): string {
  return first === last ? first : `${first} → ${endDateForSpan(first, last)}`;
}

function runDateSpanFor(cell: ResultTableInput["cells"][number]): string | undefined {
  const dates = (cell.runs ?? []).flatMap(run => run.started_at ? [run.started_at.slice(0, ISO_DATE_END)] : []).sort();
  if (!dates.length) return undefined;
  return formatRunDateSpan(dates[0], dates.at(-1)!);
}

function resultRowFor(cell: ResultTableInput["cells"][number], labelColumns: ReturnType<typeof rqVaryingLabelColumnsFor>, styles: ResultTableInput["workflowStyles"]) {
  const span = runDateSpanFor(cell);
  const tddStyle = workflowStyleFor(cell.workflow, styles);
  const runLinks = listedRunLinksFor(cell);
  const incompleteRunReasons = incompleteRunReasonsFor(cell.runs);
  return {
    labels: labelsFor(cell, labelColumns), n: runCountFor(cell), values: cell.values,
    ...(span ? { span } : {}),
    ...(incompleteRunReasons.length ? { incompleteRunReasons } : {}),
    ...(tddStyle ? { tddStyle } : {}),
    ...(runLinks ? { runLinks } : {}),
  };
}

function compareRunParticipation(a: ResultTableInput["cells"][number], b: ResultTableInput["cells"][number]): number {
  return Number(runCountFor(a) === 0) - Number(runCountFor(b) === 0);
}

function compareMetricAvailability(a: ResultTableInput["cells"][number], b: ResultTableInput["cells"][number], metric: string): number {
  return Number(a.values?.[metric]?.value === undefined) - Number(b.values?.[metric]?.value === undefined);
}

function cellsSortedByMetric(cells: ResultTableInput["cells"], sort: NonNullable<ResultTableInput["sort"]>) {
  const direction = sort.clicks % SORT_DIRECTIONS === 0 ? -1 : 1;
  return [...cells].sort((a, b) => {
    return compareRunParticipation(a, b) || compareMetricAvailability(a, b, sort.metric) || direction * compareMetricMeansBestFirst(sort.metric, a.values?.[sort.metric]?.value ?? 0, b.values?.[sort.metric]?.value ?? 0);
  });
}

export function buildResultTables(input: ResultTableInput) {
  const columns = columnsForOutcomes(input.outcomes);
  const labelColumns = rqVaryingLabelColumnsFor(input.cells);
  return input.katas.map(kata => {
    const cells = input.cells.filter(cell => cell.kata === kata);
    const orderedCells = input.sort ? cellsSortedByMetric(cells, input.sort) : cells;
    return {
      kata, labelColumns, columns, groups: groupedHeaders(columns),
      rows: orderedCells.map(cell => resultRowFor(cell, labelColumns, input.workflowStyles)),
    };
  });
}
