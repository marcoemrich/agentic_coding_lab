import { SITE_BASE } from "./site-base.js";

// The site's own pages, beneath the base path: the RQ index at its root, one page
// per RQ beneath rq/, the workflow page with an anchor per workflow, and the
// concept page with an anchor per concept.
export const INDEX_HREF = `${SITE_BASE}/`;
export const WORKFLOWS_HREF = `${SITE_BASE}/workflows/`;
export const CONCEPTS_HREF = `${SITE_BASE}/concepts/`;

export function rqPageHref(id: string): string {
  return `${SITE_BASE}/rq/${encodeURIComponent(id)}/`;
}

export function workflowEntryHref(workflow: string): string {
  return `${WORKFLOWS_HREF}#${encodeURIComponent(workflow)}`;
}

export function conceptHref(concept: "predictive-tdd" | "exact-coding"): string {
  return `${CONCEPTS_HREF}#${concept}`;
}
