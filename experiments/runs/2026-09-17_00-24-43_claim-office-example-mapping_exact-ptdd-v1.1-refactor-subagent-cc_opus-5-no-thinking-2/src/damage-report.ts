/**
 * What an incident reports: the entries a claim is made of, and what the
 * MHPCO will accept as a well-formed one.
 *
 * Admitting a damage entry is its own decision, separate from what the entry
 * settles at. The clauses, the deductible and the cap decide what the MHPCO
 * owes for a damage it accepts; the rules here decide whether there is a
 * damage to settle at all. The MHPCO revises the two on their own schedules
 * -- a stricter report form does not change any payout, and a revised clause
 * does not change what a report must look like.
 */

export interface Damage {
  readonly itemType: string;
  readonly amount: number;
}

/**
 * The least a damage may report. A damage is an amount of harm suffered, so
 * a negative entry reports less than no harm at all: it is a malformed
 * report rather than a claim the MHPCO settles.
 *
 * This bound coincides with the floor a payout settles at, but it is a
 * different fact about a different thing -- what a report may say, not what
 * the MHPCO pays -- and the two are stated apart so that raising one (a
 * minimum reportable damage, say) leaves the other where it is.
 */
const NO_HARM_SUFFERED = 0;

/**
 * The amount a damage reports, once the report is accepted. A claim reads a
 * damage's amount through here rather than off the entry, so that no part of
 * the settlement can act on an amount the MHPCO has not admitted.
 */
export function reportedDamageAmount(damage: Damage): number {
  if (damage.amount < NO_HARM_SUFFERED) {
    throw new Error(
      `A damage cannot be a negative amount, but got ${damage.amount}`,
    );
  }
  return damage.amount;
}
