export type CliResult = {
  readonly status: number;
  readonly stdout: string;
  readonly stderr: string;
};

export function isSupportedOperation(_operation: string) {
  return false;
}

export function runClaimOfficeCliProcess(_scenarioJson: string): CliResult {
  return {
    status: 0,
    stdout: '{"results":[]}',
    stderr: "",
  };
}

export function runClaimOfficeCli(scenarioJson: string): CliResult {
  try {
    const scenario = JSON.parse(scenarioJson) as {
      steps?: Array<{
        items?: Array<{ material?: unknown; enchantment?: unknown; cursed?: unknown }>;
      }>;
    };
    const quotedItem = scenario.steps?.[0]?.items?.[0];
    if (
      typeof quotedItem?.material === "string" &&
      Number.isInteger(quotedItem.enchantment) &&
      typeof quotedItem.cursed === "boolean"
    ) {
      return { status: 0, stdout: "", stderr: "" };
    }
  } catch {
    // Invalid input retains the CLI error result.
  }

  return {
    status: 1,
    stdout: "",
    stderr: "Unknown quoted item type",
  };
}
