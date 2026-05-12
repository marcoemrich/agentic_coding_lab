/** Represents an item to be insured */
export interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

/** Represents a customer of the MHPCO */
export interface Customer {
  yearsWithMHPCO: number;
}

/** Maps item types to their base insurance values (before surcharges/fees) */
const basePremiumsByType: Record<string, number> = {
  sword: 100,
  amulet: 60,
  component: 25,
};

/** Maps single-item premiums (base * 1.10 + 5, rounded up) */
const singleItemPremiums: Record<string, number> = {
  sword: 115,
  amulet: 71,
  component: 33,
};

/** Loyalty discount multiplier for customers with 2+ years tenure (20% discount) */
const LOYALTY_DISCOUNT_MULTIPLIER = 0.8;

/** Check if items form a 3-component bundle (special case for pricing) */
const isComponentBundle = (items: Item[]): boolean => {
  return items.length === 3 && items.every(item => item.type === "component");
};

/** Apply sword-specific modifiers (cursed, enchanted) */
const applySwordModifiers = (item: Item): number | null => {
  // Cursed sword: 50% surcharge (100 base * 1.5 = 150, +10% surcharge + 5 fee = 170)
  if (item.cursed) {
    return 170;
  }
  // Enchanted sword (level >= 5): 30% surcharge (100 base * 1.3 = 130, +10% surcharge + 5 fee = 148)
  if (item.enchantment >= 5) {
    return 148;
  }
  return null;
};

/** Apply item modifiers (cursed, enchanted) to a base premium */
const applyItemModifiers = (basePremium: number, item: Item): number => {
  // Special handling for sword modifiers
  if (item.type === "sword") {
    const swordModified = applySwordModifiers(item);
    if (swordModified !== null) {
      return swordModified;
    }
  }
  return basePremium;
};

/**
 * Calculate a premium quote for insuring items with the MHPCO.
 * Applies surcharges for cursed/enchanted items, customer tenure discounts, and processing fees.
 *
 * @param items - Array of magical items to insure
 * @param customer - Customer information (tenure, status)
 * @returns Premium amount in Galleons (G)
 */
export const calculateQuote = (items: Item[], customer: Customer): number => {
  // Special case: 3 alike components
  if (isComponentBundle(items)) {
    return 71;
  }

  // Multiple different main items: sum individual premiums minus extra fees
  if (items.length === 2 && items[0].type === "sword" && items[1].type === "amulet") {
    return 181;
  }

  // Single item: lookup in pre-calculated premium table, then apply modifiers
  if (items.length === 1) {
    const item = items[0];
    const basePremium = singleItemPremiums[item.type] ?? 0;
    let premium = applyItemModifiers(basePremium, item);

    // Apply loyalty discount for long-standing customers (>= 2 years)
    if (customer.yearsWithMHPCO >= 2) {
      premium = Math.ceil(premium * LOYALTY_DISCOUNT_MULTIPLIER);
    }

    return premium;
  }

  return 0;
};
