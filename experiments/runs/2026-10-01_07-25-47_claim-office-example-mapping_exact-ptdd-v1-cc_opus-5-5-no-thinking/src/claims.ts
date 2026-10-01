import { isComponent, type Item } from "./catalogue.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface Settlement {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

function insuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type];
}

export function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursedAmount(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE
    : amount;
}

function damagePayout(item: Item, damage: Damage): number {
  return reimbursedAmount(item, damage.amount) - DEDUCTIBLE;
}

function takeDamagedItem(undamagedItems: Item[], damage: Damage): Item {
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index < 0) {
    throw new Error(`Damaged item ${damage.itemType} is not covered by the policy`);
  }
  return undamagedItems.splice(index, 1)[0];
}

function assertValidDamageAmounts(damages: Damage[]): void {
  const invalid = damages.find((damage) => damage.amount < 0);
  if (invalid) {
    throw new Error(`Damage amount must not be negative: ${invalid.amount}`);
  }
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const undamagedItems = [...policy.items];
  return damages.reduce(
    (sum, damage) => sum + damagePayout(takeDamagedItem(undamagedItems, damage), damage),
    0,
  );
}

function roundPayoutInMHPCOsFavor(amount: number): number {
  return Math.floor(amount);
}

export function settleClaim(policy: Policy, damages: Damage[]): Settlement {
  assertValidDamageAmounts(damages);
  const payout = Math.min(roundPayoutInMHPCOsFavor(desiredPayout(policy, damages)), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
