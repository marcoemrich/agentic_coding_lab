import { percentOf } from "./percent.js";
import { type Item, insuranceSum } from "./price-list.js";
import { payoutRoundedInFavorOfMHPCO } from "./rounding.js";

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
const CAP_PER_INSURANCE_SUM = 2;
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

export function issuePolicy(items: Item[]): Policy {
  return { items, remainingCap: CAP_PER_INSURANCE_SUM * insuranceSum(items) };
}

// Dragon material grants full reimbursement, which is also the standard share,
// and the 50 % rule wins over it: the material never changes the outcome.
function reimbursementPercent(damagedItem: Item): number {
  const enchantment = damagedItem.enchantment ?? 0;
  return enchantment >= REDUCED_REIMBURSEMENT_ENCHANTMENT ? REDUCED_REIMBURSEMENT_PERCENT : FULL_REIMBURSEMENT_PERCENT;
}

function damagePayout(damage: Damage, damagedItem: Item): number {
  const reimbursement = percentOf(damage.amount, reimbursementPercent(damagedItem));
  return Math.max(reimbursement - DEDUCTIBLE, 0);
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function matchDamagedItems(insuredItems: Item[], damages: Damage[]): Item[] {
  const undamagedItems = [...insuredItems];
  return damages.map((damage) => {
    const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    return undamagedItems.splice(index, 1)[0];
  });
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  damages.forEach(rejectNegativeAmount);
  const damagedItems = matchDamagedItems(policy.items, damages);
  return payoutRoundedInFavorOfMHPCO(
    damages.reduce((sum, damage, index) => sum + damagePayout(damage, damagedItems[index]), 0),
  );
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = Math.min(desiredPayout(policy, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
