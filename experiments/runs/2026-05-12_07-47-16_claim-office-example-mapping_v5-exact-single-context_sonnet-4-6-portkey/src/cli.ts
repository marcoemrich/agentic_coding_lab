import { createInterface } from "node:readline";
import { quote, createPolicy, claim, type Customer, type Item, type Damage, type Policy } from "./claim-office.js";

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion"]);
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const readStdin = (): Promise<string> => {
  const rl = createInterface({ input: process.stdin, terminal: false });
  const lines: string[] = [];
  return new Promise((resolve) => {
    rl.on("line", (line) => lines.push(line));
    rl.on("close", () => resolve(lines.join("\n")));
  });
};

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const die = (message: string): never => {
  process.stderr.write(message + "\n");
  process.exit(1);
};

const effectiveDamageAmount = (damage: Damage, item: Item): number => {
  if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const run = async () => {
  const input = await readStdin();

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch {
    die("Invalid JSON input");
  }

  const { customer, steps } = scenario;
  const results: unknown[] = [];
  const policies: (Policy | null)[] = new Array(steps.length).fill(null);
  let contractNumber = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step.op === "quote") {
      for (const item of step.items) {
        if (!KNOWN_ITEM_TYPES.has(item.type)) {
          die(`Unknown item type: ${item.type}`);
        }
      }
      contractNumber++;
      const premium = quote(customer, step.items, contractNumber);
      policies[i] = createPolicy(step.items);
      results.push({ premium });

    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        die(`No policy at step ${step.policy}`);
      }

      const damages = step.incident.damages;

      for (const damage of damages) {
        if (damage.amount < 0) {
          die(`Negative damage amount: ${damage.amount}`);
        }
        if (!KNOWN_ITEM_TYPES.has(damage.itemType)) {
          die(`Unknown item type in damage: ${damage.itemType}`);
        }
      }

      const insuredCountByType: Record<string, number> = {};
      for (const item of policy.items) {
        insuredCountByType[item.type] = (insuredCountByType[item.type] ?? 0) + 1;
      }

      const damageCountByType: Record<string, number> = {};
      for (const damage of damages) {
        damageCountByType[damage.itemType] = (damageCountByType[damage.itemType] ?? 0) + 1;
        const insured = insuredCountByType[damage.itemType] ?? 0;
        if (insured === 0 || damageCountByType[damage.itemType] > insured) {
          die(`Item type ${damage.itemType} is not covered by the policy`);
        }
      }

      const usedItemIndices = new Set<number>();
      const adjustedDamages: Damage[] = damages.map((damage) => {
        const matchingIndex = policy.items.findIndex(
          (item, idx) => item.type === damage.itemType && !usedItemIndices.has(idx)
        );
        usedItemIndices.add(matchingIndex);
        const item = policy.items[matchingIndex];
        return { ...damage, amount: effectiveDamageAmount(damage, item) };
      });

      const { payout, remainingCap } = claim(policy, adjustedDamages);
      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
};

run().catch((e: Error) => {
  process.stderr.write(`Error: ${e.message}\n`);
  process.exit(1);
});
