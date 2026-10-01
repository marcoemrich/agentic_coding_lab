import type { Damage, Item } from "./claimOffice.js";
import { insuranceSum } from "./priceList.js";

const CAP_FACTOR = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const PERCENT = 100;

export type Settlement = { payout: number; remainingCap: number };
export type Policy = { items: Item[]; remainingCap: number };
type CoveredDamage = { damage: Damage; item: Item };

function reimbursementPercent(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT : PERCENT;
}

function damagePayoutInPercentOfG({ damage, item }: CoveredDamage): number {
  return damage.amount * reimbursementPercent(item) - DEDUCTIBLE * PERCENT;
}

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

function assertValidDamageReport(damages: Damage[]): void {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Damage amount must not be negative: ${negative.amount}`);
  }
}

function matchDamagesToInsuredItems(policy: Policy, damages: Damage[]): CoveredDamage[] {
  const undamaged = [...policy.items];
  return damages.map((damage) => {
    const index = undamaged.findIndex((insured) => insured.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
    }
    return { damage, item: undamaged.splice(index, 1)[0] };
  });
}

export function settleClaim(policy: Policy, damages: Damage[]): Settlement {
  assertValidDamageReport(damages);
  const payoutInPercentOfG = matchDamagesToInsuredItems(policy, damages).reduce(
    (sum, coveredDamage) => sum + damagePayoutInPercentOfG(coveredDamage),
    0,
  );
  const payout = Math.min(Math.floor(payoutInPercentOfG / PERCENT), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
