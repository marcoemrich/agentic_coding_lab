import { insuranceValueOf, type Item } from "./catalogue.js";

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
  remainingCap: number;
}

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSum(items) };
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

// Damage is reimbursed in full -- including the dragon-material clause, which
// grants full reimbursement -- except that enchantment >= 8 halves it. Where
// both the dragon-material and high-enchantment clauses apply, the 50 % rule wins.
function reimbursementRate(item: Item): number {
  const highlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  return highlyEnchanted ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;
}

/** A damage report states a loss, so its amount cannot be negative. */
export class InvalidDamageAmountError extends Error {
  constructor(amount: number) {
    super(`A damage amount cannot be negative, but the report states ${amount} G`);
    this.name = "InvalidDamageAmountError";
  }
}

function payoutForDamage(damage: Damage, item: Item): number {
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
}

/** A damage report may only name items the policy actually covers. */
export class UncoveredDamageError extends Error {
  constructor(itemType: string) {
    super(`The policy does not cover an item of type "${itemType}"`);
    this.name = "UncoveredDamageError";
  }
}

/**
 * Accepts the incident's damage reports: each must state a non-negative amount
 * and must be matched to a distinct insured item, so that a policy covering one
 * sword cannot answer two sword damages.
 */
function acceptDamageReports(policy: Policy, damages: Damage[]): { damage: Damage; item: Item }[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new InvalidDamageAmountError(damage.amount);
    }
    const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new UncoveredDamageError(damage.itemType);
    }
    const [item] = unclaimed.splice(index, 1);
    return { damage, item };
  });
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const desired = acceptDamageReports(policy, incident.damages).reduce(
    (sum, { damage, item }) => sum + payoutForDamage(damage, item),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
