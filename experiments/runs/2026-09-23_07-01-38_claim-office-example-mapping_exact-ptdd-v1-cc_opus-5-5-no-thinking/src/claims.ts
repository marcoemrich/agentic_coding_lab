import { insuranceValue } from "./catalogue.js";
import type { ClaimResult, Damage, Item } from "./claimOffice.js";

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const PERCENT = 100;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

function policyCap(insured: Item[]): number {
  const insuranceSum = insured.reduce((sum, item) => sum + insuranceValue(item), 0);
  return insuranceSum * CAP_FACTOR;
}

function reimbursementPercent(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT : PERCENT;
}

interface CoveredDamage {
  damage: Damage;
  item: Item;
}

function damagePayout({ damage, item }: CoveredDamage): number {
  return (damage.amount * reimbursementPercent(item)) / PERCENT - DEDUCTIBLE;
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function matchCoveredDamages(insured: Item[], damages: Damage[]): CoveredDamage[] {
  const undamaged = [...insured];
  return damages.map((damage) => {
    const index = undamaged.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged ${damage.itemType} is not covered by the policy`);
    }
    return { damage, item: undamaged.splice(index, 1)[0] };
  });
}

function roundPayoutInMhpcoFavor(payout: number): number {
  return Math.floor(payout);
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: policyCap(items) };
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  damages.forEach(assertValidDamageAmount);
  const coveredDamages = matchCoveredDamages(policy.items, damages);
  const desiredPayout = roundPayoutInMhpcoFavor(
    coveredDamages.reduce((sum, coveredDamage) => sum + damagePayout(coveredDamage), 0),
  );
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
