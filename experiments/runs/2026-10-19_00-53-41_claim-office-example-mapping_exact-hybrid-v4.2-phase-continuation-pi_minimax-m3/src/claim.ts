// Claim processing with reimbursement rules, deductible, and cap
import { type Item } from "./quote.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  totalPayoutsSoFar: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const insuranceValue = (item: Item): number =>
  INSURANCE_VALUE[item.type] ?? 0;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValue(item), 0);

// Group policy items by type so each damage entry can claim a distinct item.
const itemsByType = (items: Item[]): Map<string, Item[]> => {
  const map = new Map<string, Item[]>();
  for (const item of items) {
    const list = map.get(item.type) ?? [];
    list.push(item);
    map.set(item.type, list);
  }
  return map;
};

const isHighEnchantment = (item: Item): boolean =>
  item.enchantment !== undefined &&
  item.enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

// Reimbursement rate: 50% if high enchantment applies, else 100%.
const reimbursementRate = (item: Item): number =>
  isHighEnchantment(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;

const reimburseDamage = (item: Item, amount: number): number =>
  amount * reimbursementRate(item) - DEDUCTIBLE_PER_DAMAGE;

// Sum of per-damage reimbursements; rejects damages that exceed the available policy items for their type.
const rawDamagePayout = (policy: Policy, damages: Damage[]): number => {
  const available = itemsByType(policy.items);
  let rawPayout = 0;
  for (const damage of damages) {
    const item = available.get(damage.itemType)?.shift();
    if (item === undefined) {
      throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    }
    rawPayout += reimburseDamage(item, damage.amount);
  }
  return rawPayout;
};

// Reject damages whose amount would not make sense as a payout.
const assertNonNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

// Apply the policy cap to a raw payout: floor in MHPCO's favor, clamp to [0, cap],
// and return the final payout plus the cap that remains afterwards.
const applyPolicyCap = (
  rawPayout: number,
  cap: number,
): { payout: number; remainingCap: number } => {
  const payout = Math.max(0, Math.min(Math.floor(rawPayout), cap));
  return {
    payout,
    // payout is clamped to [0, cap], so this stays non-negative.
    remainingCap: cap - payout,
  };
};

export const processClaim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  assertNonNegativeAmounts(incident.damages);
  const availableCap = Math.max(
    0,
    CAP_MULTIPLIER * insuranceSum(policy.items) - policy.totalPayoutsSoFar,
  );
  return applyPolicyCap(rawDamagePayout(policy, incident.damages), availableCap);
};
