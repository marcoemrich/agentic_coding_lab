import { damagePayout } from "./damage-payout.js";
import type { Item } from "./item.js";
import type { Policy } from "./policy.js";
import { roundPayoutInMhpcoFavor } from "./rounding.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimSettlement {
  payout: number;
  remainingCap: number;
}

function takeDamagedItem(undamagedItems: Item[], itemType: string): Item {
  const position = undamagedItems.findIndex((item) => item.type === itemType);
  if (position === -1) {
    throw new Error(`The policy covers no further item of type: ${itemType}`);
  }
  return undamagedItems.splice(position, 1)[0];
}

function rejectNegativeAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

// Each damage entry hits the next not-yet-damaged insured item of its type.
function damagePayouts(insuredItems: Item[], damages: Damage[]): number[] {
  const undamagedItems = [...insuredItems];
  return damages.map((damage) => damagePayout(takeDamagedItem(undamagedItems, damage.itemType), damage.amount));
}

function claimPayout(insuredItems: Item[], damages: Damage[]): number {
  damages.forEach(rejectNegativeAmount);
  const total = damagePayouts(insuredItems, damages).reduce((sum, payout) => sum + payout, 0);
  return roundPayoutInMhpcoFavor(total);
}

export function settleClaim(policy: Policy, damages: Damage[]): ClaimSettlement {
  const payout = Math.min(claimPayout(policy.insuredItems, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
