import type { Damage } from "./claimOffice.js";
import { ScenarioRejection } from "./rejection.js";

export class NegativeDamageError extends ScenarioRejection {
  constructor(damage: Damage) {
    super(`Damage amount ${damage.amount} for "${damage.itemType}" must not be negative`);
  }
}

export function rejectNegativeDamages(damages: Damage[]): void {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) throw new NegativeDamageError(negative);
}
