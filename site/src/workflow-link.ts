export function workflowEntryHref(workflow: string): string {
  return `/workflows/#${encodeURIComponent(workflow)}`;
}
