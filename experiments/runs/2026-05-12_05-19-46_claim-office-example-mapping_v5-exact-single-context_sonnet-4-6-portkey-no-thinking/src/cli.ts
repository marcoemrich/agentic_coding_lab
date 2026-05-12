import { quote, claim } from "./claim-office.js";
import type { Item, Policy } from "./claim-office.js";

type Customer = { yearsWithMHPCO: number; contractCount?: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const VALID_TYPES = new Set(Object.keys(INSURANCE_VALUES));

function buildPolicy(items: Item[], contractCount: number): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = Buffer.concat(chunks).toString("utf-8");

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input);
  } catch {
    process.stderr.write("Error: invalid JSON input\n");
    process.exit(1);
  }

  const { customer, steps } = scenario;
  const contractCount = customer.contractCount ?? 0;
  const results: unknown[] = [];
  const policies: Policy[] = [];

  for (const step of steps) {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!VALID_TYPES.has(item.type)) {
          process.stderr.write(`Error: unknown item type "${item.type}"\n`);
          process.exit(1);
        }
      }
      const premium = quote({
        items: step.items,
        customer: { yearsWithMHPCO: customer.yearsWithMHPCO, contractCount },
      });
      const policy = buildPolicy(step.items, contractCount);
      policies.push(policy);
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        process.stderr.write(`Error: no policy at index ${step.policy}\n`);
        process.exit(1);
      }
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          process.stderr.write(`Error: damage amount cannot be negative\n`);
          process.exit(1);
        }
        if (!VALID_TYPES.has(damage.itemType)) {
          process.stderr.write(`Error: unknown item type "${damage.itemType}"\n`);
          process.exit(1);
        }
        const itemCount = policy.items.filter(i => i.type === damage.itemType).length;
        const damageCount = step.incident.damages.filter(d => d.itemType === damage.itemType).length;
        if (damageCount > itemCount) {
          process.stderr.write(`Error: more damages for "${damage.itemType}" than insured items\n`);
          process.exit(1);
        }
      }
      const result = claim({ policy, incident: step.incident });
      policies[step.policy] = { ...policy, remainingCap: result.remainingCap };
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main().catch(err => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
});
