import { type Item, insuranceValueOf } from "./quote.js";

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM };
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function isSeverelyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD;
}

function reimbursementFor(item: Item, damage: Damage): number {
  const reimbursed = isSeverelyEnchanted(item)
    ? damage.amount * REDUCED_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursed - DEDUCTIBLE_PER_DAMAGE;
}

function requireReportableDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
  }
}

/** Each damage report must be matched to its own insured item; an item cannot be claimed twice. */
function matchDamagesToInsuredItems(policy: Policy, damages: Damage[]): [Item, Damage][] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((insured) => insured.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item is not covered by the policy: ${damage.itemType}`);
    }
    const [item] = unclaimed.splice(index, 1);
    return [item, damage];
  });
}

function totalReimbursementFor(policy: Policy, incident: Incident): number {
  requireReportableDamages(incident.damages);
  return matchDamagesToInsuredItems(policy, incident.damages).reduce(
    (sum, [item, damage]) => sum + reimbursementFor(item, damage),
    0,
  );
}

/** The MHPCO always rounds a payout it makes downwards. */
function roundPayoutInMHPCOsFavour(amount: number): number {
  return Math.floor(amount);
}

/** Pays out at most what the policy's cap still allows, and consumes that much of it. */
function drawFromRemainingCap(policy: Policy, reimbursement: number): number {
  const payout = Math.min(reimbursement, policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const reimbursement = roundPayoutInMHPCOsFavour(totalReimbursementFor(policy, incident));
  const payout = drawFromRemainingCap(policy, reimbursement);
  return { payout, remainingCap: policy.remainingCap };
}
