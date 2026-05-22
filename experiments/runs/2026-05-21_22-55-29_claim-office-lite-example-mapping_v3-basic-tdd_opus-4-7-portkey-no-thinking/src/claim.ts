import type { Item, Incident } from './types.js';
import { isKnownType } from './items.js';

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

export function claim(policy: Item[], incident: Incident): number {
  // Validate damages reference valid items
  for (const dmg of incident.damages) {
    if (!isKnownType(dmg.itemType)) {
      throw new Error(`Unknown item type in damage: ${dmg.itemType}`);
    }
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount: ${dmg.amount}`);
    }
  }

  // Match each damage to a unique policy item by type (in order).
  const used = new Array<boolean>(policy.length).fill(false);
  const matched: Array<{ item: Item; amount: number }> = [];
  for (const dmg of incident.damages) {
    const idx = policy.findIndex((it, i) => !used[i] && it.type === dmg.itemType);
    if (idx === -1) {
      throw new Error(
        `Damage references item not covered by policy: ${dmg.itemType}`
      );
    }
    used[idx] = true;
    matched.push({ item: policy[idx], amount: dmg.amount });
  }

  let total = 0;
  for (const { item, amount } of matched) {
    let reimbursable = amount;
    const ench = item.enchantment ?? 0;
    const isDragon = item.material === 'dragon';

    if (ench >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
      reimbursable = amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
    } else if (isDragon) {
      reimbursable = amount; // full
    }

    const payout = Math.max(0, reimbursable - DEDUCTIBLE);
    total += payout;
  }

  // Round down in MHPCO's favor
  return Math.floor(total);
}
