import { type Damage, damageEventPayout } from "./damageReimbursement.js";
import type { Item } from "./magicalItem.js";
import { roundPayoutInMhpcoFavor } from "./mhpcoRounding.js";
import { drawFromCap, type Policy } from "./policyCoverage.js";

export type ClaimSettlement = { payout: number; remainingCap: number };

function requireNonNegativeDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function takeDamagedInsuredItem(unmatchedInsuredItems: Item[], damage: Damage): Item {
  const index = unmatchedInsuredItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`Damaged ${damage.itemType} is not covered by the policy`);
  }
  return unmatchedInsuredItems.splice(index, 1)[0];
}

type DamagedInsuredItem = { damage: Damage; item: Item };

function matchDamagesToInsuredItems(policy: Policy, damages: Damage[]): DamagedInsuredItem[] {
  const unmatchedInsuredItems = [...policy.items];
  return damages.map((damage) => ({ damage, item: takeDamagedInsuredItem(unmatchedInsuredItems, damage) }));
}

function incidentPayout(policy: Policy, damages: Damage[]): number {
  return roundPayoutInMhpcoFavor(
    matchDamagesToInsuredItems(policy, damages).reduce((sum, { damage, item }) => sum + damageEventPayout(damage, item), 0),
  );
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimSettlement {
  damages.forEach(requireNonNegativeDamageAmount);
  const payout = drawFromCap(policy, incidentPayout(policy, damages));
  return { payout, remainingCap: policy.remainingCap };
}
