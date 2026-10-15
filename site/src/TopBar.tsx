import { INDEX_HREF } from "./rq-link.js";
import { okRunIds, type RunCell } from "./rq-runs-summary.js";

export interface TopBarProps {
  current?: "questions";
  builtAt: Date;
  rqs: { cells: RunCell[] }[];
}

const MINUTE_LENGTH = 16;

function stamp(builtAt: Date, rqs: TopBarProps["rqs"]): string {
  const time = builtAt.toISOString().slice(0, MINUTE_LENGTH).replace("T", " ");
  const runs = new Set(rqs.flatMap(rq => okRunIds(rq.cells))).size;
  return `Data as of ${time} UTC, ${runs.toLocaleString("en-US")} runs`;
}

export function TopBar({ current, builtAt, rqs }: TopBarProps) {
  return <header className="top">
    <a className="name" href={INDEX_HREF}>Agentic Coding Lab</a>
    <nav><a href={INDEX_HREF} aria-current={current === "questions" ? "page" : undefined}>Questions</a></nav>
    <span className="stamp">{stamp(builtAt, rqs)}</span>
  </header>;
}
