import { useState } from "react";
import { buildResultTables, type ResultTableInput } from "./result-table.js";

type ColumnSort = { metric: string; clicks: number };

function nextColumnSort(previous: ColumnSort | undefined, metric: string): ColumnSort {
  return { metric, clicks: previous?.metric === metric ? previous.clicks + 1 : 1 };
}

function workflowEntryHref(workflow: string): string {
  return `/workflows#${encodeURIComponent(workflow)}`;
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

  return <>
    {tables.map(table => <section key={table.kata}>
      <h2>{table.kata}</h2>
      <table>
        <thead><tr>{table.columns.map(metric => <th key={metric} scope="col">
          <button type="button" onClick={() => setSort(previous => nextColumnSort(previous, metric))}>{metric}</button>
        </th>)}</tr></thead>
        <tbody>{table.rows.map((row, index) => <tr key={index}><td>{row.labels.workflow && <a href={workflowEntryHref(row.labels.workflow)}>{row.labels.workflow}</a>}</td></tr>)}</tbody>
      </table>
      <RunProvenance rows={table.rows} />
    </section>)}
  </>;
}
