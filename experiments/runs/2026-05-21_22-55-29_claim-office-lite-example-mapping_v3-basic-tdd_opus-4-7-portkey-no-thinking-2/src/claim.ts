import { Item, isKnownItemType } from './pricing.js';

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimInput {
  policyItems: Item[];
  damages: Damage[];
}

const DEDUCTIBLE = 100;
const HIGH_ENCHANT_PAYOUT_THRESHOLD = 8;
const DRAGON_MATERIAL = 'dragon';

export function computeClaim(input: ClaimInput): number {
  const { policyItems, damages } = input;

  // Validate: each damage references a known item type, present in the policy.
  // Match damages to policy items in order (FIFO per type), so we know which
  // specific item (with its enchantment/material) is damaged.
  const availableByType = new Map<string, Item[]>();
  for (const item of policyItems) {
    const list = availableByType.get(item.type) ?? [];
    list.push(item);
    availableByType.set(item.type, list);
  }

  let totalPayout = 0;

  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!isKnownItemType(damage.itemType)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
    const queue = availableByType.get(damage.itemType);
    if (!queue || queue.length === 0) {
      throw new Error(`Damage references item not covered by policy: ${damage.itemType}`);
    }
    const item = queue.shift()!;

    const enchant = item.enchantment ?? 0;
    let reimbursed: number;
    if (enchant >= HIGH_ENCHANT_PAYOUT_THRESHOLD) {
      reimbursed = damage.amount * 0.5;
    } else if (item.material === DRAGON_MATERIAL) {
      reimbursed = damage.amount;
    } else {
      reimbursed = damage.amount;
    }

    const afterDeductible = reimbursed - DEDUCTIBLE;
    totalPayout += Math.max(0, afterDeductible);
  }

  // Round down in MHPCO's favor
  return Math.floor(totalPayout);
}
