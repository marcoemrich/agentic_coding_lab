import type { QuoteItem } from "./item.js";
import { drawFromCap, insuredItemsFor, type Policy } from "./policy.js";
import { reimbursementRateOf } from "./reimbursementClauses.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;

interface InsuredDamage {
  damage: Damage;
  damagedItem: QuoteItem;
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function assertValidIncident(incident: Incident): void {
  incident.damages.forEach(assertValidDamageAmount);
}

function insuredDamagesOf(incident: Incident, policy: Policy): InsuredDamage[] {
  const damagedItems = insuredItemsFor(
    policy,
    incident.damages.map((damage) => damage.itemType),
  );
  return incident.damages.map((damage, index) => ({ damage, damagedItem: damagedItems[index] }));
}

function reimbursementAfterDeductibleOf({ damage, damagedItem }: InsuredDamage): number {
  return damage.amount * reimbursementRateOf(damagedItem) - DEDUCTIBLE_PER_DAMAGE;
}

function payoutBeforeCapOf(incident: Incident, policy: Policy): number {
  return insuredDamagesOf(incident, policy).reduce(
    (sum, insuredDamage) => sum + reimbursementAfterDeductibleOf(insuredDamage),
    0,
  );
}

function payoutRoundedInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}

function payoutLimitedToRemainingCapOf(incident: Incident, policy: Policy): number {
  return Math.min(payoutBeforeCapOf(incident, policy), policy.remainingCap);
}

export function claim(incident: Incident, policy: Policy): ClaimResult {
  assertValidIncident(incident);
  const payout = payoutRoundedInMHPCOsFavor(payoutLimitedToRemainingCapOf(incident, policy));
  return { payout, remainingCap: drawFromCap(policy, payout) };
}
