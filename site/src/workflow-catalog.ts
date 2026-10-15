import { byDottedNumber } from "./dotted-number.js";

// The workflow page's order: one section per LINEAGE category, each a tree of
// workflows beneath their parents.
export interface WorkflowProfile {
  description: string;
  arm: string;
  harness: string;
  status: string;
  category: string;
  version: string | null;
  parent: string | null;
  style: "test list" | "ad hoc" | null;
}

export interface CatalogEntry {
  name: string;
  profile: WorkflowProfile;
  indent: number;
}

export interface CatalogSection {
  category: string;
  title: string;
  exactCoding: boolean;
  entries: CatalogEntry[];
}

// Roots keep LINEAGE.yaml's order, which the lab arranged by hand; external
// skills were vendored side by side and have no such order, so they go by name.
// Both EXACT Coding lines explain their method on the concept page.
const CATEGORIES: { category: string; title: string; rootsByName: boolean; exactCoding: boolean }[] = [
  { category: "baselines", title: "Baselines", rootsByName: false, exactCoding: false },
  { category: "external", title: "External skills", rootsByName: true, exactCoding: false },
  { category: "exact-coding/opus", title: "EXACT Coding — Opus line", rootsByName: false, exactCoding: true },
  { category: "exact-coding/sol", title: "EXACT Coding — SOL line", rootsByName: false, exactCoding: true }];

// Deep chains stop indenting here so a profile keeps its width on a phone.
const MAX_INDENT = 3;

const HARNESS_ORDER = ["cc", "pi", "oc", "cursor"];

// Siblings go by version, then harness; a stable sort keeps LINEAGE.yaml's
// order for the rest.
function bySiblingOrder(left: WorkflowProfile, right: WorkflowProfile): number {
  return byDottedNumber(left.version ?? "0", right.version ?? "0")
    || HARNESS_ORDER.indexOf(left.harness) - HARNESS_ORDER.indexOf(right.harness);
}

type Member = [name: string, profile: WorkflowProfile];

// A workflow and, beneath it, its children's subtrees.
function subtree([name, profile]: Member, members: Member[], depth: number): CatalogEntry[] {
  const children = members.filter(([, child]) => child.parent === name)
    .sort(([, left], [, right]) => bySiblingOrder(left, right));
  return [{ name, profile, indent: Math.min(depth, MAX_INDENT) },
    ...children.flatMap(child => subtree(child, members, depth + 1))];
}

export function workflowCatalog(workflows: Record<string, WorkflowProfile>): CatalogSection[] {
  return CATEGORIES.map(({ category, title, rootsByName, exactCoding }) => {
    const members = Object.entries(workflows).filter(([, profile]) => profile.category === category);
    const names = new Set(members.map(([name]) => name));
    // A workflow whose parent is not on the page starts a tree of its own.
    const roots = members.filter(([, profile]) => !profile.parent || !names.has(profile.parent));
    if (rootsByName) roots.sort(([left], [right]) => left.localeCompare(right));
    return { category, title, exactCoding, entries: roots.flatMap(root => subtree(root, members, 0)) };
  }).filter(section => section.entries.length);
}
