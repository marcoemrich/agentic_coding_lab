import { metricGroup } from "./metric-group.js";

/** Frontmatter order within each group; groups in the order they first appear, so each gets one header. */
export function gatheredByGroup(columns: string[]): string[] {
  const groupOrder = [...new Set(columns.map(metricGroup))];
  return [...columns].sort((a, b) => groupOrder.indexOf(metricGroup(a)) - groupOrder.indexOf(metricGroup(b)));
}

export function groupedHeaders(outcomes: string[]) {
  const groups: { name: string; colSpan: number }[] = [];
  for (const metric of outcomes) {
    const name = metricGroup(metric);
    const last = groups.at(-1);
    if (last?.name === name) last.colSpan++;
    else groups.push({ name, colSpan: 1 });
  }
  return groups;
}
