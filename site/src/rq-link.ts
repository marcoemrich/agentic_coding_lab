// The site's own pages: the RQ index at the root, one page per RQ beneath /rq/.
export const INDEX_HREF = "/";

export function rqPageHref(id: string): string {
  return `/rq/${encodeURIComponent(id)}/`;
}
