// The header's Runs line: usable runs are the ok ones, as in the lab's
// is_replicate(); a cell reaches coverage on its ok runs alone.
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

function runSpan(dates: string[]): string {
  const [first, last] = [dates[0], dates.at(-1)];
  return first === last ? first : `${first} → ${last}`;
}

function okRunsPart(cells: RunCell[]): string {
  const runs = cells.flatMap(okRuns);
  if (!runs.length) return cells.some(cell => cell.runs.length) ? "no ok runs yet" : "no runs yet";
  const dates = runs.map(run => utcDate(run.started_at)).sort();
  return `${runs.length} ${runs.length === 1 ? "run" : "runs"}, ${runSpan(dates)}`;
}

export function runsSummary(cells: RunCell[], minReplicates: number): string {
  const covered = cells.filter(cell => okRuns(cell).length >= minReplicates).length;
  return `${okRunsPart(cells)}; ${covered} of ${cells.length} cells at ${minReplicates} replicates`;
}
