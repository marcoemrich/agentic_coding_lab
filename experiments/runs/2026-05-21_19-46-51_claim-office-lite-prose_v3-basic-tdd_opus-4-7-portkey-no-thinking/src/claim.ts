import type { Item } from './quote.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANT_THRESHOLD = 8;
const HIGH_ENCHANT_RATE = 0.5;
const DRAGON_RATE = 1.0;

function reimbursableAmount(item: Item, amount: number): number {
  if (item.material === 'dragon') return amount * DRAGON_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) return amount * HIGH_ENCHANT_RATE;
  return 0;
}

export function computePayout(policyItems: Item[], incident: Incident): number {
  let total = 0;
  for (const damage of incident.damages) {
    const item = policyItems.find(i => i.type === damage.itemType);
    if (!item) continue;
    total += reimbursableAmount(item, damage.amount);
  }
  total -= DEDUCTIBLE;
  if (total < 0) total = 0;
  // Round in MHPCO's favor (round down).
  return Math.floor(total + 1e-9);
}
