import type { Item } from './quote.js';

const INSURED_VALUE: Record<string, number> = { amulet: 600, sword: 1000, rune: 250, staff: 800, potion: 400, moonstone: 250 };
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT = 8;
const REIMBURSEMENT_RATE = 0.5;

type Damage = { itemType: string; amount: number };

function reimbursableDamage(item: Item | undefined, amount: number) {
  const rate = (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT ? REIMBURSEMENT_RATE : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

export function claim(items: Item[], damages: Damage[], previouslyPaid = 0) {
  const cap = items.reduce((sum, item) => sum + (INSURED_VALUE[item.type] ?? 0), 0) * CAP_MULTIPLIER;
  const available = [...items];
  const desired = damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Uninsured damage: ${damage.itemType}`);
    const [insured] = available.splice(index, 1);
    return sum + reimbursableDamage(insured, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, cap - previouslyPaid));
  return { payout, remainingCap: cap - previouslyPaid - payout };
}
