import type { QuoteItem } from "./premium.js";
import { insuranceValueOf } from "./priceList.js";

const DEDUCTIBLE = 100;

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const HIGH_ENCHANTMENT_THRESHOLD = 8;

const FULL_REIMBURSEMENT_RATE = 1;

const CAP_MULTIPLIER = 2;

export interface Damage {
  itemType: string;
  amount: number;
}

export function policyCap(policy: QuoteItem[]): number {
  return insuranceSum(policy) * CAP_MULTIPLIER;
}

function insuranceSum(policy: QuoteItem[]): number {
  return policy.reduce((total, item) => total + insuranceValueOf(item.type), 0);
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function processClaim(policy: QuoteItem[], damages: Damage[], capRemaining: number): ClaimResult {
  const payout = Math.min(claimPayout(policy, damages), capRemaining);
  return { payout, remainingCap: capRemaining - payout };
}

export function claimPayout(policy: QuoteItem[], damages: Damage[]): number {
  assertDamagesAreCovered(policy, damages);
  return damages.reduce((total, damage) => {
    const insured = findInsuredItem(policy, damage.itemType);
    return total + damagePayout(insured, damage.amount);
  }, 0);
}

function assertDamagesAreCovered(policy: QuoteItem[], damages: Damage[]): void {
  const insuredCounts = countByType(policy.map((item) => item.type));
  for (const [itemType, damagedCount] of countByType(damages.map((damage) => damage.itemType))) {
    if (damagedCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`claim damages more ${itemType} items than the policy covers`);
    }
  }
}

function countByType(types: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const type of types) counts.set(type, (counts.get(type) ?? 0) + 1);
  return counts;
}

function findInsuredItem(policy: QuoteItem[], itemType: string): QuoteItem {
  const insured = policy.find((candidate) => candidate.type === itemType);
  if (!insured) throw new Error(`damage refers to an item that is not insured: ${itemType}`);
  return insured;
}

export function damagePayout(item: QuoteItem, amount: number): number {
  if (amount < 0) throw new Error(`damage amount must not be negative: ${amount}`);
  return roundPayoutInFavorOfMHPCO(amount * reimbursementRate(item) - DEDUCTIBLE);
}

function roundPayoutInFavorOfMHPCO(amount: number): number {
  return Math.floor(amount);
}

function reimbursementRate(item: QuoteItem): number {
  return isHighlyEnchantedForClaim(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;
}

function isHighlyEnchantedForClaim(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}
