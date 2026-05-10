// cli.ts
import {
  quote,
  claim,
  insuranceSum,
  isKnownItemType,
  type Item,
  type Damage,
} from "./claim-office.js";

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

type StepResult = { premium: number } | { payout: number; remainingCap: number };

const CAP_MULTIPLIER = 2;

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      fail(`Unknown item type: ${item.type}`);
    }
  }
}

function processQuote(
  step: QuoteStep,
  customerYears: number,
  previousContracts: number,
  policies: Policy[],
): StepResult {
  validateItems(step.items);
  const premium = quote({
    items: step.items,
    customerYears,
    previousContracts,
  });
  policies.push({
    items: step.items,
    remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
  });
  return { premium };
}

function countByType<T>(items: T[], getType: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = getType(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function validateDamages(damages: Damage[], policyItems: Item[]): void {
  const negative = damages.find((d) => d.amount < 0);
  if (negative !== undefined) {
    fail(`Damage amount cannot be negative: ${negative.amount}`);
  }
  const damageCounts = countByType(damages, (d) => d.itemType);
  const policyCounts = countByType(policyItems, (i) => i.type);
  for (const [itemType, count] of damageCounts) {
    if (count > (policyCounts.get(itemType) ?? 0)) {
      fail(`More damages of type ${itemType} than policy covers`);
    }
  }
}

function processClaim(step: ClaimStep, policies: Policy[]): StepResult {
  const policy = policies[step.policy];
  validateDamages(step.incident.damages, policy.items);
  const result = claim({
    items: policy.items,
    remainingCap: policy.remainingCap,
    damages: step.incident.damages,
  });
  policy.remainingCap = result.remainingCap;
  return result;
}

async function main() {
  const raw = await readStdin();
  const scenario: Scenario = JSON.parse(raw);

  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let previousContracts = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push(
        processQuote(step, scenario.customer.yearsWithMHPCO, previousContracts, policies),
      );
      previousContracts += 1;
    } else {
      results.push(processClaim(step, policies));
    }
  }

  console.log(JSON.stringify({ results }));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
