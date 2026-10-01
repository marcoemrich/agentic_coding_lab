import {
  admitDamages,
  type Damage,
  type SettledDamage,
  settledDamagesOf,
} from "./damage-report.js";
import type { Item } from "./price-list.js";
import { reimbursementShareOf } from "./reimbursement.js";
import { roundAmountPaidInMHPCOsFavour } from "./rounding.js";

export type { Damage };

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

// A deductible of 100 G applies per damage event, that is, once per
// damaged item rather than once per incident.
const DEDUCTIBLE_PER_DAMAGE = 100;

// What a single settled damage is worth: the reimbursable share of the damage
// amount, less the deductible the office withholds from every damage event.
// Which item the report refers to is settled before this point, so the
// valuation turns on the item itself, never on the policy.
function valueOf({ damagedItem, amount }: SettledDamage): number {
  return amount * reimbursementShareOf(damagedItem) - DEDUCTIBLE_PER_DAMAGE;
}

// What the incident is worth to the claimant: each reported damage is matched
// to the covered item it refers to, and every match is valued separately.
function incidentValueOf(items: Item[], incident: Incident): number {
  return settledDamagesOf(items, incident.damages).reduce(
    (total, settledDamage) => total + valueOf(settledDamage),
    0,
  );
}

// How a claim settles against the policy's remaining cap. The office never
// pays more than the cap still allows, so a claim worth more than that is
// reduced to what remains rather than refused, and the cap falls by what the
// office actually paid rather than by what the claim was worth. These two
// decisions move together whenever the office revises its cap rules, and
// neither touches what an incident is worth.
function settleAgainstCap(
  remainingCap: number,
  incidentValue: number,
): ClaimResult {
  const payout = roundAmountPaidInMHPCOsFavour(
    Math.min(incidentValue, remainingCap),
  );
  return { payout, remainingCap: remainingCap - payout };
}

// Settling an incident against a policy: what the incident is worth to the
// claimant, limited by what the policy's cap still allows.
export function claim(
  items: Item[],
  remainingCap: number,
  incident: Incident,
): ClaimResult {
  admitDamages(incident.damages);
  return settleAgainstCap(remainingCap, incidentValueOf(items, incident));
}
