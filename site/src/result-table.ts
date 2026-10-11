import { groupedHeaders } from "./group-headers.js";
import { rqVaryingLabelColumnsFor } from "./rq-factor-variation.js";
import { labelsFor } from "./row-labels.js";

export interface ResultTableInput {
  katas: string[];
  cells: { kata: string; model?: string; workflow?: string; prompt?: string; runs?: { id: string; started_at?: string }[]; values?: Record<string, { value?: number } | null> }[];
  outcomes: string[];
  workflowStyles?: Record<string, "test list" | "ad hoc" | null>;
  sort?: { metric: string; clicks: number };
}

function runCountFor(cell: ResultTableInput["cells"][number]): number {
  return cell.runs?.length ?? 0;
}

function columnsForOutcomes(outcomes: ResultTableInput["outcomes"]): string[] {
  return outcomes.includes("cost_usd") ? outcomes : [...outcomes, "cost_usd"];
}

function endDateForSpan(first: string, last: string): string {
  return first.slice(0, 4) === last.slice(0, 4) ? last.slice(5) : last;
}

function formatRunDateSpan(first: string, last: string): string {
  return first === last ? first : `${first} → ${endDateForSpan(first, last)}`;
}

function runDateSpanFor(cell: ResultTableInput["cells"][number]): string | undefined {
  const dates = (cell.runs ?? []).flatMap(run => run.started_at ? [run.started_at.slice(0, 10)] : []).sort();
  if (!dates.length) return undefined;
  return formatRunDateSpan(dates[0], dates.at(-1)!);
}

function knownWorkflowTddStyle(workflow: string | undefined, styles: ResultTableInput["workflowStyles"]) {
  return workflow ? styles?.[workflow] ?? undefined : undefined;
}

function githubRunDirectoryHref(runId: string): string {
  return `https://github.com/marcoemrich/agentic_coding_lab/tree/main/experiments/runs/${encodeURIComponent(runId)}`;
}

function listedRunLinksFor(cell: ResultTableInput["cells"][number]) {
  return cell.runs?.length ? cell.runs.map(run => ({
    id: run.id,
    href: githubRunDirectoryHref(run.id),
  })) : undefined;
}

function resultRowFor(cell: ResultTableInput["cells"][number], labelColumns: ReturnType<typeof rqVaryingLabelColumnsFor>, styles: ResultTableInput["workflowStyles"]) {
  const span = runDateSpanFor(cell);
  const tddStyle = knownWorkflowTddStyle(cell.workflow, styles);
  const runLinks = listedRunLinksFor(cell);
  return {
    labels: labelsFor(cell, labelColumns), n: runCountFor(cell),
    ...(span ? { span } : {}),
    ...(tddStyle ? { tddStyle } : {}),
    ...(runLinks ? { runLinks } : {}),
  };
}

function lowerIsBetter(metric: string): boolean {
  return metric === "cognitive_max";
}

function compareBestFirstValues(a: ResultTableInput["cells"][number], b: ResultTableInput["cells"][number], metric: string): number {
  const higherFirst = (b.values?.[metric]?.value ?? 0) - (a.values?.[metric]?.value ?? 0);
  return lowerIsBetter(metric) ? -higherFirst : higherFirst;
}

function compareRunParticipation(a: ResultTableInput["cells"][number], b: ResultTableInput["cells"][number]): number {
  return Number(runCountFor(a) === 0) - Number(runCountFor(b) === 0);
}

function compareMetricAvailability(a: ResultTableInput["cells"][number], b: ResultTableInput["cells"][number], metric: string): number {
  return Number(a.values?.[metric]?.value === undefined) - Number(b.values?.[metric]?.value === undefined);
}

function cellsSortedByMetric(cells: ResultTableInput["cells"], sort: NonNullable<ResultTableInput["sort"]>) {
  const direction = sort.clicks % 2 === 0 ? -1 : 1;
  return [...cells].sort((a, b) => {
    return compareRunParticipation(a, b) || compareMetricAvailability(a, b, sort.metric) || direction * compareBestFirstValues(a, b, sort.metric);
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
