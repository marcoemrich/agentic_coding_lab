import { insuranceValue } from "./priceList.js";
import type { ClaimResult, Damage, InsuredItem } from "./types.js";

const CAP_FACTOR = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

function reimbursableAmount(item: InsuredItem, damage: Damage): number {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
  return isHighlyEnchanted ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : damage.amount;
}

const damagePayout = (item: InsuredItem, damage: Damage): number => reimbursableAmount(item, damage) - DEDUCTIBLE;

function validDamage(damage: Damage): Damage {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  return damage;
}

export function policyCap(policyItems: InsuredItem[]): number {
  const insuranceSum = policyItems.reduce((sum, item) => sum + insuranceValue(item), 0);
  return insuranceSum * CAP_FACTOR;
}

function takeInsuredItemFor(undamagedItems: InsuredItem[], damage: Damage): InsuredItem {
  const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
  return undamagedItems.splice(index, 1)[0];
}

type CoveredDamage = { item: InsuredItem; damage: Damage };

function coveredDamages(policyItems: InsuredItem[], damages: Damage[]): CoveredDamage[] {
  const undamagedItems = [...policyItems];
  return damages.map(validDamage).map((damage) => ({ item: takeInsuredItemFor(undamagedItems, damage), damage }));
}

export function processClaim(policyItems: InsuredItem[], damages: Damage[], remainingCap: number): ClaimResult {
  const desiredPayout = coveredDamages(policyItems, damages).reduce(
    (sum, { item, damage }) => sum + damagePayout(item, damage),
    0,
  );
  const payout = Math.min(Math.floor(desiredPayout), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}
