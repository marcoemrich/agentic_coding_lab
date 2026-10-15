// Run facts for the page header, the index and the data stamp: usable runs are
// the ok ones, as in the lab's is_replicate(); a cell reaches coverage on its ok
// runs alone.
export interface RunCell {
  runs: { id: string; started_at: string; exit_reason: string }[];
}

const ISO_DATE_LENGTH = 10;

function okRuns(cell: RunCell) {
  return cell.runs.filter(run => run.exit_reason === "ok");
}

function utcDate(timestamp: string): string {
  return new Date(timestamp).toISOString().slice(0, ISO_DATE_LENGTH);
}

export function hasAnyRun(cells: RunCell[]): boolean {
  return cells.some(cell => cell.runs.length);
}

export function okRunIds(cells: RunCell[]): string[] {
  return cells.flatMap(okRuns).map(run => run.id);
}

export function okRunCount(cells: RunCell[]): number {
  return okRunIds(cells).length;
}

function okRunSpan(cells: RunCell[]): string {
  const dates = cells.flatMap(okRuns).map(run => utcDate(run.started_at)).sort();
  return `${dates[0]} → ${dates.at(-1)}`;
}

export function coveredCells(cells: RunCell[], minReplicates: number): number {
  return cells.filter(cell => okRuns(cell).length >= minReplicates).length;
}

export function okRunsAndSpan(cells: RunCell[]): string {
  return `${okRunCount(cells)} runs, ${okRunSpan(cells)}`;
}

function okRunsPart(cells: RunCell[]): string {
  if (!okRunCount(cells)) return hasAnyRun(cells) ? "no ok runs yet" : "no runs yet";
  return okRunsAndSpan(cells);
}

export function runsSummary(cells: RunCell[], minReplicates: number): string {
  return `${okRunsPart(cells)}; ${coveredCells(cells, minReplicates)} of ${cells.length} cells at ${minReplicates} replicates`;
}
