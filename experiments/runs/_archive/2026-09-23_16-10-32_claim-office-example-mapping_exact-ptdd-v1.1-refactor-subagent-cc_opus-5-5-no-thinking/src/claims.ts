import type { InsuredItem } from "./insured-item";
import { drawFromCap, type Policy } from "./policy";
import { reimbursement } from "./reimbursement";

export interface Damage {
  itemType: string;
  amount: number;
}

// Payouts are rounded down to whole G, in MHPCO's favor.
function roundPayoutInMhpcoFavor(exactPayout: number): number {
  return Math.floor(exactPayout);
}

interface DamagedItem {
  damage: Damage;
  insuredItem: InsuredItem;
}

// Each reported damage refers to the next not-yet-damaged insured item of its type, in reporting order;
// a damage for which no such item remains is not covered by the policy and the claim is refused.
// Item types unknown to the price list can never be insured, so damages to them are refused by the same rule.
function matchDamagesToInsuredItems(damages: Damage[], policy: Policy): DamagedItem[] {
  const undamagedItems = [...policy.items];
  return damages.map((damage) => {
    const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new Error(`Damage to ${damage.itemType} is not covered by the policy`);
    return { damage, insuredItem: undamagedItems.splice(index, 1)[0] };
  });
}

function totalReimbursement(damages: Damage[], policy: Policy): number {
  return matchDamagesToInsuredItems(damages, policy).reduce(
    (sum, { damage, insuredItem }) => sum + reimbursement(damage.amount, insuredItem),
    0,
  );
}

// A reported damage amount must not be negative; a claim containing one is refused as a whole.
function rejectNegativeDamageAmounts(damages: Damage[]): void {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) throw new Error(`Damage amount must not be negative: ${negativeDamage.amount}`);
}

export function settleClaim(damages: Damage[], policy: Policy): { payout: number; remainingCap: number } {
  rejectNegativeDamageAmounts(damages);
  const payout = drawFromCap(policy, roundPayoutInMhpcoFavor(totalReimbursement(damages, policy)));
  return { payout, remainingCap: policy.remainingCap };
}
