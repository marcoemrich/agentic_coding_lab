import type { Damage } from "./damage-report.js";
import { reportedDamageAmount } from "./damage-report.js";
import { damagedItems } from "./damaged-item.js";
import type { Item } from "./policy.js";
import { payoutRoundedInMHPCOsFavour } from "./rounding.js";
import { reimbursementRateOf } from "./reimbursement-clause.js";

export interface ClaimResult {
  readonly payout: number;
  readonly remainingCap: number;
}

/**
 * The policyholder bears a deductible on each damaged item, so an incident
 * that damages several items bears it several times -- once per damage
 * entry, which is why the payout is accumulated per entry rather than off
 * the incident's total.
 */
const DEDUCTIBLE = 100;

/**
 * A payout is money the MHPCO pays out, so it floors at nothing: the
 * deductible can reduce a payout to zero, but a damage smaller than the
 * deductible never turns into a debt owed to the MHPCO.
 */
const NOTHING_PAID_OUT = 0;

/** What one damage settles at: the reimbursed share, less the deductible. */
function payoutForDamage(damagedItem: Item, damage: Damage): number {
  const reimbursed =
    reportedDamageAmount(damage) * reimbursementRateOf(damagedItem);
  return Math.max(reimbursed - DEDUCTIBLE, NOTHING_PAID_OUT);
}

/**
 * What an incident settles at: each damage entry is settled on its own --
 * under the clauses of the item it hit, and bearing its own deductible --
 * and the entries accumulate. An incident that damages nothing settles at
 * nothing.
 */
function incidentPayout(
  items: readonly Item[],
  damages: readonly Damage[],
): number {
  const hit = damagedItems(
    items,
    damages.map((damage) => damage.itemType),
  );
  return damages.reduce(
    (total, damage, entry) => total + payoutForDamage(hit[entry], damage),
    NOTHING_PAID_OUT,
  );
}

/** What a draw against the cap takes, and what it leaves behind. */
interface CapDraw {
  readonly drawn: number;
  readonly remainingCap: number;
}

/**
 * The policy pays no more than its cap still allows, so a payout the cap
 * cannot cover is reduced to what is left of it -- and once the cap is
 * exhausted it draws nothing at all.
 *
 * What a draw takes and what it leaves are one fact about the cap, stated
 * here together so that neither can be revised without the other.
 *
 * The cap is a separate limit from the clauses and the deductible: those
 * decide what the MHPCO owes for a damage, whereas the cap decides how much
 * a policy can still pay out at all, and the MHPCO revises the two on their
 * own schedules -- which is why drawing against the cap is stated apart from
 * what a damage settles at.
 */
function drawAgainstCap(capBeforeClaim: number, desiredPayout: number): CapDraw {
  const drawn = Math.min(desiredPayout, capBeforeClaim);
  return { drawn, remainingCap: capBeforeClaim - drawn };
}

/**
 * What the incident settles at as a final payout: whole G, rounded in the
 * MHPCO's favour.
 *
 * The rounding happens here, before the cap is drawn against, rather than on
 * whatever the draw yields. The clauses and the deductible are the
 * calculation, and its result is the final payout the spec has rounded; the
 * cap is a limit applied to that finished amount, not a further step of the
 * calculation. Rounding first is also what keeps the cap's ledger honest:
 * the policy is debited exactly the whole G it pays out, so the payout and
 * the remaining cap always add back up to the cap before the claim.
 *
 * Under the present rules the alternative ordering is indistinguishable --
 * a cap is always whole G, so a draw that binds yields that same whole
 * number either way -- which is precisely why the choice is stated here by
 * name instead of being left implicit in the order of two calls.
 */
function finalPayoutFor(
  items: readonly Item[],
  damages: readonly Damage[],
): number {
  return payoutRoundedInMHPCOsFavour(incidentPayout(items, damages));
}

/**
 * Settling an incident against the policy that covers it: what the incident
 * settles at, and what it leaves of the policy's cap.
 */
export function claim(
  items: readonly Item[],
  damages: readonly Damage[],
  capBeforeClaim: number,
): ClaimResult {
  const { drawn, remainingCap } = drawAgainstCap(
    capBeforeClaim,
    finalPayoutFor(items, damages),
  );
  return { payout: drawn, remainingCap };
}
