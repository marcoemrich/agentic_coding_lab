import { MAIN_ITEM_TYPES, type Item, type Incident, type PolicyState, type ClaimResult } from './types.js';

const DEDUCTIBLE = 100;

function isDragonMaterial(item: Item): boolean {
  return 'material' in item && item.material === 'dragon';
}

function getEnchantment(item: Item): number {
  if ('enchantment' in item && typeof item.enchantment === 'number') {
    return item.enchantment;
  }
  return 0;
}

/**
 * Processes a claim against a policy.
 * Throws if validation fails (unknown item type, item not in policy,
 * too many damage entries for a type, negative damage amounts).
 */
export function processClaim(policy: PolicyState, incident: Incident): ClaimResult {
  // Validate damage entries
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }

  // Count insured items by type
  const insuredCount = new Map<string, number>();
  for (const item of policy.items) {
    insuredCount.set(item.type, (insuredCount.get(item.type) ?? 0) + 1);
  }

  // Count damage entries by type
  const damageCount = new Map<string, number>();
  for (const damage of incident.damages) {
    damageCount.set(damage.itemType, (damageCount.get(damage.itemType) ?? 0) + 1);
  }

  // Validate: each damaged item type must be insured, and count must not exceed insured count
  for (const [itemType, count] of damageCount) {
    const insured = insuredCount.get(itemType) ?? 0;
    if (insured === 0) {
      throw new Error(`Item type "${itemType}" is not covered by this policy`);
    }
    if (count > insured) {
      throw new Error(
        `Policy covers ${insured} ${itemType}(s), but ${count} damage entries submitted`,
      );
    }
  }

  // Build a lookup of insured items by type to find item properties for each damage
  const itemsByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = itemsByType.get(item.type) ?? [];
    list.push(item);
    itemsByType.set(item.type, list);
  }
  const itemTypeUsage = new Map<string, number>(); // how many of each type have been used

  let rawPayout = 0;

  for (const damage of incident.damages) {
    // Find the corresponding insured item
    const usedCount = itemTypeUsage.get(damage.itemType) ?? 0;
    const matchingItems = itemsByType.get(damage.itemType) ?? [];
    const item = matchingItems[usedCount];
    itemTypeUsage.set(damage.itemType, usedCount + 1);

    const enchantment = item ? getEnchantment(item) : 0;
    const dragon = item ? isDragonMaterial(item) : false;

    let reimbursable: number;
    if (enchantment >= 8) {
      // High enchantment wins: 50% reimbursement
      reimbursable = damage.amount * 0.5;
    } else if (dragon) {
      // Dragon material: full reimbursement
      reimbursable = damage.amount;
    } else {
      // Standard: full reimbursement
      reimbursable = damage.amount;
    }

    // Apply deductible per damage event
    const itemPayout = Math.max(0, reimbursable - DEDUCTIBLE);
    rawPayout += itemPayout;
  }

  // Round down in MHPCO's favor
  const desiredPayout = Math.floor(rawPayout);

  // Apply cap
  const actualPayout = Math.min(desiredPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - actualPayout;

  return { payout: actualPayout, remainingCap };
}

/**
 * Computes insurance sum from a list of items.
 * Components are 250G each; main items use their defined values.
 */
export function computeInsuranceSum(items: Item[]): number {
  const mainItemValues: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
  };
  return items.reduce((sum, item) => {
    if (MAIN_ITEM_TYPES.has(item.type)) {
      return sum + (mainItemValues[item.type] ?? 0);
    }
    return sum + 250; // component value
  }, 0);
}
