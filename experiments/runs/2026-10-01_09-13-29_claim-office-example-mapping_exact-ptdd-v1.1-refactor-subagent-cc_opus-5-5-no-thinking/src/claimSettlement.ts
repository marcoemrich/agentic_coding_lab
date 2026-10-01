import { priceListEntryFor, type InsuredItem } from "./itemCatalogue.js";

export interface Damage {
  itemType: string;
  amount: number;
}

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

function insuranceSum(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + priceListEntryFor(item.type).insuranceValue, 0);
}

// The total payout per policy is capped at twice the insurance sum.
export function payoutCapFor(items: InsuredItem[]): number {
  return CAP_MULTIPLIER * insuranceSum(items);
}

// A claim pays out no more than what is left of the policy's cap.
export function payoutWithinRemainingCap(payout: number, remainingCap: number): number {
  return Math.min(payout, remainingCap);
}

function reimbursableAmount(damage: Damage, item: InsuredItem): number {
  const highEnchantmentClauseApplies = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;
  if (highEnchantmentClauseApplies) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE;
  }
  return damage.amount;
}

// A damage entry paired with the insured item it claims.
interface CoveredDamage {
  damage: Damage;
  item: InsuredItem;
}

// A damage report is only valid when every damage amount is non-negative.
function assertValidDamageReport(damages: Damage[]): void {
  const invalid = damages.find((damage) => damage.amount < 0);
  if (invalid) {
    throw new Error(`Damage amount must not be negative: ${invalid.amount}`);
  }
}

function claimInsuredItem(damage: Damage, undamagedItems: InsuredItem[]): InsuredItem {
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
  }
  const [item] = undamagedItems.splice(index, 1);
  return item;
}

// A claim is admissible when its damage report is valid and each damage entry claims
// its own insured item; an item cannot be damaged twice in one incident.
function admissibleDamages(damages: Damage[], insuredItems: InsuredItem[]): CoveredDamage[] {
  assertValidDamageReport(damages);
  const undamagedItems = [...insuredItems];
  return damages.map((damage) => ({ damage, item: claimInsuredItem(damage, undamagedItems) }));
}

// For payouts, the MHPCO's favour means rounding down to whole G.
function roundInMhpcoFavour(amount: number): number {
  return Math.floor(amount);
}

// The deductible applies once per damage event.
function damageEventPayout({ damage, item }: CoveredDamage): number {
  return reimbursableAmount(damage, item) - DEDUCTIBLE;
}

// Intermediate amounts stay fractional; only the final payout is rounded.
export function payoutFor(damages: Damage[], insuredItems: InsuredItem[]): number {
  const payout = admissibleDamages(damages, insuredItems).reduce((sum, covered) => sum + damageEventPayout(covered), 0);
  return roundInMhpcoFavour(payout);
}
