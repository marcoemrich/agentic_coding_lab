import type { Item, Result } from "./claim-office.js";

const AMULET_INSURANCE_VALUE = 600;
const SWORD_INSURANCE_VALUE = 1000;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;
const POLICY_CAP_MULTIPLIER = 2;
const DAMAGE_DEDUCTIBLE = 100;
const SPECIAL_ENCHANTMENT_LEVEL = 8;
const SPECIAL_REIMBURSEMENT_RATE = 0.5;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceValue(item: Item): number {
  if (item.type === "amulet") return AMULET_INSURANCE_VALUE;
  if (item.type === "staff") return STAFF_INSURANCE_VALUE;
  if (item.type === "potion") return POTION_INSURANCE_VALUE;
  if (item.type === "rune" || item.type === "moonstone") return COMPONENT_INSURANCE_VALUE;
  return SWORD_INSURANCE_VALUE;
}

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function assertDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}

function assertDamageCoverage(policy: Policy, damages: Damage[]): void {
  const damageTypes = new Set(damages.map((damage) => damage.itemType));
  for (const type of damageTypes) {
    const covered = policy.items.filter((item) => item.type === type).length;
    const damaged = damages.filter((damage) => damage.itemType === type).length;
    if (damaged > covered) throw new Error("Damage is not covered by the policy");
  }
}

function reimbursement(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= SPECIAL_ENCHANTMENT_LEVEL
    ? amount * SPECIAL_REIMBURSEMENT_RATE
    : amount;
}

export function processClaim(policy: Policy, damages: Damage[]): Result {
  assertDamageAmounts(damages);
  assertDamageCoverage(policy, damages);
  const desiredPayout = damages.reduce((sum, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType)!;
    return sum + Math.max(0, reimbursement(item, damage.amount) - DAMAGE_DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
