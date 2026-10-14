const REPO_TREE = "https://github.com/marcoemrich/agentic_coding_lab/tree/main";

export function repoTreeHref(path: string): string {
  return `${REPO_TREE}/${path}`;
}
