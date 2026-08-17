import type { Item, Incident, Damage } from './types.js';
import {
  isMainItem,
  isComponent,
  mainItemEntry,
  COMPONENT_INSURANCE_VALUE,
} from './catalog.js';

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolicyError';
  }
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function itemInsuranceValue(item: Item): number {
  if (isMainItem(item.type)) {
    return mainItemEntry(item.type).insuranceValue;
  }
  if (isComponent(item.type)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  throw new PolicyError(`Unknown item type: ${item.type}`);
}

export function createPolicy(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += itemInsuranceValue(item);
  }
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  };
}

// Reimbursed amount for a single damage before the deductible, applying the
// enchantment (>=8) and dragon-material clauses. The 50% high-enchantment
// clause takes priority over the full dragon-material reimbursement; the
// default (no clause) is also full reimbursement.
function reimbursement(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  // Dragon material and the standard case both reimburse in full.
  return amount;
}

// Round to whole G in the MHPCO's favour: payouts round down.
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

// Match each damage to a distinct policy item of the same type, consuming
// items so that more damages of a type than the policy covers is rejected.
function matchDamages(policy: Policy, damages: Damage[]): Item[] {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = available.get(item.type) ?? [];
    list.push(item);
    available.set(item.type, list);
  }

  const matched: Item[] = [];
  for (const damage of damages) {
    const list = available.get(damage.itemType);
    if (!list || list.length === 0) {
      throw new PolicyError(
        `Damage references item not in policy: ${damage.itemType}`,
      );
    }
    matched.push(list.shift() as Item);
  }
  return matched;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new PolicyError(`Negative damage amount: ${damage.amount}`);
    }
  }

  const matched = matchDamages(policy, incident.damages);

  let desired = 0;
  incident.damages.forEach((damage, i) => {
    const reimbursed = reimbursement(matched[i], damage.amount);
    const net = Math.max(0, reimbursed - DEDUCTIBLE);
    desired += net;
  });

  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}
