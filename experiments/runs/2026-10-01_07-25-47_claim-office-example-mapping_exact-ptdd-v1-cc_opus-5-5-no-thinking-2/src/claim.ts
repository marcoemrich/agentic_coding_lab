import { priceOf, type ItemInput } from "./item.js";

export interface DamageInput {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: ItemInput[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const PERCENT = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

function insuranceSum(items: ItemInput[]): number {
  return items.reduce((sum, item) => sum + priceOf(item).insuranceValue, 0);
}

function reimbursement(item: ItemInput, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return (amount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) / PERCENT;
  }
  return amount;
}

function requireValidDamageAmount(damage: DamageInput): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeCoveredItem(undamagedItems: ItemInput[], damage: DamageInput): ItemInput {
  const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
  if (index < 0) {
    throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
  }
  return undamagedItems.splice(index, 1)[0];
}

function matchDamagesToCoveredItems(policyItems: ItemInput[], damages: DamageInput[]): ItemInput[] {
  const undamagedItems = [...policyItems];
  return damages.map((damage) => takeCoveredItem(undamagedItems, damage));
}

function damagePayout(item: ItemInput, damage: DamageInput): number {
  return reimbursement(item, damage.amount) - DEDUCTIBLE_PER_DAMAGE;
}

function roundPayoutInMHPCOFavor(payout: number): number {
  return Math.floor(payout);
}

export function openPolicy(items: ItemInput[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

export function settleClaim(policy: Policy, damages: DamageInput[]): ClaimResult {
  damages.forEach(requireValidDamageAmount);
  const damagedItems = matchDamagesToCoveredItems(policy.items, damages);
  const desiredPayout = roundPayoutInMHPCOFavor(
    damages.reduce((sum, damage, index) => sum + damagePayout(damagedItems[index], damage), 0),
  );
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
