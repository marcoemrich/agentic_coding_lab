import { quote, claim } from "./claim-office.js";

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Item = { type: string; material: string; enchantment: number; cursed: boolean };

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<
    | { op: "quote"; items: Item[] }
    | { op: "claim"; policy: number; incident: { cause: string; damages: Array<{ itemType: string; amount: number }> } }
  >;
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

function run(input: Scenario): { results: Array<Record<string, number>> } {
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  let contractIndex = 0;

  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];

    if (step.op === "quote") {
      for (const item of step.items) {
        if (!KNOWN_ITEM_TYPES.has(item.type)) {
          process.stderr.write(`Unknown item type: ${item.type}\n`);
          process.exit(1);
        }
      }

      const premium = quote(input.customer, step.items, contractIndex);
      const insuranceSum = step.items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
      policies.set(i, {
        items: step.items,
        insuranceSum,
        remainingCap: 2 * insuranceSum,
      });
      results.push({ premium });
      contractIndex++;
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) {
        process.stderr.write(`Invalid policy reference: ${step.policy}\n`);
        process.exit(1);
      }

      for (const damage of step.incident.damages) {
        if (!KNOWN_ITEM_TYPES.has(damage.itemType)) {
          process.stderr.write(`Unknown item type in damage: ${damage.itemType}\n`);
          process.exit(1);
        }
        if (damage.amount < 0) {
          process.stderr.write(`Negative damage amount: ${damage.amount}\n`);
          process.exit(1);
        }
        if (!policy.items.some((item) => item.type === damage.itemType)) {
          process.stderr.write(`Damage references item not in policy: ${damage.itemType}\n`);
          process.exit(1);
        }
      }

      // Check that damage entries don't exceed the number of insured items per type
      const insuredCounts = new Map<string, number>();
      for (const item of policy.items) {
        insuredCounts.set(item.type, (insuredCounts.get(item.type) ?? 0) + 1);
      }
      const damageCounts = new Map<string, number>();
      for (const damage of step.incident.damages) {
        damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
      }
      for (const [type, count] of damageCounts) {
        if (count > (insuredCounts.get(type) ?? 0)) {
          process.stderr.write(`More damage entries for ${type} than insured items\n`);
          process.exit(1);
        }
      }

      const result = claim(policy.items, step.incident.damages, policy.remainingCap);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  return { results };
}

let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk: string) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input) as Scenario;
    const output = run(scenario);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    process.stderr.write(`Error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  }
});
