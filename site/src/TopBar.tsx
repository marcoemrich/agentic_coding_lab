import { commitHref } from "./github-link.js";
import { CONCEPTS_HREF, INDEX_HREF, WORKFLOWS_HREF } from "./site-links.js";
import { okRunIds, type RunCell } from "./rq-runs-summary.js";

// The site's sections, in nav order.
const SECTIONS = [
  { page: "questions", href: INDEX_HREF, name: "Questions" },
  { page: "workflows", href: WORKFLOWS_HREF, name: "Workflows" },
  { page: "concepts", href: CONCEPTS_HREF, name: "Concepts" },
] as const;

export interface TopBarProps {
  current?: (typeof SECTIONS)[number]["page"];
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
    <nav>{SECTIONS.map(section =>
      <a key={section.page} href={section.href} aria-current={current === section.page ? "page" : undefined}>{section.name}</a>)}</nav>
    <span className="stamp">{dataAsOf(builtAt, rqs)}, commit <a href={commitHref(commit)}>{commit.slice(0, SHORT_SHA_LENGTH)}</a></span>
  </header>;
}
