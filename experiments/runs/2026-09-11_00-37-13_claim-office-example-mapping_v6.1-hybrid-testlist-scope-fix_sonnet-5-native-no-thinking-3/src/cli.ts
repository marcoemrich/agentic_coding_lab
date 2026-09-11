import { calculatePremium, processClaim, KNOWN_ITEM_TYPES, type Customer, type Damage, type Item } from "./policy.js";

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

// Tracks everything needed about a policy created by a quote step: the items
// it covers plus the running counters (quote count, payout total) that later
// steps referencing the same policy need. Kept as one object per policy,
// indexed by the policy id (the creating quote step's position, per the
// schema's `policy` field), rather than as three separate parallel arrays —
// these values only ever change and get read together.
interface PolicyState {
  items: Item[];
  quoteCount: number;
  payoutTotal: number;
}

// Validates every item on a quote step before it's priced, rejecting unknown
// item types. Pairs with validateDamages below: both throw on first
// violation, before their respective operation, so the top-level catch in
// runCli can report either uniformly. (Claims referencing items not covered
// by the policy are validated separately, in processClaim/findInsuredItem —
// see policy.ts.)
const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

// Validates every damage on a claim's incident before it's processed,
// rejecting negative amounts. See validateItems above for the shared
// convention this follows.
const validateDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const countByType = <T>(entries: T[], toType: (entry: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    const type = toType(entry);
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
};

const validateDamageCounts = (items: Item[], damages: Damage[]): void => {
  const insuredCounts = countByType(items, (item) => item.type);
  const damageCounts = countByType(damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of Object.entries(damageCounts)) {
    if (damageCount > (insuredCounts[itemType] ?? 0)) {
      throw new Error(`More damages of type "${itemType}" than insured`);
    }
  }
};

export const runCli = (input: string): CliResult => {
  try {
    const scenario: Scenario = JSON.parse(input);
    const results: unknown[] = [];
    const policies: PolicyState[] = [];

    scenario.steps.forEach((step, policyId) => {
      if (step.op === "quote") {
        validateItems(step.items);
        const previousQuoteCount = policies[policyId]?.quoteCount ?? 0;
        const premium = calculatePremium(scenario.customer, step.items, previousQuoteCount);
        policies[policyId] = { items: step.items, quoteCount: previousQuoteCount + 1, payoutTotal: 0 };
        results.push({ premium });
      } else {
        validateDamages(step.incident.damages);
        const policy = policies[step.policy];
        validateDamageCounts(policy.items, step.incident.damages);
        const claimResult = processClaim(policy.items, step.incident.damages, policy.payoutTotal);
        policy.payoutTotal += claimResult.payout;
        results.push(claimResult);
      }
    });

    return { stdout: JSON.stringify({ results }), stderr: "", exitCode: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { stdout: "", stderr: message, exitCode: 1 };
  }
};

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk) => chunks.push(chunk));
  process.stdin.on("end", () => {
    const input = Buffer.concat(chunks).toString("utf-8");
    const { stdout, stderr, exitCode } = runCli(input);
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    process.exitCode = exitCode;
  });
}
