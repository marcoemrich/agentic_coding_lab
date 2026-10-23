import type { Item } from "./quote.js";
import { PRICE_LIST } from "./quote.js";

export interface Policy {
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const DRAGON_MATERIAL = "dragon";
const FULL_REIMBURSEMENT_RATE = 1;
const STANDARD_REIMBURSEMENT_RATE = 1;

function insuranceValueOf(item: Item): number {
  return PRICE_LIST[item.type].insuranceValue;
}

export function insuranceSum(policy: Policy): number {
  return policy.items.reduce(
    (total, item) => total + insuranceValueOf(item),
    0,
  );
}

export function payoutCap(policy: Policy): number {
  return insuranceSum(policy) * CAP_MULTIPLIER;
}

function findInsuredItem(policy: Policy, itemType: string): Item {
  const item = policy.items.find((candidate) => candidate.type === itemType);
  if (item === undefined) {
    throw new Error(`damaged item is not part of the policy: ${itemType}`);
  }
  return item;
}

function isHighlyEnchantedClaim(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function isDragonMaterial(item: Item): boolean {
  return item.material === DRAGON_MATERIAL;
}

function reimbursementRate(item: Item): number {
  if (isHighlyEnchantedClaim(item)) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return isDragonMaterial(item)
    ? FULL_REIMBURSEMENT_RATE
    : STANDARD_REIMBURSEMENT_RATE;
}

function reimbursableAmount(item: Item, amount: number): number {
  return amount * reimbursementRate(item);
}

function damagePayout(policy: Policy, damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
  const item = findInsuredItem(policy, damage.itemType);
  const reimbursed = reimbursableAmount(item, damage.amount);
  return Math.max(reimbursed - DEDUCTIBLE, 0);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function countDamagedByType(damages: Damage[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const damage of damages) {
    counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1);
  }
  return counts;
}

function assertDamagesCovered(policy: Policy, damages: Damage[]): void {
  const insured = countByType(policy.items);
  for (const [itemType, damaged] of countDamagedByType(damages)) {
    if (damaged > (insured.get(itemType) ?? 0)) {
      throw new Error(
        `more damaged items of type ${itemType} than the policy covers`,
      );
    }
  }
}

export function processClaim(
  policy: Policy,
  damages: Damage[],
  remainingCap: number = payoutCap(policy),
): ClaimResult {
  assertDamagesCovered(policy, damages);
  const grossPayout = damages.reduce(
    (total, damage) => total + damagePayout(policy, damage),
    0,
  );
  const payout = Math.floor(Math.min(grossPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
