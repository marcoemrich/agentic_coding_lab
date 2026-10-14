import { useState } from "react";
import { buildResultTables, isUnderReplicated, partialMetricRunCount, type ResultTableInput } from "./result-table.js";
import { DEVIATION_SEPARATOR, formatValue, type ValueCell } from "./format-value.js";
import { metricDirection, type MetricDirection } from "./metric-direction.js";
import { metricEntry } from "./metric-registry.js";
import { boundaryExplanation, crossesTestListBoundary, hasMixedWorkflowStyles, workflowStyleFor } from "./metric-comparability.js";
import { correctnessGateReason } from "./external-correctness-eligibility.js";
import { orderedRunLinks } from "./run-links.js";
import { trophyWinners } from "./trophy.js";
import { workflowEntryHref } from "./workflow-link.js";

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

function isNotRun(row: ReturnType<typeof buildResultTables>[number]["rows"][number]): boolean {
  return row.n === 0;
}

function notRunRowAppearance(row: ReturnType<typeof buildResultTables>[number]["rows"][number]) {
  return isNotRun(row) ? { className: "not-run", style: { opacity: 0.5 } } : {};
}

type ResultRow = ReturnType<typeof buildResultTables>[number]["rows"][number];

/** "82% ± 5" with the deviation dimmed: the mean is what the eye compares. */
function MeanWithDeviation({ formatted }: { formatted: string }) {
  const [mean, deviation] = formatted.split(DEVIATION_SEPARATOR);
  return <>{mean}{deviation !== undefined && <span className="sd">{DEVIATION_SEPARATOR}{deviation}</span>}</>;
}

function MetricValue({ row, metric, winner }: { row: ResultRow; metric: string; winner: boolean }) {
  if (isNotRun(row)) return "Not run";
  const value = row.values?.[metric];
  if (value == null) return <i title="not collected — not measured at the time">n/c</i>;
  if (value.value === undefined) return null;
  const cell: ValueCell = "kind" in value
    ? value : { kind: "num", n: value.n ?? row.n, value: value.value, sd: value.sd };
  const formatted = formatValue(metric, cell);
  const partialRunCount = partialMetricRunCount(value, row.n);
  return <><MeanWithDeviation formatted={formatted.main} />{winner && " 🏆"}{formatted.sub && <small>{formatted.sub}</small>}
    {partialRunCount !== undefined && <small>n={partialRunCount}/{row.n}</small>}</>;
}

function incompleteReasonLabel(reasons: NonNullable<ResultRow["incompleteRunReasons"]>): string {
  return reasons.map(({ count, reason }) => `${count} ${reason}`).join(", ");
}

/** Every factor the RQ varies, in factor order: the workflow as a link, the others as "model: opus-4-8". */
function FactorLabels({ labels, tddStyle }: { labels: ResultRow["labels"]; tddStyle: ResultRow["tddStyle"] }) {
  return Object.entries(labels).flatMap(([factor, value]) => value ? [[factor, value]] : []).map(([factor, value], index) =>
    <span key={factor}>{index > 0 && " · "}<FactorLabel factor={factor} value={value} tddStyle={tddStyle} /></span>);
}

/** The workflow links to its profile and carries its TDD style; any other factor reads "model: opus-4-8". */
function FactorLabel({ factor, value, tddStyle }: { factor: string; value: string; tddStyle: ResultRow["tddStyle"] }) {
  if (factor !== "workflow") return `${factor}: ${value}`;
  return <><a href={workflowEntryHref(value)}>{value}</a>{tddStyle && <TddStyleTag style={tddStyle} />}</>;
}

const tddStyleMeaning = { "test list": "Writes a test list up front", "ad hoc": "Picks the next test ad hoc" };

function TddStyleTag({ style }: { style: NonNullable<ResultRow["tddStyle"]> }) {
  return <span className="tag" title={tddStyleMeaning[style]}>{style}</span>;
}

