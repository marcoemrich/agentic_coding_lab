import { repoBlobHref } from "./github-link.js";
import { rqPageHref } from "./site-links.js";

// Where a link in an RQ's findings.md points on the site. Relative links are
// resolved against the RQ's directory: another RQ's findings.md or README.md
// becomes that RQ's page, any other file its GitHub view; anchors and links
// to other sites stay as written.
export interface FindingsContext {
  path: string;
  pages: Record<string, string>;
}

// Only a vehicle for resolving relative paths with URL; it never reaches a page.
const REPO_ROOT = "https://repo.invalid";

export function findingsLinkHref(href: string, context: FindingsContext): string {
  if (href.startsWith("#")) return href;
  const target = new URL(href, `${REPO_ROOT}/${context.path}/`);
  if (target.origin !== REPO_ROOT) return href;
  const repoPath = target.pathname.slice(1);
  const page = context.pages[repoPath.slice(0, repoPath.lastIndexOf("/"))];
  if (page && repoPath.endsWith("/findings.md")) return `${rqPageHref(page)}${target.hash || "#findings"}`;
  if (page && repoPath.endsWith("/README.md")) return rqPageHref(page);
  return repoBlobHref(repoPath) + target.hash;
}
