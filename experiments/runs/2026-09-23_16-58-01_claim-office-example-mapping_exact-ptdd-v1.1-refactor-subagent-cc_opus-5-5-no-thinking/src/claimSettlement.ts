import { enchantmentLevel, priceListEntry, type Item } from "./itemCatalog.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export type ClaimResult = { payout: number; remainingCap: number };

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const FULL_REIMBURSEMENT_RATE = 1;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item).insuranceValue, 0);
}

export function payoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLIER;
}

function reimbursementRate(item: Item): number {
  return enchantmentLevel(item) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;
}

interface CoveredDamage {
  damagedItem: Item;
  damage: Damage;
}

function takeCoveringItem(unmatchedItems: Item[], damage: Damage): Item {
  const index = unmatchedItems.findIndex((item) => item.type === damage.itemType);
  if (index < 0) {
    throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
  }
  return unmatchedItems.splice(index, 1)[0];
}

function matchDamagesToInsuredItems(insuredItems: Item[], damages: Damage[]): CoveredDamage[] {
  const unmatchedItems = [...insuredItems];
  return damages.map((damage) => ({ damagedItem: takeCoveringItem(unmatchedItems, damage), damage }));
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function damagePayout({ damagedItem, damage }: CoveredDamage): number {
  return damage.amount * reimbursementRate(damagedItem) - DEDUCTIBLE;
}

function claimPayout(insuredItems: Item[], damages: Damage[]): number {
  damages.forEach(assertValidDamageAmount);
  const coveredDamages = matchDamagesToInsuredItems(insuredItems, damages);
  return Math.floor(coveredDamages.reduce((sum, coveredDamage) => sum + damagePayout(coveredDamage), 0));
}

export function settleClaim(remainingCap: number, insuredItems: Item[], damages: Damage[]): ClaimResult {
  const payout = Math.min(claimPayout(insuredItems, damages), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}
