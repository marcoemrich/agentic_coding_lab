export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteInput {
  customer: Customer;
  items: Item[];
  isFirstInsurance: boolean;
}

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.2;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_THRESHOLD_YEARS = 2;

function isComponent(itemType: string): boolean {
  return itemType === 'rune' || itemType === 'moonstone';
}

function getItemBasePremium(itemType: string): number {
  if (ITEM_BASE_PREMIUMS[itemType] !== undefined) {
    return ITEM_BASE_PREMIUMS[itemType];
  }
  if (isComponent(itemType)) {
    return COMPONENT_BASE_PREMIUM;
  }
  throw new Error(`Unknown item type: ${itemType}`);
}

function calculateComponentBlocks(items: Item[]): { basePremium: number; processedIndices: Set<number> } {
  let basePremium = 0;
  const processedIndices = new Set<number>();

  const componentsByType: Record<string, number[]> = {};
  items.forEach((item, index) => {
    if (isComponent(item.type)) {
      if (!componentsByType[item.type]) {
        componentsByType[item.type] = [];
      }
      componentsByType[item.type].push(index);
    }
  });

  for (const [_type, indices] of Object.entries(componentsByType)) {
    // Only apply block discount if count is a multiple of 3
    if (indices.length % 3 === 0) {
      // Apply blocks of 3
      for (let i = 0; i < indices.length; i += 3) {
        basePremium += COMPONENT_BLOCK_PREMIUM;
        processedIndices.add(indices[i]);
        processedIndices.add(indices[i + 1]);
        processedIndices.add(indices[i + 2]);
      }
    } else {
      // No blocks, charge all at regular price
      for (let i = 0; i < indices.length; i++) {
        basePremium += COMPONENT_BASE_PREMIUM;
        processedIndices.add(indices[i]);
      }
    }
  }

  return { basePremium, processedIndices };
}

export function calculateQuote(input: QuoteInput): number {
  const { customer, items, isFirstInsurance } = input;

  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  // Calculate base premium for components with block discounts
  const { basePremium: componentBasePremium, processedIndices } = calculateComponentBlocks(items);

  // Calculate total policy base premium and item modifiers
  let totalBasePremium = componentBasePremium;
  let totalModifiers = 0;

  // Add regular items with their modifiers
  for (let i = 0; i < items.length; i++) {
    if (!processedIndices.has(i)) {
      const item = items[i];
      const itemBase = getItemBasePremium(item.type);
      totalBasePremium += itemBase;

      if (item.cursed) {
        totalModifiers += itemBase * CURSE_SURCHARGE;
      }

      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        totalModifiers += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
      }
    }
  }

  let policyPremium = totalBasePremium + totalModifiers;

  // Apply policy-wide modifiers
  // Loyalty discount (20% of policy base premium for customers with >= 2 years)
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyPremium -= totalBasePremium * LOYALTY_DISCOUNT;
  }

  // First insurance surcharge (10% of policy base premium, always applies for items)
  policyPremium += totalBasePremium * FIRST_INSURANCE_SURCHARGE;

  // Follow-up contract discount (15% of policy base premium, applies for non-first contracts)
  if (!isFirstInsurance) {
    policyPremium -= totalBasePremium * FOLLOW_UP_DISCOUNT;
  }

  // Add processing fee
  const finalPremium = policyPremium + PROCESSING_FEE;

  // Round up to favor MHPCO
  return Math.ceil(finalPremium);
}
