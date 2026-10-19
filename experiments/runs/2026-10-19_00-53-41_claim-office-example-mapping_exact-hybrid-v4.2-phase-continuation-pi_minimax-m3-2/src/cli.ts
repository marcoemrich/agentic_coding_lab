import { computePremium } from "./premium.js";
import { createPolicy, processClaim } from "./claim.js";
import type { ClaimStep, Damage, ItemType, Policy, QuoteStep, Result, Scenario } from "./types.js";

const VALID_ITEM_TYPES: ReadonlySet<ItemType> = new Set<ItemType>([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliError";
  }
}

function countByType(types: Iterable<ItemType>): Map<ItemType, number> {
  const counts = new Map<ItemType, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
}

function validateItemTypes(items: { type: ItemType }[]): void {
  for (const item of items) {
    if (!VALID_ITEM_TYPES.has(item.type)) {
      throw new CliError(`Unknown item type: ${item.type}`);
    }
  }
}

function validateDamages(damages: Damage[], policy: Policy): void {
  for (const damage of damages) {
    if (!VALID_ITEM_TYPES.has(damage.itemType)) {
      throw new CliError(`Unknown item type in damages: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new CliError(`Negative damage amount: ${damage.amount}`);
    }
  }
  const policyItemCounts = countByType(policy.items.map((i) => i.type));
  const damageCounts = countByType(damages.map((d) => d.itemType));
  for (const [type, count] of damageCounts) {
    if ((policyItemCounts.get(type) ?? 0) < count) {
      throw new CliError(
        `Damage count (${count}) exceeds policy item count (${policyItemCounts.get(type) ?? 0}) for type ${type}`,
      );
    }
  }
}

function handleQuoteStep(
  step: QuoteStep,
  scenario: Scenario,
  quoteCount: number,
): { policy: Policy; result: Result } {
  validateItemTypes(step.items);
  const premium = computePremium({
    items: step.items,
    yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
    isFirstContract: quoteCount === 0,
  });
  const policy = createPolicy(step.items);
  return { policy, result: { premium } };
}

function handleClaimStep(step: ClaimStep, policies: Policy[]): Result {
  const policy = policies[step.policy];
  if (!policy) {
    throw new CliError(`Invalid policy index: ${step.policy}`);
  }
  validateDamages(step.incident.damages, policy);
  const claimResult = processClaim(policy, step.incident.damages);
  policy.remainingCap = claimResult.remainingCap;
  return claimResult;
}

export async function runScenario(input: string): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  let stdout = "";
  let stderr = "";
  let exitCode = 0;

  try {
    const scenario = JSON.parse(input) as Scenario;
    const results: Result[] = [];
    const policies: Policy[] = [];
    let quoteCount = 0;

    for (const step of scenario.steps) {
      if (step.op === "quote") {
        const { policy, result } = handleQuoteStep(step, scenario, quoteCount);
        quoteCount++;
        policies.push(policy);
        results.push(result);
      } else {
        results.push(handleClaimStep(step, policies));
      }
    }

    stdout = JSON.stringify({ results });
  } catch (err) {
    stderr = err instanceof Error ? err.message : String(err);
    exitCode = 1;
  }

  return { stdout, stderr, exitCode };
}

// Allow direct invocation as CLI
async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const input = Buffer.concat(chunks).toString("utf8");
  const { stdout, stderr, exitCode } = await runScenario(input);
  if (stderr) process.stderr.write(stderr + "\n");
  if (stdout) process.stdout.write(stdout + "\n");
  process.exit(exitCode);
}

// Run main if executed directly (not when imported for testing)
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    process.stderr.write(String(err) + "\n");
    process.exit(1);
  });
}
