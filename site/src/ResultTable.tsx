import { useState } from "react";
import { buildResultTables, isUnderReplicated, partialMetricRunCount, type ResultTableInput } from "./result-table.js";
import { formatValue, type ValueCell } from "./format-value.js";
import { metricDirection, type MetricDirection } from "./metric-direction.js";
import { boundaryExplanation, crossesTestListBoundary, hasMixedWorkflowStyles, workflowStyleFor } from "./metric-comparability.js";
import { correctnessGateReason } from "./external-correctness-eligibility.js";
import { trophyWinners } from "./trophy.js";

const directionDisplay: Record<MetricDirection, { mark: string; meaning: string }> = {
  higher: { mark: "↑", meaning: "higher is better" },
  lower: { mark: "↓", meaning: "lower is better" },
  informative: { mark: "○", meaning: "informative" },
};
const directionLegend = Object.values(directionDisplay).map(({ mark, meaning }) => `${mark} ${meaning}`).join(" · ");

type ColumnSort = { metric: string; clicks: number };

function nextColumnSort(previous: ColumnSort | undefined, metric: string): ColumnSort {
  return { metric, clicks: previous?.metric === metric ? previous.clicks + 1 : 1 };
}

function workflowEntryHref(workflow: string): string {
  return `/workflows#${encodeURIComponent(workflow)}`;
}

function isNotRun(row: ReturnType<typeof buildResultTables>[number]["rows"][number]): boolean {
  return row.n === 0;
}

function notRunRowAppearance(row: ReturnType<typeof buildResultTables>[number]["rows"][number]) {
  return isNotRun(row) ? { className: "not-run", style: { opacity: 0.5 } } : {};
}

type ResultRow = ReturnType<typeof buildResultTables>[number]["rows"][number];

function MetricValue({ row, metric }: { row: ResultRow; metric: string }) {
  if (isNotRun(row)) return "Not run";
  const value = row.values?.[metric];
  if (value == null) return <i title="not collected — not measured at the time">n/c</i>;
  if (value.value === undefined) return null;
  const cell: ValueCell = "kind" in value
    ? value : { kind: "num", n: value.n ?? row.n, value: value.value, sd: value.sd };
  const formatted = formatValue(metric, cell);
  const partialRunCount = partialMetricRunCount(value, row.n);
  return <>{formatted.main}{formatted.sub && <small>{formatted.sub}</small>}
    {partialRunCount !== undefined && <small>n={partialRunCount}/{row.n}</small>}</>;
}

function incompleteReasonLabel(reasons: NonNullable<ResultRow["incompleteRunReasons"]>): string {
  return reasons.map(({ count, reason }) => `${count} ${reason}`).join(", ");
}

function RowLabel({ row, minReplicates }: { row: ResultRow; minReplicates: number | undefined }) {
  const underReplicated = isUnderReplicated(row.n, minReplicates);
  return <td className={underReplicated ? "under-replicated" : undefined}
    style={underReplicated ? { backgroundColor: "rgb(255, 237, 213)" } : undefined}>
    {row.labels.workflow && <a href={workflowEntryHref(row.labels.workflow)}>{row.labels.workflow}</a>}
    {isNotRun(row) ? <small>0 runs</small> : <small>n = {row.n}{underReplicated ? ` of ${minReplicates}` : ""}{row.incompleteRunReasons ? ` (${incompleteReasonLabel(row.incompleteRunReasons)})` : ""}</small>}
  </td>;
}

function MetricHeader({ metric, onSort }: { metric: string; onSort: (metric: string) => void }) {
  const warnsAcrossTestListBoundary = crossesTestListBoundary(metric);
  return <th scope="col" title={warnsAcrossTestListBoundary ? boundaryExplanation : undefined}>
    <button type="button" onClick={() => onSort(metric)}>{metric}</button> {directionDisplay[metricDirection(metric)].mark}{warnsAcrossTestListBoundary && " ⚠"}
  </th>;
}

function RunProvenance({ rows }: { rows: ReturnType<typeof buildResultTables>[number]["rows"] }) {
  return <details>
    <summary>Runs</summary>
    <ul>{rows.flatMap(row => row.runLinks ?? []).map(run =>
      <li key={run.id}><a href={run.href}>{run.id}</a></li>
    )}</ul>
  </details>;
}

export function ResultTable({ input }: { input: ResultTableInput }) {
  const [sort, setSort] = useState<ColumnSort>();
  const tables = buildResultTables({ ...input, sort });
  const mixedStyles = hasMixedWorkflowStyles(input.cells.map(cell => workflowStyleFor(cell.workflow, input.workflowStyles)));

  return <>
    {tables.map(table => <section key={table.kata}>
      <h2>{table.kata}</h2>
      <div>{directionLegend}</div>
      {mixedStyles && <p role="note">This RQ spans the test-list boundary; flagged metrics are not comparable and receive no trophies.</p>}
      <table>
        <thead><tr>{table.columns.map(metric => <MetricHeader key={metric} metric={metric}
          onSort={metric => setSort(previous => nextColumnSort(previous, metric))} />)}</tr></thead>
        <tbody>{table.rows.map((row, index) => <tr key={index} {...notRunRowAppearance(row)}>
          <RowLabel row={row} minReplicates={input.min_replicates} />
          {table.columns.map(metric => {
            const winner = trophyWinners(table.rows, metric, table.columns, mixedStyles).has(row);
            return <td key={metric} title={correctnessGateReason(row, metric, table.columns)}
              style={winner ? { backgroundColor: "rgb(254, 243, 199)" } : undefined}>
              <MetricValue row={row} metric={metric} />{winner && " 🏆"}
            </td>;
          })}
        </tr>)}</tbody>
      </table>
      <RunProvenance rows={table.rows} />
    </section>)}
  </>;
}
