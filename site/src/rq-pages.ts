import { hasAnyRun, type RunCell } from "./rq-runs-summary.js";

// An RQ gets a page once it has runs, ok or not; without any it is "no data yet".
export function hasPage(rq: { cells: RunCell[] }): boolean {
  return hasAnyRun(rq.cells);
}

export function rqsWithPages<Rq extends { cells: RunCell[] }>(rqs: Rq[]): Rq[] {
  return rqs.filter(hasPage);
}
