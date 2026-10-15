import { conceptHref, workflowEntryHref } from "./site-links.js";
import { workflowCatalog, type CatalogEntry, type WorkflowProfile } from "./workflow-catalog.js";

const HARNESS_NAMES: Record<string, string> = { cc: "Claude Code", oc: "OpenCode", pi: "pi", cursor: "Cursor" };

// What a status means, as LINEAGE.yaml's header defines it.
const STATUS_MEANINGS: Record<string, string> = {
  trunk: "base that was built upon",
  branch: "answers an RQ, was not built upon",
  superseded: "replaced by a trunk successor, stays reproducible",
  vendored: "third-party code, no own development line",
};

// A parent with a profile on this page links to it; one without is named only.
function ParentTag({ parent, onPage }: { parent: string; onPage: boolean }) {
  return <span className="tag">parent: {onPage ? <a href={workflowEntryHref(parent)}>{parent}</a> : parent}</span>;
}

function Profile({ entry, exactCoding, workflows }: { entry: CatalogEntry; exactCoding: boolean; workflows: Record<string, WorkflowProfile> }) {
  const { profile } = entry;
  return <div className="wf" id={entry.name} data-indent={entry.indent}>
    <h3>{entry.name}{[profile.arm, HARNESS_NAMES[profile.harness], profile.style]
      .map(trait => <span key={trait} className="tag trait">{trait}</span>)}
      <span className="tag trait" title={STATUS_MEANINGS[profile.status]}>{profile.status}</span>
      {profile.parent && <ParentTag parent={profile.parent} onPage={profile.parent in workflows} />}
      {exactCoding && <a className="tag" href={conceptHref("exact-coding")}>EXACT Coding</a>}</h3>
    <p>{profile.description}</p>
  </div>;
}

export function WorkflowPage({ workflows }: { workflows: Record<string, WorkflowProfile> }) {
  return <div className="wfs">
    <h1 className="q">Workflows</h1>
    {workflowCatalog(workflows).map(section => <section key={section.category} className="group">
      <h2>{section.title}</h2>
      {section.entries.map(entry => <Profile key={entry.name} entry={entry} exactCoding={section.exactCoding} workflows={workflows} />)}
    </section>)}
  </div>;
}
