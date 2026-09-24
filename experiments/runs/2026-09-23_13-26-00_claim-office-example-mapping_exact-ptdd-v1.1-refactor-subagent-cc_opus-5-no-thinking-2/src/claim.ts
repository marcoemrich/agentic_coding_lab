import { type Item } from "./item-pricing.js";
import { drawFromCap, payoutCapOf } from "./payout-cap.js";
import { roundAmountOfficePays } from "./office-favour-rounding.js";
import { reimbursedShareOf } from "./settlement-clauses.js";

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

/** A policy the MHPCO has written: the items it covers and the cap still available. */
export interface Policy {
  items: Item[];
  remainingCap: number;
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: payoutCapOf(items) };
}

const DEDUCTIBLE_PER_DAMAGE_EVENT = 100;

/** A damage entry together with the insured object it claims. */
interface ClaimedDamage {
  damage: Damage;
  damagedItem: Item;
}

/**
 * Whether the office will consider a damage report at all, judged from the
 * report alone and before any policy is consulted: it refuses to read a report
 * claiming an amount of damage that was never suffered.
 */
function admitDamageReport(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage report cannot claim a negative amount of ${damage.amount} G`);
  }
}

/**
 * Which insured object an admitted damage entry claims. Each entry claims a
 * covered object of its own, taking it out of the office's reckoning, so an
 * incident cannot report more damaged objects of a type than the policy
 * actually covers — and an object the policy never covered, whether an item
 * type the office does not underwrite or one it simply did not insure here, is
 * no more claimable than one already claimed.
 */
function claimAgainstCoverage(unclaimedItems: Item[], damage: Damage): Item {
  const insuredIndex = unclaimedItems.findIndex((item) => item.type === damage.itemType);
  if (insuredIndex === -1) {
    throw new Error(`The policy does not cover a further item of type "${damage.itemType}"`);
  }
  return unclaimedItems.splice(insuredIndex, 1)[0];
}

/**
 * How the office reads an incident's damage entries against a policy: it admits
 * each report, then matches it to a covered object still unclaimed.
 */
function claimedDamagesOf(policy: Policy, damages: Damage[]): ClaimedDamage[] {
  const unclaimedItems = [...policy.items];
  return damages.map((damage) => {
    admitDamageReport(damage);
    return { damage, damagedItem: claimAgainstCoverage(unclaimedItems, damage) };
  });
}

/**
 * What one damaged item earns its owner: the share the settlement rulebook
 * reimburses, less the deductible the office withholds for each damage event.
 * The office reaches this figure for a damaged object on its own, which is why
 * a second damaged object in the same incident is withheld its own deductible.
 */
function settlementFor(damage: Damage, damagedItem: Item): number {
  return reimbursedShareOf(damage.amount, damagedItem) - DEDUCTIBLE_PER_DAMAGE_EVENT;
}

/**
 * What the MHPCO owes for an incident before the policy's cap is consulted: it
 * works out which insured object each damage entry claims, settles each claimed
 * damage on its own, and rounds the total in the office's favour.
 */
function owedForIncident(policy: Policy, incident: Incident): number {
  const settlements = claimedDamagesOf(policy, incident.damages).reduce(
    (running, { damage, damagedItem }) => running + settlementFor(damage, damagedItem),
    0,
  );
  return roundAmountOfficePays(settlements);
}

/**
 * How the MHPCO settles an incident: it works out what it owes for the damages,
 * then pays out only as far as the policy's remaining cap affords.
 */
export function claim(policy: Policy, incident: Incident): ClaimResult {
  return drawFromCap(policy.remainingCap, owedForIncident(policy, incident));
}

/**
 * The register of policies the MHPCO has written in the course of a scenario.
 * The office files each policy under the step that opened it, refuses a claim
 * that references a step which opened none, and records the reduced cap against
 * the policy once a claim has drawn on it — which is how a policy's promise
 * shrinks from one claim to the next. How a policy is referenced and how its
 * drawn-down cap is carried forward are one decision about the office's
 * bookkeeping, so they are stated together here.
 */
export class PolicyRegister {
  private readonly policiesByReference = new Map<number, Policy>();

  /** The office files the policy a quote step wrote under that step's reference. */
  file(reference: number, policy: Policy): void {
    this.policiesByReference.set(reference, policy);
  }

  /**
   * Settling a claim against a registered policy: the office refuses a
   * reference it never wrote a policy for, and records what the claim left of
   * the policy's cap so a later claim draws on the reduced promise.
   */
  settleAgainst(reference: number, incident: Incident): ClaimResult {
    const policy = this.policiesByReference.get(reference);
    if (policy === undefined) {
      throw new Error(`Step ${reference} did not open a policy to claim against`);
    }
    const result = claim(policy, incident);
    this.policiesByReference.set(reference, { ...policy, remainingCap: result.remainingCap });
    return result;
  }
}
