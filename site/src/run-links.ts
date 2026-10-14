import { repoTreeHref } from "./github-link.js";

// Run provenance under a kata table: every run of the table, linked to its
// directory on GitHub, with the exit reason of a run that is not ok.
type ListedRun = { id: string; started_at?: string; exit_reason?: string };

function githubRunDirectoryHref(runId: string): string {
  return repoTreeHref(`experiments/runs/${encodeURIComponent(runId)}`);
}

export function listedRunLinksFor(cell: { runs?: ListedRun[] }) {
  return cell.runs?.length ? cell.runs.map(run => ({
    id: run.id,
    href: githubRunDirectoryHref(run.id),
    startedAt: run.started_at ?? "",
    ...(run.exit_reason && run.exit_reason !== "ok" ? { exitReason: run.exit_reason } : {}),
  })) : undefined;
}

type RunLink = NonNullable<ReturnType<typeof listedRunLinksFor>>[number];

export function orderedRunLinks(rows: { runLinks?: RunLink[] }[]): RunLink[] {
  return rows.flatMap(row => row.runLinks ?? [])
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id));
}
