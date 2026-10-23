import { getItemInsuranceValue } from "./price-list.js";
import type { QuoteItem } from "./quote.js";

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: DamageEntry[];
}

export interface PolicyState {
  items: QuoteItem[];
  remainingCap: number;
}

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

function roundPayoutInFavorOfMHPCO(amount: number): number {
  return Math.floor(amount);
}

function calculatePolicyCap(items: QuoteItem[]): number {
  const insuranceSum = items.reduce(
    (sum, item) => sum + getItemInsuranceValue(item.type),
    0
  );
  return insuranceSum * CAP_MULTIPLIER;
}

export function createPolicy(items: QuoteItem[]): PolicyState {
  return {
    items,
    remainingCap: calculatePolicyCap(items),
  };
}

function getDamageReimbursementRate(insuredItem: QuoteItem): number {
  return (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function calculateDamageReimbursement(
  damage: DamageEntry,
  insuredItem: QuoteItem
): number {
  if (damage.amount < 0) {
    throw new Error(`Invalid damage amount: ${damage.amount}`);
  }
  const reimbursedDamage =
    damage.amount * getDamageReimbursementRate(insuredItem);
  return Math.max(0, reimbursedDamage - DEDUCTIBLE_PER_DAMAGE);
}

function claimInsuredItemForDamage(
  availableItems: QuoteItem[],
  itemType: string
): QuoteItem {
  const matchIndex = availableItems.findIndex((item) => item.type === itemType);
  if (matchIndex === -1) {
    throw new Error(`Item type not insured by policy: ${itemType}`);
  }
  return availableItems.splice(matchIndex, 1)[0];
}

export function processClaim(
  policy: PolicyState,
  incident: Incident
): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const unroundedPayout = incident.damages.reduce((sum, damage) => {
    const insuredItem = claimInsuredItemForDamage(
      availableItems,
      damage.itemType
    );
    return sum + calculateDamageReimbursement(damage, insuredItem);
  }, 0);
  const payout = Math.min(
    policy.remainingCap,
    roundPayoutInFavorOfMHPCO(unroundedPayout)
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
