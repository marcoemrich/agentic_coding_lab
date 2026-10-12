const incompleteReasons = ["timeout", "rate-limited", "transient-api-error", "quota-exhausted", "pi-retries-exhausted"];

export function incompleteRunReasonsFor(runs: { exit_reason?: string }[] | undefined): { reason: string; count: number }[] {
  return incompleteReasons.flatMap(reason => {
    const count = runs?.filter(run => run.exit_reason === reason).length ?? 0;
    return count ? [{ reason, count }] : [];
  });
}
