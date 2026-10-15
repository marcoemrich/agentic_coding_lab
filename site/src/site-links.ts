import { SITE_BASE } from "./site-base.js";

// The site's own pages, beneath the base path: the RQ index at its root, one page
// per RQ beneath rq/, and the workflow page with an anchor per workflow.
export const INDEX_HREF = `${SITE_BASE}/`;

export function rqPageHref(id: string): string {
  return `${SITE_BASE}/rq/${encodeURIComponent(id)}/`;
}

export function workflowEntryHref(workflow: string): string {
  return `${SITE_BASE}/workflows/#${encodeURIComponent(workflow)}`;
}
