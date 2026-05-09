import type { Item, Customer, Policy, QuoteResult, Incident, ClaimResult, ItemType } from './types';

const ITEM_PRICES: Record<ItemType, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 }
};

const PROCESSING_FEE = 5;
const CURSE_SURCHARGE = 0.5;
const ENCHANTMENT_SURCHARGE = 0.3;
const ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;

function isComponentType(type: ItemType): boolean {
  return type === 'rune' || type === 'moonstone';
}

function calculateBasePremium(items: Item[]): number {
  const componentGroups: Record<string, number> = {};
  let totalBasePremium = 0;

  for (const item of items) {
    if (!ITEM_PRICES[item.type]) {
      throw new Error(`Unknown item type: ${item.type}`);
    }

    if (isComponentType(item.type)) {
      componentGroups[item.type] = (componentGroups[item.type] || 0) + 1;
    } else {
      totalBasePremium += ITEM_PRICES[item.type].basePremium;
    }
  }

  // Process component groups with block discounts
  // Block only applies for exactly 3 of the same type
  for (const [type, count] of Object.entries(componentGroups)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      totalBasePremium += COMPONENT_BLOCK_PREMIUM;
    } else {
      totalBasePremium += count * ITEM_PRICES[type as ItemType].basePremium;
    }
  }

  return totalBasePremium;
}

function calculateItemModifiers(item: Item): number {
  let modifier = 0;

  if (item.cursed) {
    modifier += ITEM_PRICES[item.type].basePremium * CURSE_SURCHARGE;
  }

  if (item.enchantment >= ENCHANTMENT_THRESHOLD) {
    modifier += ITEM_PRICES[item.type].basePremium * ENCHANTMENT_SURCHARGE;
  }

  return modifier;
}


export function calculateQuote(
  customer: Customer,
  items: Item[],
  isFollowUp: boolean = false
): QuoteResult {
  // Calculate base premium for items
  const basePremium = calculateBasePremium(items);

  // Add item-specific modifiers (cursed, high enchantment)
  let itemModifiers = 0;
  for (const item of items) {
    itemModifiers += calculateItemModifiers(item);
  }

  // Calculate policy-wide modifiers based on base premium
  let policyModifiers = 0;

  // First insurance: 10% of base premium
  policyModifiers += basePremium * FIRST_INSURANCE_SURCHARGE;

  // Follow-up contract: 15% discount on base premium
  if (isFollowUp) {
    policyModifiers -= basePremium * FOLLOW_UP_DISCOUNT;
  }

  // Loyalty discount: 20% of base premium for customers with >= 2 years
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    policyModifiers -= basePremium * LOYALTY_DISCOUNT;
  }

  const subtotalBeforeFee = basePremium + itemModifiers + policyModifiers;
  const premium = Math.ceil(subtotalBeforeFee + PROCESSING_FEE);

  // Calculate insurance sum and cap
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += ITEM_PRICES[item.type].insuranceValue;
  }

  const policy: Policy = {
    insuranceSum,
    cap: insuranceSum * CAP_MULTIPLIER,
    items,
    remainingCap: insuranceSum * CAP_MULTIPLIER
  };

  return { premium, policy };
}

function getItemByType(items: Item[], type: ItemType, count: number = 1): Item | undefined {
  let found = 0;
  for (const item of items) {
    if (item.type === type) {
      found++;
      if (found === count) {
        return item;
      }
    }
  }
  return undefined;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let totalPayout = 0;
  const damageTypeCount: Record<ItemType, number> = {};

  // Validate damages
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }

    damageTypeCount[damage.itemType] = (damageTypeCount[damage.itemType] || 0) + 1;

    // Check if item exists in policy
    const itemCount = policy.items.filter((item) => item.type === damage.itemType).length;
    if (damageTypeCount[damage.itemType] > itemCount) {
      throw new Error(
        `Damage claim for item type ${damage.itemType} exceeds insured quantity`
      );
    }

    // Get the corresponding item from policy
    const item = getItemByType(policy.items, damage.itemType, damageTypeCount[damage.itemType]);
    if (!item) {
      throw new Error(`Item type ${damage.itemType} not found in policy`);
    }
  }

  // Calculate payouts
  for (let i = 0; i < incident.damages.length; i++) {
    const damage = incident.damages[i];
    const item = getItemByType(policy.items, damage.itemType, damageTypeCount[damage.itemType]);

    if (!item) {
      throw new Error(`Item type ${damage.itemType} not found in policy`);
    }

    let reimbursement = damage.amount;

    // Apply special reimbursement clauses
    // When both clauses apply, use the most restrictive (50% wins over 100%)
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      reimbursement = damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT;
    }

    if (item.material === 'dragon' && item.enchantment < HIGH_ENCHANTMENT_THRESHOLD) {
      // Full reimbursement for dragon material (only if high enchantment doesn't apply)
      reimbursement = damage.amount;
    }

    // Apply deductible
    const payout = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += payout;
  }

  // Apply cap
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - cappedPayout;

  return {
    payout: Math.floor(cappedPayout),
    remainingCap
  };
}
