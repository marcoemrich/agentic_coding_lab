// CLI: reads JSON scenario from stdin, writes {results:[...]} to stdout.
import { readFileSync } from "node:fs";
import { quote, claim } from "./claim-office.js";

const scenario = JSON.parse(readFileSync(0, "utf-8"));
const yearsWithMHPCO = scenario.customer.yearsWithMHPCO;

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function assertKnownItemTypes(items: { type: string }[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      fail(`Unknown item type: ${item.type}`);
    }
  }
}

function assertDamageAmountsNonNegative(
  damages: { amount: number }[],
): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      fail(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function assertDamagesAreInsured(
  items: { type: string }[],
  damages: { itemType: string }[],
): void {
  const insuredTypes = new Set(items.map((item) => item.type));
  for (const damage of damages) {
    if (!insuredTypes.has(damage.itemType)) {
      fail(`Damaged item not in policy: ${damage.itemType}`);
    }
  }
}

function countByKey<T>(values: T[], keyOf: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function assertNotMoreDamagesThanInsured(
  items: { type: string }[],
  damages: { itemType: string }[],
): void {
  const insuredCountByType = countByKey(items, (item) => item.type);
  const damageCountByType = countByKey(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCountByType) {
    if (count > (insuredCountByType.get(type) ?? 0)) {
      fail(`More damages than insured items for type: ${type}`);
    }
  }
}

const results = [];
const policies = [];

for (const step of scenario.steps) {
  if (step.op === "quote") {
    assertKnownItemTypes(step.items);
    const { premium } = quote({
      items: step.items,
      yearsWithMHPCO,
      firstInsurance: true,
      followUp: policies.length > 0,
    });
    policies.push(step);
    results.push({ premium });
  } else if (step.op === "claim") {
    const items = policies[step.policy].items;
    assertDamageAmountsNonNegative(step.incident.damages);
    assertDamagesAreInsured(items, step.incident.damages);
    assertNotMoreDamagesThanInsured(items, step.incident.damages);
    const { payout, remainingCap } = claim(items, step.incident);
    results.push({ payout, remainingCap });
  }
}

process.stdout.write(JSON.stringify({ results }));
process.exit(0);
