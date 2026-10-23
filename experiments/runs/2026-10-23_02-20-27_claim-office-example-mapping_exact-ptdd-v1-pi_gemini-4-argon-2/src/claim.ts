import type {
  ClaimResult,
  ClaimStep,
  DamageEntry,
  QuoteItem,
} from "./claim-office.js";
import { getItemInsuranceValue } from "./price-list.js";

const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

export interface PolicyState {
  items: QuoteItem[];
  remainingCap: number;
}

function calculatePolicyCap(items: QuoteItem[]): number {
  const insuranceSum = items.reduce(
    (sum, item) => sum + getItemInsuranceValue(item.type),
    0,
  );
  return insuranceSum * POLICY_CAP_MULTIPLIER;
}

export function createPolicy(items: QuoteItem[]): PolicyState {
  return {
    items,
    remainingCap: calculatePolicyCap(items),
  };
}

function getDamageReimbursementRate(insuredItem: QuoteItem): number {
  return (insuredItem.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
    ? CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
}

function validateDamageAmount(damage: DamageEntry): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
}

function calculateDamageReimbursement(
  damage: DamageEntry,
  insuredItem: QuoteItem,
): number {
  validateDamageAmount(damage);
  const reimbursedDamage =
    damage.amount * getDamageReimbursementRate(insuredItem);
  return Math.max(0, reimbursedDamage - CLAIM_DEDUCTIBLE);
}

function roundPayoutInMHPCOFavor(amount: number): number {
  return Math.floor(amount);
}

function matchDamagedItemFromPolicy(
  damage: DamageEntry,
  availableItems: QuoteItem[],
): QuoteItem {
  const itemIndex = availableItems.findIndex(
    (item) => item.type === damage.itemType,
  );
  if (itemIndex === -1) {
    throw new Error(`Item type ${damage.itemType} is not covered by policy`);
  }
  const [insuredItem] = availableItems.splice(itemIndex, 1);
  return insuredItem;
}

export function processClaim(
  step: ClaimStep,
  policy: PolicyState,
): ClaimResult {
  const availableItems = [...policy.items];
  const unroundedPayout = step.incident.damages.reduce((sum, damage) => {
    const insuredItem = matchDamagedItemFromPolicy(damage, availableItems);
    return sum + calculateDamageReimbursement(damage, insuredItem);
  }, 0);
  const desiredPayout = roundPayoutInMHPCOFavor(unroundedPayout);
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return {
    payout,
    remainingCap: policy.remainingCap,
  };
}
