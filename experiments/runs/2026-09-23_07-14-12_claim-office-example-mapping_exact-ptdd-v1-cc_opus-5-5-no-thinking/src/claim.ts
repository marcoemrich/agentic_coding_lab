import { insuranceValue, type Item } from "./priceList.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF = 0.5;

export function insurePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
  return { items, remainingCap: CAP_MULTIPLIER * insuranceSum };
}

function isReimbursedAtHalf(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL;
}

function reimbursement(item: Item, amount: number): number {
  if (isReimbursedAtHalf(item)) return amount * HALF;
  return amount;
}

interface CoveredDamage {
  item: Item;
  amount: number;
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
}

function coveredDamages(policy: Policy, damages: Damage[]): CoveredDamage[] {
  const undamaged = [...policy.items];
  return damages.map((damage) => {
    assertValidDamageAmount(damage);
    const index = undamaged.findIndex((insured) => insured.type === damage.itemType);
    if (index < 0) throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
    return { item: undamaged.splice(index, 1)[0], amount: damage.amount };
  });
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  return coveredDamages(policy, damages).reduce(
    (sum, { item, amount }) => sum + reimbursement(item, amount) - DEDUCTIBLE,
    0,
  );
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
