// Findings are collapsed; an address pointing into them opens the section.
export const FINDINGS_ID = "findings";

export function openFindingsFor(hash: string, document: Document): void {
  const section = document.getElementById(FINDINGS_ID);
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (section instanceof HTMLDetailsElement && target && section.contains(target)) section.open = true;
}
