const REPO = "https://github.com/marcoemrich/agentic_coding_lab";

export function repoTreeHref(path: string): string {
  return `${REPO}/tree/main/${path}`;
}

export function commitHref(sha: string): string {
  return `${REPO}/commit/${sha}`;
}

export function repoBlobHref(path: string): string {
  return `${REPO}/blob/main/${path}`;
}
