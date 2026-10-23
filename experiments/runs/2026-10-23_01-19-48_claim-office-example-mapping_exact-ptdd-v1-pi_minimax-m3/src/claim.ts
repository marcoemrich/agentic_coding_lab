import { ClaimOfficeError, type Item } from "./quote.js";

export { ClaimOfficeError };

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  cap: number;
  paidOut: number;
}

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (sum, item) => sum + (ITEM_INSURANCE_VALUE[item.type] ?? 0),
    0,
  );
  return { items, cap: insuranceSum * CAP_MULTIPLIER, paidOut: 0 };
}

function roundDown(amount: number): number {
  return Math.floor(amount);
}

function policyCounts(policy: Policy): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of policy.items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function findItemByType(policy: Policy, itemType: string): Item | undefined {
  return policy.items.find((i) => i.type === itemType);
}

function rawDamagePayout(damage: Damage, item: Item | undefined): number {
  if ((item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damage.amount;
}

function validateDamages(policy: Policy, damages: Damage[]): void {
  const counts = policyCounts(policy);
  const damagesByType: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new ClaimOfficeError(`damage amount must be non-negative, got ${damage.amount}`);
    }
    const covered = counts.get(damage.itemType) ?? 0;
    if (covered === 0) {
      throw new ClaimOfficeError(
        `damage references item type not in policy: ${damage.itemType}`,
      );
    }
    damagesByType[damage.itemType] = (damagesByType[damage.itemType] ?? 0) + 1;
    if (damagesByType[damage.itemType]! > covered) {
      throw new ClaimOfficeError(
        `too many damage entries for ${damage.itemType}: ${damagesByType[damage.itemType]} > ${covered}`,
      );
    }
  }
}

export function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  validateDamages(policy, damages);
  let totalPayout = 0;
  for (const damage of damages) {
    const item = findItemByType(policy, damage.itemType);
    totalPayout += Math.max(rawDamagePayout(damage, item) - DEDUCTIBLE, 0);
  }
  const payout = Math.min(roundDown(totalPayout), policy.cap - policy.paidOut);
  const remainingCap = Math.max(policy.cap - policy.paidOut - payout, 0);
  return { payout, remainingCap };
}
