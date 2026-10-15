import { commitHref } from "./github-link.js";
import { INDEX_HREF } from "./site-links.js";
import { okRunIds, type RunCell } from "./rq-runs-summary.js";

export interface TopBarProps {
  current?: "questions";
  builtAt: Date;
  commit: string;
  rqs: { cells: RunCell[] }[];
}

const MINUTE_LENGTH = 16;
const SHORT_SHA_LENGTH = 7;

function dataAsOf(builtAt: Date, rqs: TopBarProps["rqs"]): string {
  const time = builtAt.toISOString().slice(0, MINUTE_LENGTH).replace("T", " ");
  const runs = new Set(rqs.flatMap(rq => okRunIds(rq.cells))).size;
  return `Data as of ${time} UTC, ${runs.toLocaleString("en-US")} runs`;
}

export function TopBar({ current, builtAt, commit, rqs }: TopBarProps) {
  return <header className="top">
    <a className="name" href={INDEX_HREF}>Agentic Coding Lab</a>
    <nav><a href={INDEX_HREF} aria-current={current === "questions" ? "page" : undefined}>Questions</a></nav>
    <span className="stamp">{dataAsOf(builtAt, rqs)}, commit <a href={commitHref(commit)}>{commit.slice(0, SHORT_SHA_LENGTH)}</a></span>
  </header>;
}
