import { type Item, enchantmentLevelOf, insuranceValueOf } from "./item-catalog.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimSettlement {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// The insurance sum adds up the listed insurance values; premium modifiers and the
// component block discount affect the premium only, never the insurance sum.
function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

// The total payout per policy is capped at twice the insurance sum.
export function payoutCapOf(policyItems: Item[]): number {
  return insuranceSumOf(policyItems) * CAP_MULTIPLIER;
}

function isReimbursedAtReducedRate(damagedItem: Item): boolean {
  return enchantmentLevelOf(damagedItem) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
}

// Damage is fully reimbursed (e.g. dragon material) unless the item is highly enchanted.
function reimbursementRateOf(damagedItem: Item): number {
  return isReimbursedAtReducedRate(damagedItem)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function reimbursementOf(damagedItem: Item, amount: number): number {
  return amount * reimbursementRateOf(damagedItem);
}

// Takes the insured item a damage refers to out of the items not yet damaged in this claim.
function takeUndamagedItemFor(undamagedItems: Item[], damage: Damage): Item {
  const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
  }
  return undamagedItems.splice(index, 1)[0];
}

// A claimed damage amount must not be negative.
function claimedDamageAmountOf(damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
  return damage.amount;
}

interface ClaimedDamage {
  damagedItem: Item;
  amount: number;
}

// Each damage refers to a separate insured item of the damaged type that is not yet damaged in this claim.
function claimedDamagesOf(policyItems: Item[], damages: Damage[]): ClaimedDamage[] {
  const undamagedItems = [...policyItems];
  return damages.map((damage) => ({
    damagedItem: takeUndamagedItemFor(undamagedItems, damage),
    amount: claimedDamageAmountOf(damage),
  }));
}

function damagePayoutOf({ damagedItem, amount }: ClaimedDamage): number {
  return reimbursementOf(damagedItem, amount) - DEDUCTIBLE_PER_DAMAGE;
}

function claimPayout(policyItems: Item[], damages: Damage[]): number {
  return claimedDamagesOf(policyItems, damages).reduce(
    (sum, claimedDamage) => sum + damagePayoutOf(claimedDamage),
    0,
  );
}

function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}

export function settleClaim(
  policyItems: Item[],
  damages: Damage[],
  remainingCap: number,
): ClaimSettlement {
  const payout = Math.min(
    roundPayoutInMHPCOsFavor(claimPayout(policyItems, damages)),
    remainingCap,
  );
  return { payout, remainingCap: remainingCap - payout };
}