/** What stands behind a row: its run count, any replicate shortfall or incomplete runs, and when the runs happened. */
function runCountLine(row: ResultRow, minReplicates: number | undefined): string {
  if (isNotRun(row)) return "0 runs";
  const shortfall = isUnderReplicated(row.n, minReplicates) ? ` of ${minReplicates}` : "";
  const incomplete = row.incompleteRunReasons ? ` (${incompleteReasonLabel(row.incompleteRunReasons)})` : "";
  const dates = row.span ? `, ${row.span}` : "";
  return `n = ${row.n}${shortfall}${incomplete}${dates}`;
}

function RowLabel({ row, minReplicates }: { row: ResultRow; minReplicates: number | undefined }) {
  const underReplicated = isUnderReplicated(row.n, minReplicates);
  return <td className={underReplicated ? "lab under-replicated" : "lab"}>
    <FactorLabels labels={row.labels} tddStyle={row.tddStyle} />
    <small>{runCountLine(row, minReplicates)}</small>
  </td>;
}

/** The metric's one-sentence explanation, followed by the test-list warning where it applies. */
function headerTooltip(metric: string): string | undefined {
  const lines = [metricEntry(metric)?.description, crossesTestListBoundary(metric) && `⚠ ${boundaryExplanation}`];
  return lines.filter(Boolean).join("\n") || undefined;
}

function MetricHeader({ metric, onSort, startsGroup }: { metric: string; onSort: (metric: string) => void; startsGroup: boolean }) {
  const warnsAcrossTestListBoundary = crossesTestListBoundary(metric);
  return <th scope="col" title={headerTooltip(metric)} className={startsGroup ? "gstart" : undefined}>
    <button type="button" onClick={() => onSort(metric)}>{metric}</button> <span className="dir">{directionDisplay[metricDirection(metric)].mark}</span>{warnsAcrossTestListBoundary && <span className="warnmark"> ⚠</span>}
  </th>;
}

type KataTable = ReturnType<typeof buildResultTables>[number];

/** The column indices where a metric group begins; a rule separates the groups. */
function groupStartColumns(table: KataTable): Set<number> {
  const starts = new Set<number>();
  table.groups.reduce((column, group) => { starts.add(column); return column + group.colSpan; }, 0);
  return starts;
}

/** Group names over their metric columns, the metric headers beneath, and one label header spanning both. */
function TableHead({ table, onSort }: { table: KataTable; onSort: (metric: string) => void }) {
  return <thead>
    <tr className="groups">
      <th scope="col" rowSpan={2} className="lab">{table.labelColumns.join(" × ")} <small>n, run dates</small></th>
      {table.groups.map(group => <th key={group.name} scope="colgroup" colSpan={group.colSpan}>{group.name}</th>)}
    </tr>
    <tr className="cols">{table.columns.map((metric, index) =>
      <MetricHeader key={metric} metric={metric} onSort={onSort} startsGroup={groupStartColumns(table).has(index)} />)}</tr>
  </thead>;
}

function RunProvenance({ rows }: { rows: ReturnType<typeof buildResultTables>[number]["rows"] }) {
  return <details className="runs">
    <summary>Runs behind this table</summary>
    <ul>{orderedRunLinks(rows).map(run =>
      <li key={run.id}><a href={run.href}>{run.id}</a>{run.exitReason && ` (${run.exitReason})`}</li>
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
      <div className="legend">{directionLegend}</div>
      {mixedStyles && <p role="note" className="banner warn">This RQ spans the test-list boundary; flagged metrics are not comparable and receive no trophies.</p>}
      <div className="scroll"><table className="res">
        <TableHead table={table} onSort={metric => setSort(previous => nextColumnSort(previous, metric))} />
        <tbody>{table.rows.map((row, index) => <tr key={index} {...notRunRowAppearance(row)}>
          <RowLabel row={row} minReplicates={input.min_replicates} />
          {table.columns.map((metric, index) => {
            const winner = trophyWinners(table.rows, metric, table.columns, mixedStyles).has(row);
            const classes = [winner && "win", groupStartColumns(table).has(index) && "gstart"].filter(Boolean).join(" ");
            return <td key={metric} title={correctnessGateReason(row, metric, table.columns)}
              className={classes || undefined}>
              <MetricValue row={row} metric={metric} winner={winner} />
            </td>;
          })}
        </tr>)}</tbody>
      </table></div>
      <RunProvenance rows={table.rows} />
    </section>)}
  </>;
}
