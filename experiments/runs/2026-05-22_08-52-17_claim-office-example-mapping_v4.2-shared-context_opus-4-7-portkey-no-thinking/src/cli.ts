import { readFileSync } from "node:fs";
import { quote, claim, type Item, type Incident } from "./claim-office.js";

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const { customer, steps } = JSON.parse(readFileSync(0, "utf-8"));

type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

const policies: Item[][] = [];
const remainingCaps = new Map<number, number>();

function initialCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + 2 * INSURANCE_VALUES[item.type], 0);
}

function remainingCapFor(policyIndex: number): number {
  return remainingCaps.get(policyIndex) ?? initialCap(policies[policyIndex]);
}

function failWith(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUES)) {
      failWith(`Unknown item type: ${item.type}`);
    }
  }
}

function assertDamagesCoveredByPolicy(policyItems: Item[], incident: Incident): void {
  const policyTypes = new Set(policyItems.map((item) => item.type));
  for (const damage of incident.damages) {
    if (!policyTypes.has(damage.itemType)) {
      failWith(`Damage references item not in policy: ${damage.itemType}`);
    }
  }
}

function assertNonNegativeDamageAmounts(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      failWith(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
}

function countBy<T>(values: T[], key: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const k = key(value);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

function assertDamageCountsWithinPolicy(policyItems: Item[], incident: Incident): void {
  const policyCounts = countBy(policyItems, (item) => item.type);
  const damageCounts = countBy(incident.damages, (damage) => damage.itemType);
  for (const [itemType, count] of damageCounts) {
    if (count > (policyCounts.get(itemType) ?? 0)) {
      failWith(`Too many damages of type ${itemType} for policy`);
    }
  }
}

const results = (steps as Step[]).map((step) => {
  if (step.op === "quote") {
    assertKnownItemTypes(step.items);
    const isFollowUp = policies.length > 0;
    policies.push(step.items);
    return { premium: quote(customer, step.items, { isFollowUp }) };
  }
  const policyItems = policies[step.policy];
  assertDamagesCoveredByPolicy(policyItems, step.incident);
  assertNonNegativeDamageAmounts(step.incident);
  assertDamageCountsWithinPolicy(policyItems, step.incident);
  const result = claim({ items: policyItems }, step.incident, remainingCapFor(step.policy));
  remainingCaps.set(step.policy, result.remainingCap);
  return result;
});
process.stdout.write(JSON.stringify({ results }));
