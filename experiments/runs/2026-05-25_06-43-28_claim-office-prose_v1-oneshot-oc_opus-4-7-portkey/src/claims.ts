import type { Item } from "./pricing.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

const DEDUCTIBLE = 100;

/**
 * Compute payout for an incident against a policy.
 * - Items with enchantment >= 8: 50% reimbursement
 * - Items made of dragon material: 100% reimbursement
 * - Other items: not reimbursed
 * - Deductible of 100 G per incident (applied after reimbursement reductions)
 * - Capped at twice insurance sum (cumulative across all incidents on the policy)
 *
 * Returns the actual payout and the remaining cap after this claim.
 */
export function processClaim(
  incident: Incident,
  policyItems: Item[],
  insuranceSum: number,
  alreadyPaid: number,
): { payout: number; remainingCap: number } {
  const totalCap = 2 * insuranceSum;
  const remainingBefore = Math.max(0, totalCap - alreadyPaid);

  // For each damage line, decide reimbursement rate based on the
  // first matching item in the policy of the given itemType.
  let reimbursable = 0;
  for (const dmg of incident.damages) {
    const item = policyItems.find((it) => it.type === dmg.itemType);
    if (!item) continue;
    const dragon = item.material?.toLowerCase() === "dragon";
    const highEnchant = (item.enchantment ?? 0) >= 8;
    let rate = 0;
    if (dragon) rate = 1;
    else if (highEnchant) rate = 0.5;
    else rate = 0;
    reimbursable += dmg.amount * rate;
  }

  // Apply deductible per incident
  let payout = reimbursable - DEDUCTIBLE;
  if (payout < 0) payout = 0;

  // Round in MHPCO's favor (round down for payouts)
  payout = Math.floor(payout);

  // Apply remaining cap
  if (payout > remainingBefore) payout = remainingBefore;

  return { payout, remainingCap: remainingBefore - payout };
}
