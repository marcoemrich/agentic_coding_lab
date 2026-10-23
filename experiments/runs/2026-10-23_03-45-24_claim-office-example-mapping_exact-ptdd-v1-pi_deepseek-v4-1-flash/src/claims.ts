import { countByType } from "./items.js";
import type { Item } from "./pricing.js";

export interface Damage {
  itemType: string;
  amount: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function findInsuredItem(insuredItems: Item[], damage: Damage): Item | undefined {
  return insuredItems.find((item) => item.type === damage.itemType);
}

export function claimPayout(insuredItems: Item[], damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${damage.amount}`);
  }
  const insured = findInsuredItem(insuredItems, damage);
  if (insured === undefined) {
    throw new Error(`damaged item is not part of the policy: ${damage.itemType}`);
  }
  const enchantment = insured.enchantment ?? 0;
  const reimbursable =
    enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;
  return roundPayoutDown(reimbursable - DEDUCTIBLE);
}

function roundPayoutDown(amount: number): number {
  return Math.floor(amount);
}

export function claimPayoutForDamages(
  insuredItems: Item[],
  damages: Damage[],
): number {
  assertDamagesCovered(insuredItems, damages);
  return damages.reduce(
    (total, damage) => total + claimPayout(insuredItems, damage),
    0,
  );
}

function assertDamagesCovered(insuredItems: Item[], damages: Damage[]): void {
  const insuredCounts = countByType(insuredItems, (item) => item.type);
  const damagedCounts = countByType(damages, (damage) => damage.itemType);
  for (const [type, count] of damagedCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (count > insuredCount) {
      throw new Error(
        `more ${type} damages than insured ${type} items: ${count} > ${insuredCount}`,
      );
    }
  }
}


