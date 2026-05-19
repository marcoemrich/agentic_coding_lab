import { readFileSync } from "fs";
import { quote, claim, KNOWN_ITEM_TYPES, type Item } from "./claim-office.js";

const countByKey = <T>(items: T[], keyFn: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const validateClaimDamages = (
  damages: Array<{ itemType: string; amount: number }>,
  policyItems: Item[],
): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      process.stderr.write(`Negative damage amount: ${damage.amount}\n`);
      process.exit(1);
    }
    const insured = policyItems.some((item) => item.type === damage.itemType);
    if (!insured) {
      process.stderr.write(`Item type not in policy: ${damage.itemType}\n`);
      process.exit(1);
    }
  }
  const damageCounts = countByKey(damages, (d) => d.itemType);
  const insuredCounts = countByKey(policyItems, (item) => item.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      process.stderr.write(`Damage count for ${type} exceeds insured item count\n`);
      process.exit(1);
    }
  }
};

const input = JSON.parse(readFileSync(0 as unknown as string, "utf-8"));

for (const step of input.steps) {
  if (step.op === "quote") {
    for (const item of step.items) {
      if (!KNOWN_ITEM_TYPES.has(item.type)) {
        process.stderr.write(`Unknown item type: ${item.type}\n`);
        process.exit(1);
      }
    }
  }
}

const customer = { yearsAsCustomer: input.customer.yearsWithMHPCO };
const results: unknown[] = [];
let contractNumber = 1;
const policiesByStep: Record<number, Item[]> = {};
const policyPayouts: Record<number, number> = {};

for (let i = 0; i < input.steps.length; i++) {
  const step = input.steps[i];
  if (step.op === "quote") {
    const premium = quote(step.items, customer, contractNumber);
    policiesByStep[i] = step.items;
    policyPayouts[i] = 0;
    results.push({ premium });
    contractNumber++;
  } else if (step.op === "claim") {
    const policyIndex = step.policy;
    const policyItems = policiesByStep[policyIndex];
    const damages = step.incident.damages;
    validateClaimDamages(damages, policyItems);
    const previousPayouts = policyPayouts[policyIndex];
    const result = claim(policyItems, damages, previousPayouts);
    policyPayouts[policyIndex] = previousPayouts + result.payout;
    results.push({ payout: result.payout, remainingCap: result.remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }));
