import { policyInsuranceSum, type Item } from "./priceList.js";

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

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

const fallsUnderHighEnchantmentClause = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL;

function reimbursement(item: Item, amount: number): number {
  return fallsUnderHighEnchantmentClause(item) ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : amount;
}

function damagePayout(item: Item, amount: number): number {
  return reimbursement(item, amount) - DEDUCTIBLE;
}

const roundPayoutInMhpcoFavor = Math.floor;

export function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: CAP_MULTIPLIER * policyInsuranceSum(items) };
}

function reportedAmount(damage: Damage): number {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  return damage.amount;
}

function takeInsuredItemFor(undamagedItems: Item[], damage: Damage): Item {
  const index = undamagedItems.findIndex((insured) => insured.type === damage.itemType);
  if (index < 0) throw new Error(`Damaged ${damage.itemType} is not covered by the policy`);
  return undamagedItems.splice(index, 1)[0];
}

interface CoveredDamage {
  item: Item;
  amount: number;
}

function coveredDamages(policy: Policy, damages: Damage[]): CoveredDamage[] {
  const undamagedItems = [...policy.items];
  return damages.map((damage) => ({ item: takeInsuredItemFor(undamagedItems, damage), amount: reportedAmount(damage) }));
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  return coveredDamages(policy, damages).reduce((sum, { item, amount }) => sum + damagePayout(item, amount), 0);
}

export function settleClaim(policy: Policy, damages: Damage[]): Settlement {
  const payout = Math.min(roundPayoutInMhpcoFavor(desiredPayout(policy, damages)), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
