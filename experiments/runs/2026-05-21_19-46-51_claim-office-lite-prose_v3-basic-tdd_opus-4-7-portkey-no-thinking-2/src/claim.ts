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

function isDragon(material: string | undefined): boolean {
  if (!material) return false;
  return material.toLowerCase().includes('dragon');
}

function reimbursementForDamage(item: Item | undefined, amount: number): number {
  if (item && isDragon(item.material)) return amount;
  if (item && (item.enchantment ?? 0) >= 8) return Math.floor(amount * 0.5);
  return amount;
}

export function claim(policyItems: Item[], incident: Incident): number {
  let gross = 0;
  for (const damage of incident.damages) {
    const item = policyItems.find((i) => i.type === damage.itemType);
    gross += reimbursementForDamage(item, damage.amount);
  }
  const payout = gross - DEDUCTIBLE;
  return Math.max(0, payout);
}
