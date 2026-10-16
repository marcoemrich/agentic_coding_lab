import { type InsuredItem, priceOf } from "./price-list.js";

export type Damage = { itemType: string; amount: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type Policy = { items: InsuredItem[]; remainingCap: number };

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const PERCENT = 100;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

function payoutCap(items: InsuredItem[]): number {
  const insuranceSum = items.reduce((sum, item) => sum + priceOf(item.type).insuranceValue, 0);
  return CAP_MULTIPLIER * insuranceSum;
}

function fallsUnderHighEnchantmentClause(item: InsuredItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function reimbursement(item: InsuredItem, amount: number): number {
  return fallsUnderHighEnchantmentClause(item)
    ? (amount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) / PERCENT
    : amount;
}

// Each damage entry refers to its own insured item; `unmatchedItems` shrinks as entries match.
function coveredItem(unmatchedItems: InsuredItem[], damage: Damage): InsuredItem {
  const index = unmatchedItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`damaged item is not covered by the policy: ${damage.itemType}`);
  }
  return unmatchedItems.splice(index, 1)[0];
}

// The deductible applies once per damage event.
function damageEventPayout(unmatchedItems: InsuredItem[], damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
  return reimbursement(coveredItem(unmatchedItems, damage), damage.amount) - DEDUCTIBLE;
}

export function openPolicy(items: InsuredItem[]): Policy {
  return { items, remainingCap: payoutCap(items) };
}

// Payout for the whole incident before the policy cap, rounded down in the MHPCO's favor.
function incidentPayout(items: InsuredItem[], damages: Damage[]): number {
  const unmatchedItems = [...items];
  return Math.floor(
    damages.reduce((sum, damage) => sum + damageEventPayout(unmatchedItems, damage), 0),
  );
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = Math.min(incidentPayout(policy.items, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
