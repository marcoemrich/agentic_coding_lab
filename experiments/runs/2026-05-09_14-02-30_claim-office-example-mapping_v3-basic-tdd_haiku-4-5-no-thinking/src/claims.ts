import type { Item, Damage, ClaimIncident } from "./types";

const DEDUCTIBLE = 100;

function getEnchantmentReducedPayout(item: Item, damage: number): number {
  // If enchantment >= 8, reduce to 50%
  if (item.enchantment !== undefined && item.enchantment >= 8) {
    return Math.floor(damage * 0.5);
  }
  return damage;
}

function getDragonMaterialPayout(item: Item, damage: number): number {
  // Dragon material gets full reimbursement
  if (item.material === "dragon") {
    return damage;
  }
  return null as any; // Not applicable
}

export function calculateDamagePayout(item: Item, damageAmount: number): number {
  let payout = damageAmount;

  // Check for enchantment clause (>= 8 → 50%)
  const dragonMaterial = item.material === "dragon";
  const hasHighEnchantment = item.enchantment !== undefined && item.enchantment >= 8;

  if (dragonMaterial && hasHighEnchantment) {
    // Both apply: 50% rule wins
    payout = Math.floor(payout * 0.5);
  } else if (dragonMaterial) {
    // Dragon material: full reimbursement
    payout = payout;
  } else if (hasHighEnchantment) {
    // High enchantment: 50% reduction
    payout = Math.floor(payout * 0.5);
  }

  // Apply deductible after damage reduction
  payout = Math.max(0, payout - DEDUCTIBLE);

  // Round down in customer's disfavor (floor)
  return Math.floor(payout);
}

export function validateClaimAgainstPolicy(
  policyItems: Item[],
  damages: Damage[]
): boolean {
  // Count items by type in policy
  const policyItemCounts = new Map<string, number>();
  for (const item of policyItems) {
    const key = item.type;
    policyItemCounts.set(key, (policyItemCounts.get(key) || 0) + 1);
  }

  // Count damage claims by type
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    const key = damage.itemType;
    damageCounts.set(key, (damageCounts.get(key) || 0) + 1);
  }

  // Validate each damage claim has corresponding item
  for (const [itemType, count] of damageCounts) {
    const policyCount = policyItemCounts.get(itemType) || 0;
    if (count > policyCount) {
      throw new Error(`Damage claim for ${itemType} exceeds policy coverage`);
    }
  }

  return true;
}

export function validateDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
}

export function processClaim(
  policyItems: Item[],
  incident: ClaimIncident,
  currentCapRemaining: number
): { payout: number; remainingCap: number } {
  validateDamageAmounts(incident.damages);
  validateClaimAgainstPolicy(policyItems, incident.damages);

  // Find matching items for each damage claim and calculate payouts
  const itemCountByType = new Map<string, Item[]>();
  for (const item of policyItems) {
    const key = item.type;
    if (!itemCountByType.has(key)) {
      itemCountByType.set(key, []);
    }
    itemCountByType.get(key)!.push(item);
  }

  let totalPayout = 0;

  // Track which items we've used for claims
  const usedItemIndices = new Set<number>();

  for (const damage of incident.damages) {
    const items = itemCountByType.get(damage.itemType) || [];
    let itemFound = false;

    for (const item of items) {
      const payout = calculateDamagePayout(item, damage.amount);
      totalPayout += payout;
      itemFound = true;
      break; // Use first available item of that type
    }

    if (!itemFound) {
      throw new Error(`No item of type ${damage.itemType} found in policy`);
    }
  }

  // Apply cap
  const cappedPayout = Math.min(totalPayout, currentCapRemaining);
  const remainingCap = Math.max(0, currentCapRemaining - cappedPayout);

  return { payout: cappedPayout, remainingCap };
}
