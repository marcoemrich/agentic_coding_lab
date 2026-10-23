import { insuranceSum, type QuoteItem } from "./quote.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimOutcome {
  payout: number;
  remainingCap: number;
}

export interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const FULL_REIMBURSEMENT = 1;

function capOf(policyItems: QuoteItem[]): number {
  return insuranceSum(policyItems) * CAP_MULTIPLIER;
}

export function createPolicy(items: QuoteItem[]): Policy {
  return { items, remainingCap: capOf(items) };
}

function damagedItemOf(policyItems: QuoteItem[], damage: Damage): QuoteItem {
  const item = policyItems.find((entry) => entry.type === damage.itemType);
  return item ?? { type: damage.itemType };
}

function isHighlyEnchantedInClaim(item: QuoteItem): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function reimbursementRatioOf(item: QuoteItem): number {
  return isHighlyEnchantedInClaim(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT
    : FULL_REIMBURSEMENT;
}

function reimbursableAmountOf(damage: Damage, item: QuoteItem): number {
  return damage.amount * reimbursementRatioOf(item);
}

function payoutForDamage(damage: Damage, item: QuoteItem): number {
  return Math.max(reimbursableAmountOf(damage, item) - DEDUCTIBLE, 0);
}

function desiredPayoutOf(policyItems: QuoteItem[], incident: Incident): number {
  return incident.damages.reduce(
    (sum, damage) =>
      sum + payoutForDamage(damage, damagedItemOf(policyItems, damage)),
    0,
  );
}

function roundDownInFavorOfMhpco(amount: number): number {
  return Math.floor(amount);
}

export function claimAgainstPolicy(
  policy: Policy,
  incident: Incident,
): ClaimOutcome {
  const desired = desiredPayoutOf(policy.items, incident);
  const payout = roundDownInFavorOfMhpco(
    Math.min(desired, policy.remainingCap),
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function claimPayout(
  policyItems: QuoteItem[],
  incident: Incident,
): ClaimOutcome {
  return claimAgainstPolicy(createPolicy(policyItems), incident);
}
