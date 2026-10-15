import type { RunCell } from "./rq-runs-summary.js";

// The index's order: RQs grouped by harness subtree, then by chapter label.
export interface IndexRq {
  id: string;
  path: string;
  question: string;
  min_replicates: number;
  cells: RunCell[];
}

const SUBTREES: [subtree: string, title: string][] = [
  ["questions-claude", "Claude Code"], ["questions-pi", "pi"], ["questions-opencode", "OpenCode"],
  ["questions-cursor-cli", "Cursor CLI"], ["questions-cross", "Across harnesses"]];

// An RQ lives at research/<subtree>/<chapter>-<slug>.
function rqLocation(rq: IndexRq): { subtree: string; chapter: string } {
  const [, subtree, directory] = rq.path.split("/");
  return { subtree, chapter: directory.split("-")[0] };
}

// The chapter label (`4.10` in `4.10-test-list-dimensions-opus-native`) orders RQs; it is no id.
function chapterParts(rq: IndexRq): number[] {
  return rqLocation(rq).chapter.split(".").map(Number);
}

function byChapter(a: IndexRq, b: IndexRq): number {
  const [left, right] = [chapterParts(a), chapterParts(b)];
  const differing = left.findIndex((part, index) => part !== right[index]);
  return differing === -1 ? left.length - right.length : left[differing] - (right[differing] ?? 0);
}

// The index groups RQs by harness subtree, in a fixed order; a subtree without RQs is left out.
export function indexGroups(rqs: IndexRq[]) {
  return SUBTREES
    .map(([subtree, title]) => ({ subtree, title, members: rqs.filter(rq => rqLocation(rq).subtree === subtree).sort(byChapter) }))
    .filter(group => group.members.length);
}
