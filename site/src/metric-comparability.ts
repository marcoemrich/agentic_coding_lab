const testListBoundaryMetrics = new Set([
  "tdd_discipline", "tdd_discipline_test_first", "tdd_discipline_closure", "test_first_rate",
  "skip_events", "cycles_total", "chain_deviations",
]);

export function crossesTestListBoundary(metric: string): boolean {
  return testListBoundaryMetrics.has(metric);
}

export function workflowStyleFor(workflow: string | undefined, styles: Record<string, "test list" | "ad hoc" | null> | undefined) {
  return workflow ? styles?.[workflow] ?? undefined : undefined;
}

export function hasMixedWorkflowStyles(styles: ("test list" | "ad hoc" | null | undefined)[]): boolean {
  return styles.includes("test list") && styles.includes("ad hoc");
}

export function isComparableForTrophy(metric: string, mixedWorkflowStyles: boolean): boolean {
  return !mixedWorkflowStyles || !crossesTestListBoundary(metric);
}

export const boundaryExplanation = "not comparable across the test-list boundary: a skipped test is compliance in a test-list workflow and a violation in an ad-hoc workflow";
