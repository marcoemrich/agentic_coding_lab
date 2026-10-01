import type { Damage, Item } from "./claim-office.js";
import { INSURANCE_VALUES } from "./price-list.js";

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

export interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

function payoutCap(items: Item[]): number {
  return CAP_MULTIPLIER * insuranceSum(items);
}

export function insurePolicy(items: Item[]): Policy {
  return { items, remainingCap: payoutCap(items) };
}

function reimbursementShare(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : 1;
}

function damagePayout(damage: Damage, damagedItem: Item): number {
  return damage.amount * reimbursementShare(damagedItem) - DEDUCTIBLE;
}

function takeInsuredItemFor(unclaimedItems: Item[], damage: Damage): Item {
  const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
  }
  return unclaimedItems.splice(index, 1)[0];
}

interface CoveredDamage {
  damage: Damage;
  insuredItem: Item;
}

function coveredDamages(policyItems: Item[], damages: Damage[]): CoveredDamage[] {
  const unclaimedItems = [...policyItems];
  return damages.map((damage) => ({ damage, insuredItem: takeInsuredItemFor(unclaimedItems, damage) }));
}

function claimPayout(policyItems: Item[], damages: Damage[]): number {
  return coveredDamages(policyItems, damages).reduce(
    (sum, { damage, insuredItem }) => sum + damagePayout(damage, insuredItem),
    0,
  );
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

export function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  damages.forEach(rejectNegativeAmount);
  const desiredPayout = Math.floor(claimPayout(policy.items, damages));
  const payout = Math.min(desiredPayout, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
}
