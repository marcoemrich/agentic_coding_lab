import type { Damage, Item } from "./item.js";
import { priceListEntry } from "./priceList.js";

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue, 0);
}

export function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_FACTOR;
}

// The deductible applies once per damage event (each damaged item).
// Special clauses: enchantment >= 8 is reimbursed at 50 % (even for dragon material);
// dragon material and all other items are reimbursed in full.
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
}

function damageEventPayout({ damage, item }: DamageEvent): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function payoutRoundedInMHPCOFavor(amount: number): number {
  return Math.floor(amount);
}

interface DamageEvent {
  damage: Damage;
  item: Item;
}

function rejectInvalidDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
}

// Each damage entry refers to a separate insured item of its type.
function damageEvents(items: Item[], damages: Damage[]): DamageEvent[] {
  const notYetDamaged = [...items];
  return damages.map((damage) => {
    rejectInvalidDamage(damage);
    const index = notYetDamaged.findIndex((item) => item.type === damage.itemType);
    if (index < 0) {
      throw new Error(`Damaged ${damage.itemType} is not insured by the policy`);
    }
    return { damage, item: notYetDamaged.splice(index, 1)[0] };
  });
}

function damageReportTotal(items: Item[], damages: Damage[]): number {
  return damageEvents(items, damages).reduce((sum, event) => sum + damageEventPayout(event), 0);
}

export function claimPayout(
  items: Item[],
  damages: Damage[],
  remainingCap: number,
): { payout: number; remainingCap: number } {
  const payout = payoutRoundedInMHPCOFavor(Math.min(damageReportTotal(items, damages), remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}
