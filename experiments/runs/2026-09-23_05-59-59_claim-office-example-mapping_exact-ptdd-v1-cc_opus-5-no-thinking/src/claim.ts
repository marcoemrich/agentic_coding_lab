import type { Item } from "./item.js";
import { reimbursementRate } from "./reimbursement.js";
import { roundPayoutInMHPCOFavour } from "./mhpco-rounding.js";
import { matchDamagesToInsuredItems, type Damage } from "./damage-matching.js";

export type { Damage };

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE_PER_DAMAGE = 100;

function reimbursementFor(item: Item, damage: Damage): number {
  const reimbursed = damage.amount * reimbursementRate(item);
  return Math.max(reimbursed - DEDUCTIBLE_PER_DAMAGE, 0);
}

export function claim(
  items: Item[],
  incident: Incident,
  remainingCap: number,
): ClaimResult {
  const desired = matchDamagesToInsuredItems(items, incident.damages).reduce(
    (total, { item, damage }) => total + reimbursementFor(item, damage),
    0,
  );
  const payout = roundPayoutInMHPCOFavour(Math.min(desired, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
