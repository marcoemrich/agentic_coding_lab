import { baseInsuranceValue, type Item } from "./quote.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimInput {
  policy: Policy;
  incident: Incident;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const CAP_MULTIPLIER = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + baseInsuranceValue(item.type), 0);
}

export function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

function findItem(items: Item[], itemType: string): Item | undefined {
  return items.find((it) => it.type === itemType);
}

function reimbursementFor(damage: Damage, item: Item | undefined): number {
  const enchantment = item?.enchantment ?? 0;
  if (enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damage.amount * 0.5;
  }
  return damage.amount;
}

function countByKey<T>(values: T[], keyOf: (v: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const v of values) {
    const key = keyOf(v);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function validateDamages(items: Item[], damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
  const itemCounts = countByKey(items, (i) => i.type);
  const damageCounts = countByKey(damages, (d) => d.itemType);
  for (const [type, count] of damageCounts) {
    const insured = itemCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(`Claim has ${count} damages of type ${type} but policy covers only ${insured}`);
    }
  }
}

export function claim(input: ClaimInput): ClaimResult {
  validateDamages(input.policy.items, input.incident.damages);
  let totalPayout = 0;
  for (const damage of input.incident.damages) {
    const item = findItem(input.policy.items, damage.itemType);
    const reimbursement = reimbursementFor(damage, item);
    const itemPayout = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += itemPayout;
  }
  const cappedPayout = Math.min(totalPayout, input.policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  return { payout: finalPayout, remainingCap: input.policy.remainingCap - finalPayout };
}
