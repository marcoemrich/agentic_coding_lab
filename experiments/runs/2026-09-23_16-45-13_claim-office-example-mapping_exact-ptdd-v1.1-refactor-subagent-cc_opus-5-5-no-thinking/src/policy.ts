import type { Damage, Item } from "./claimOffice.js";
import { coveredDamages } from "./coverage.js";
import { rejectNegativeDamages } from "./damageReport.js";
import * as priceList from "./priceList.js";
import { damagePayout } from "./reimbursement.js";
import { roundPayoutInMHPCOsFavor } from "./rounding.js";

const CAP_MULTIPLIER = 2;

export interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceList.insuranceValue(item.type), 0);
}

function payoutCap(items: Item[]): number {
  return CAP_MULTIPLIER * insuranceSum(items);
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: payoutCap(items) };
}

function claimPayout(policy: Policy, damages: Damage[]): number {
  return coveredDamages(policy.items, damages).reduce(
    (sum, damage) => sum + damagePayout(damage.insuredItem, damage.amount),
    0,
  );
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function drawFromRemainingCap(policy: Policy, desiredPayout: number): number {
  const payout = Math.min(policy.remainingCap, desiredPayout);
  policy.remainingCap -= payout;
  return payout;
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  rejectNegativeDamages(damages);
  const desiredPayout = roundPayoutInMHPCOsFavor(claimPayout(policy, damages));
  const payout = drawFromRemainingCap(policy, desiredPayout);
  return { payout, remainingCap: policy.remainingCap };
}
