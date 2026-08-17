import { isKnownItemType, itemInsuranceValue, ItemType } from './catalog';
import { roundInOfficeFavor } from './rounding';

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_RATE = 0.5;
const FULL_RATE = 1;

export interface InsuredItem {
  type: string;
  material?: string;
  enchantment?: number;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface PolicyState {
  items: InsuredItem[];
  insuranceSum: number;
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function createPolicy(items: InsuredItem[]): PolicyState {
  const insuranceSum = items.reduce(
    (sum, item) => sum + itemInsuranceValue(item.type as ItemType),
    0,
  );
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

// High enchantment (>= 8) halves the reimbursement and wins over every other
// clause. Dragon material is fully reimbursed, which matches the standard rate,
// so once the high-enchantment case is handled the rate is always full.
function reimbursementRate(item: InsuredItem): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
  return highlyEnchanted ? HALF_RATE : FULL_RATE;
}

function damagePayout(item: InsuredItem, amount: number): number {
  const reimbursed = amount * reimbursementRate(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
}

function matchDamagesToItems(policy: PolicyState, damages: DamageEntry[]): InsuredItem[] {
  const remaining = [...policy.items];
  return damages.map((damage) => {
    validateDamageAmount(damage.amount);
    const index = remaining.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`no insured ${damage.itemType} left to match damage`);
    }
    return remaining.splice(index, 1)[0];
  });
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) {
    throw new Error(`damage amount must not be negative: ${amount}`);
  }
}

export function processClaim(policy: PolicyState, damages: DamageEntry[]): ClaimResult {
  const matched = matchDamagesToItems(policy, damages);
  const gross = damages.reduce(
    (sum, damage, i) => sum + damagePayout(matched[i], damage.amount),
    0,
  );
  const capped = Math.min(gross, policy.remainingCap);
  const payout = roundInOfficeFavor(capped, 'payout');
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function assertKnownItems(items: InsuredItem[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}
