import type { Customer, Item, ItemType, Policy, Incident, ClaimResult } from './types.js';

// ─── Price Lists ──────────────────────────────────────────────────────────────

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60; // exactly 3 alike components
const COMPONENT_INSURANCE_VALUE = 250;

const COMPONENT_TYPES = new Set<string>(['rune', 'moonstone']);
const VALID_ITEM_TYPES = new Set<string>(['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone']);

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function validateItemType(type: string): void {
  if (!VALID_ITEM_TYPES.has(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

// ─── Quote / Premium Calculation ─────────────────────────────────────────────

/**
 * Compute the base premium for an item (before item-level modifiers).
 * Components are grouped by type; a group of exactly 3 gets the block discount.
 */
function computeItemBasePremiums(items: Item[]): number[] {
  // Separate main items from components
  const mainItems = items.filter(i => !isComponent(i.type));
  const componentItems = items.filter(i => isComponent(i.type));

  // Group components by type
  const componentGroups = new Map<string, number>();
  for (const item of componentItems) {
    componentGroups.set(item.type, (componentGroups.get(item.type) ?? 0) + 1);
  }

  // Compute component base premiums per group
  const componentGroupPremiums = new Map<string, number>();
  for (const [type, count] of componentGroups) {
    let premium: number;
    if (count === 3) {
      premium = COMPONENT_BLOCK_PREMIUM; // exactly 3: block discount
    } else {
      premium = count * COMPONENT_BASE_PREMIUM;
    }
    componentGroupPremiums.set(type, premium);
  }

  // Distribute component premiums back to individual items (proportionally)
  // For the purpose of item-level modifier application, we need per-item base premium.
  // Components don't have enchantment or cursed modifiers per the rules
  // (they have no enchantment level or material, so no special clause applies).
  // So we just need the total for each component type.

  const premiums: number[] = [];
  const componentTypeSeen = new Map<string, number>(); // count of already processed

  for (const item of items) {
    validateItemType(item.type);
    if (isComponent(item.type)) {
      const count = componentGroups.get(item.type)!;
      const groupPremium = componentGroupPremiums.get(item.type)!;
      // Distribute evenly; last item in group gets remainder
      const seen = componentTypeSeen.get(item.type) ?? 0;
      const perItem = groupPremium / count;
      componentTypeSeen.set(item.type, seen + 1);
      premiums.push(perItem);
    } else {
      premiums.push(MAIN_ITEM_BASE_PREMIUM[item.type]);
    }
  }

  return premiums;
}

/**
 * Compute the total premium for insuring the given items for the given customer.
 *
 * Premium calculation order:
 * 1. Compute base premium per item (components may get block discount)
 * 2. Apply item-level modifiers (cursed +50%, high enchantment ≥5 +30%)
 *    These add to the base premium of the affected item.
 * 3. Sum all adjusted item premiums → policySum
 * 4. Compute policyBase = sum of raw item base premiums (before item modifiers)
 * 5. Apply policy-wide modifiers to policyBase:
 *    - loyalty (≥2 years): -20%
 *    - first insurance (each item in quote): +10%  [applied to policyBase]
 *    - follow-up contract (contractCount ≥ 1): -15%
 * 6. final = policySum + sum(policy-wide modifier amounts) + 5 fee
 * 7. Round up (ceiling) to nearest integer
 */
export function computePremium(customer: Customer, items: Item[]): number {
  // Validate all item types
  for (const item of items) {
    validateItemType(item.type);
  }

  if (items.length === 0) {
    return 5; // only processing fee
  }

  const itemBasePremiums = computeItemBasePremiums(items);
  const policyBase = itemBasePremiums.reduce((sum, p) => sum + p, 0);

  // Apply item-level modifiers
  let policySum = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let itemPremium = itemBasePremiums[i];
    if (item.cursed) {
      itemPremium += itemBasePremiums[i] * 0.5;
    }
    if (item.enchantment >= 5) {
      itemPremium += itemBasePremiums[i] * 0.3;
    }
    policySum += itemPremium;
  }

  // Policy-wide modifiers applied to policyBase
  let policyModifiers = 0;
  if (customer.yearsWithMHPCO >= 2) {
    policyModifiers -= policyBase * 0.2; // loyalty discount
  }
  // First insurance surcharge: applies to every quote (each item treated as first insurance)
  policyModifiers += policyBase * 0.1;
  // Follow-up contract discount
  if (customer.contractCount >= 1) {
    policyModifiers -= policyBase * 0.15;
  }

  const total = policySum + policyModifiers + 5;
  return Math.ceil(total);
}

// ─── Insurance Value Calculation ─────────────────────────────────────────────

export function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    if (isComponent(item.type)) {
      return sum + COMPONENT_INSURANCE_VALUE;
    }
    return sum + MAIN_ITEM_INSURANCE_VALUE[item.type];
  }, 0);
}

// ─── Claim Processing ─────────────────────────────────────────────────────────

const DEDUCTIBLE = 100;

/**
 * Process a claim against a policy.
 * Returns payout and updated remainingCap.
 * Mutates policy.remainingCap.
 */
export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  // Validate damages
  for (const damage of incident.damages) {
    if (!VALID_ITEM_TYPES.has(damage.itemType as string)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }

  // Count items in policy by type
  const policyCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyCounts.set(item.type, (policyCounts.get(item.type) ?? 0) + 1);
  }

  // Count damages by type
  const damageCounts = new Map<string, number>();
  for (const damage of incident.damages) {
    damageCounts.set(damage.itemType as string, (damageCounts.get(damage.itemType as string) ?? 0) + 1);
  }

  // Validate: damage types must be covered and counts must not exceed policy
  for (const [type, count] of damageCounts) {
    const covered = policyCounts.get(type) ?? 0;
    if (covered === 0) {
      throw new Error(`Item type ${type} is not covered by this policy`);
    }
    if (count > covered) {
      throw new Error(`More damage entries (${count}) for ${type} than covered (${covered})`);
    }
  }

  // Build a map from item type to list of matching policy items (for enchantment/material lookup)
  const policyItemsByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = policyItemsByType.get(item.type) ?? [];
    list.push(item);
    policyItemsByType.set(item.type, list);
  }

  // Track which items we've already used for claims (by index)
  const usedItemIndices = new Map<string, number>(); // type -> next index to use

  // Process each damage
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const type = damage.itemType as string;
    const itemList = policyItemsByType.get(type)!;
    const useIdx = usedItemIndices.get(type) ?? 0;
    const item = itemList[useIdx];
    usedItemIndices.set(type, useIdx + 1);

    const rawAmount = damage.amount;
    let reimbursable: number;

    const highEnchantment = item.enchantment >= 8;
    const dragonMaterial = item.material === 'dragon';

    if (highEnchantment) {
      // 50% of damage (wins over dragon clause)
      reimbursable = rawAmount * 0.5;
    } else if (dragonMaterial) {
      // full reimbursement
      reimbursable = rawAmount;
    } else {
      // standard: full reimbursement
      reimbursable = rawAmount;
    }

    const payout = Math.max(0, reimbursable - DEDUCTIBLE);
    totalPayout += payout;
  }

  // Apply cap
  const actualPayout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  const newRemainingCap = policy.remainingCap - actualPayout;

  return {
    payout: actualPayout,
    remainingCap: newRemainingCap,
  };
}
