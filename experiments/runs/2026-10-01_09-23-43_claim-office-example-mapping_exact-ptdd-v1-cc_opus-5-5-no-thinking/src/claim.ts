import type { Damage, Item } from "./claim-office.js";
import { insuranceSum } from "./price-list.js";

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

function roundPayoutInMhpcoFavor(payout: number): number {
  return Math.floor(payout);
}

function reimbursement(item: Item, damageAmount: number): number {
  const share = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : 1;
  return damageAmount * share;
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeDamagedItem(undamagedItems: Item[], damage: Damage): Item {
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
  }
  return undamagedItems.splice(index, 1)[0];
}

interface ItemDamage {
  item: Item;
  amount: number;
}

function damagedItems(policy: Policy, damages: Damage[]): ItemDamage[] {
  damages.forEach(assertValidDamageAmount);
  const undamagedItems = [...policy.items];
  return damages.map((damage) => ({ item: takeDamagedItem(undamagedItems, damage), amount: damage.amount }));
}

function desiredPayout(itemDamages: ItemDamage[]): number {
  return itemDamages.reduce((sum, { item, amount }) => sum + reimbursement(item, amount) - DEDUCTIBLE, 0);
}

export function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const payout = Math.min(roundPayoutInMhpcoFavor(desiredPayout(damagedItems(policy, damages))), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
