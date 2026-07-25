import { computeInsuranceSum, type Item } from "./catalog.js";

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

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const computeReimbursementRate = (item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1;
};

const computeDamagePayout = (item: Item, damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
  const rate = computeReimbursementRate(item);
  return damage.amount * rate - DEDUCTIBLE;
};

const buildItemBucketsByType = (policyItems: Item[]): Map<string, Item[]> => {
  const bucketsByType = new Map<string, Item[]>();
  for (const item of policyItems) {
    const bucket = bucketsByType.get(item.type) ?? [];
    bucket.push(item);
    bucketsByType.set(item.type, bucket);
  }
  return bucketsByType;
};

const takeNextInsuredItem = (bucketsByType: Map<string, Item[]>, itemType: string): Item => {
  const item = bucketsByType.get(itemType)?.shift();
  if (!item) {
    throw new Error(`No insured item of type ${itemType} available for this damage`);
  }
  return item;
};

const CAP_MULTIPLIER = 2;

export const computeCap = (policyItems: Item[]): number => computeInsuranceSum(policyItems) * CAP_MULTIPLIER;

const computeDesiredPayout = (policyItems: Item[], damages: Damage[]): number => {
  const bucketsByType = buildItemBucketsByType(policyItems);
  return damages.reduce((sum, damage) => {
    const item = takeNextInsuredItem(bucketsByType, damage.itemType);
    return sum + computeDamagePayout(item, damage);
  }, 0);
};

export const computeClaimPayout = (
  policyItems: Item[],
  incident: Incident,
  capBeforeClaim: number
): ClaimResult => {
  const desiredPayout = computeDesiredPayout(policyItems, incident.damages);
  const payout = Math.min(desiredPayout, capBeforeClaim);
  return { payout, remainingCap: capBeforeClaim - payout };
};
