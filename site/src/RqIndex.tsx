import { rqPageHref } from "./rq-link.js";
import { hasPage } from "./rq-pages.js";
import { indexGroups, type IndexRq } from "./rq-index.js";
import { coveredCells, hasAnyRun, okRunCount, okRunsAndSpan } from "./rq-runs-summary.js";

// One line of facts per RQ: coverage, ok runs and their span, as in the page header.
function entryFacts(rq: IndexRq): string {
  if (!hasAnyRun(rq.cells)) return "no data yet";
  if (!okRunCount(rq.cells)) return "no ok runs yet";
  return `${coveredCells(rq.cells, rq.min_replicates)}/${rq.cells.length} cells, ${okRunsAndSpan(rq.cells)}`;
}

function Entry({ rq }: { rq: IndexRq }) {
  return <li>
    <div className="qt">
      {hasPage(rq) ? <a href={rqPageHref(rq.id)}>{rq.question}</a> : <span className="t">{rq.question}</span>}
      <span className="sub">{rq.id}</span>
    </div>
    <div className="facts">{entryFacts(rq)}</div>
  </li>;
}

export function RqIndex({ rqs }: { rqs: IndexRq[] }) {
  return <div className="index">
    <h1 className="q">What the lab measured, one research question at a time</h1>
    <p className="intro">Each question fixes some factors, varies others, and runs coding agents against a kata until every cell has enough replicates. The tables are computed from the runs.</p>
    {indexGroups(rqs).map(group => <section key={group.subtree} className="group">
      <h2>{group.title}</h2>
      <ul className="rqs">{group.members.map(rq => <Entry key={rq.id} rq={rq} />)}</ul>
    </section>)}
  </div>;
}
