import type { Damage, Item } from "./claimOffice.js";
import { ScenarioRejection } from "./rejection.js";

export class UninsuredItemError extends ScenarioRejection {
  constructor(type: string) {
    super(`No insured "${type}" on the policy is left to cover this damage`);
  }
}

export interface CoveredDamage {
  insuredItem: Item;
  amount: number;
}

/** Pairs each damage with a distinct insured item; one insured item covers one damage per claim. */
export function coveredDamages(insuredItems: Item[], damages: Damage[]): CoveredDamage[] {
  const undamaged = [...insuredItems];
  return damages.map((damage) => {
    const index = undamaged.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new UninsuredItemError(damage.itemType);
    return {
      insuredItem: undamaged.splice(index, 1)[0],
      amount: damage.amount,
    };
  });
}
