import { metricGroup } from "./metric-group.js";

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
