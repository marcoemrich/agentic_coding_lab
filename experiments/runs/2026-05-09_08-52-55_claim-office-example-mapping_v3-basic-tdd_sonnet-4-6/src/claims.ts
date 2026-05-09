import type { ItemInput, IncidentInput, Policy, ClaimResult } from "./types.js";

const KNOWN_ITEM_TYPES = new Set([
  "sword", "amulet", "staff", "potion", "rune", "moonstone",
]);

const DEDUCTIBLE = 100;

function computeDamageReimbursement(item: ItemInput, damageAmount: number): number {
  const enchantment = item.enchantment ?? 0;
  const isHighEnchantment = enchantment >= 8;

  let reimbursementRate: number;
  if (isHighEnchantment) {
    // High-enchantment clause: 50% reimbursement (wins over dragon material)
    reimbursementRate = 0.5;
  } else {
    // Full reimbursement (includes dragon material, which is also full)
    reimbursementRate = 1.0;
  }

  return damageAmount * reimbursementRate - DEDUCTIBLE;
}

/**
 * Process a claim against a policy.
 * Throws if the damage entries are invalid.
 * Returns the payout and updated remainingCap.
 * Note: does NOT mutate the policy; caller must update remainingCap.
 */
export function processClaim(policy: Policy, incident: IncidentInput): ClaimResult {
  // Validate damage amounts
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!KNOWN_ITEM_TYPES.has(damage.itemType)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
  }

  // Count insured items by type
  const insuredCounts = new Map<string, number>();
  for (const item of policy.items) {
    insuredCounts.set(item.type, (insuredCounts.get(item.type) ?? 0) + 1);
  }

  // Count damage entries by type
  const damageCounts = new Map<string, number>();
  for (const damage of incident.damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }

  // Validate: damage entries must reference insured items, and count must not exceed insured count
  for (const [itemType, count] of damageCounts) {
    const insuredCount = insuredCounts.get(itemType) ?? 0;
    if (insuredCount === 0) {
      throw new Error(`Item type not in policy: ${itemType}`);
    }
    if (count > insuredCount) {
      throw new Error(
        `More damage entries (${count}) for ${itemType} than insured (${insuredCount})`
      );
    }
  }

  // Build a lookup for insured items by type (for enchantment/material lookups)
  // Use items in order so multiple of same type are matched in order
  const itemsByType = new Map<string, ItemInput[]>();
  for (const item of policy.items) {
    if (!itemsByType.has(item.type)) {
      itemsByType.set(item.type, []);
    }
    itemsByType.get(item.type)!.push(item);
  }

  // Track which items we've used (index per type)
  const usedIndices = new Map<string, number>();

  // Compute raw payout (before cap)
  let rawPayout = 0;
  for (const damage of incident.damages) {
    const items = itemsByType.get(damage.itemType)!;
    const idx = usedIndices.get(damage.itemType) ?? 0;
    const item = items[idx]!;
    usedIndices.set(damage.itemType, idx + 1);

    const itemPayout = computeDamageReimbursement(item, damage.amount);
    rawPayout += itemPayout;
  }

  // Apply cap
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;

  return { payout, remainingCap };
}

/**
 * Compute the insurance sum and cap for a list of items.
 */
export function computeInsuranceSum(items: ItemInput[]): number {
  const INSURANCE_VALUES: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250,
  };

  return items.reduce((sum, item) => {
    const value = INSURANCE_VALUES[item.type];
    if (value === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    return sum + value;
  }, 0);
}

export function createPolicy(items: ItemInput[]): Policy {
  const insuranceSum = computeInsuranceSum(items);
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}
