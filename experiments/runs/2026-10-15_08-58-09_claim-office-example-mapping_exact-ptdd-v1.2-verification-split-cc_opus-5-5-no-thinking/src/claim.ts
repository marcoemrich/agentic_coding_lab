import type { QuoteItem } from "./premium.js";
import { assertKnownItemType, insuranceValue } from "./priceList.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const CAP_FACTOR = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE = 0.5;

function insuranceSum(insuredItems: QuoteItem[]): number {
  return insuredItems.reduce((sum, item) => sum + insuranceValue(item.type), 0);
}

function reimbursement(item: QuoteItem, amount: number): number {
  const share = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAUSE_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_SHARE : 1;
  return amount * share;
}

export interface Policy {
  insuredItems: QuoteItem[];
  remainingCap: number;
}

export function openPolicy(insuredItems: QuoteItem[]): Policy {
  insuredItems.forEach((item) => assertKnownItemType(item.type));
  return { insuredItems, remainingCap: CAP_FACTOR * insuranceSum(insuredItems) };
}

interface ItemDamage {
  item: QuoteItem;
  amount: number;
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

function matchDamagesToInsuredItems(insuredItems: QuoteItem[], damages: Damage[]): ItemDamage[] {
  const uncovered = [...insuredItems];
  return damages.map((damage) => {
    const index = uncovered.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged ${damage.itemType} is not covered by the policy`);
    }
    return { item: uncovered.splice(index, 1)[0], amount: damage.amount };
  });
}

export function claim(policy: Policy, damages: Damage[]): ClaimResult {
  const { insuredItems, remainingCap: capBeforeClaim } = policy;
  damages.forEach(assertValidDamageAmount);
  const desiredPayout = matchDamagesToInsuredItems(insuredItems, damages).reduce(
    (sum, { item, amount }) => sum + reimbursement(item, amount) - DEDUCTIBLE,
    0,
  );
  const payout = Math.min(Math.floor(desiredPayout), capBeforeClaim);
  policy.remainingCap = capBeforeClaim - payout;
  return { payout, remainingCap: policy.remainingCap };
}
