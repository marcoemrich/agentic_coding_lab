import type { Item, ItemType } from "./types";

const ITEM_PRICES: Record<ItemType, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

export function getItemPrice(type: ItemType): {
  insuranceValue: number;
  basePremium: number;
} | null {
  return ITEM_PRICES[type] || null;
}

export function isComponent(type: ItemType): boolean {
  return type === "rune" || type === "moonstone";
}

export function calculateComponentBlockPremium(items: Item[]): number {
  const grouped = groupComponentsByType(items);
  let totalPremium = 0;

  for (const [, items] of grouped) {
    if (items.length === 3) {
      totalPremium += 60;
    } else {
      totalPremium += items.length * 25;
    }
  }

  return totalPremium;
}

function groupComponentsByType(items: Item[]): Map<ItemType, Item[]> {
  const grouped = new Map<ItemType, Item[]>();
  for (const item of items) {
    if (!grouped.has(item.type)) {
      grouped.set(item.type, []);
    }
    grouped.get(item.type)!.push(item);
  }
  return grouped;
}

export function calculateBasePremium(items: Item[]): number {
  let totalPremium = 0;
  const components: Item[] = [];
  const mainItems: Item[] = [];

  // Separate main items from components
  for (const item of items) {
    if (isComponent(item.type)) {
      components.push(item);
    } else {
      mainItems.push(item);
    }
  }

  // Add main item premiums
  for (const item of mainItems) {
    const price = getItemPrice(item.type);
    if (!price) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    totalPremium += price.basePremium;
  }

  // Add component premiums
  totalPremium += calculateComponentBlockPremium(components);

  return totalPremium;
}

export function calculateInsuranceSum(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const price = getItemPrice(item.type);
    if (!price) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    total += price.insuranceValue;
  }
  return total;
}

export function calculateItemModifier(item: Item): number {
  let modifier = 0;

  // Cursed surcharge: 50% of item's base premium
  if (item.cursed) {
    const price = getItemPrice(item.type);
    if (price) {
      modifier += price.basePremium * 0.5;
    }
  }

  // High enchantment surcharge: 30% (if enchantment >= 5)
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    const price = getItemPrice(item.type);
    if (price) {
      modifier += price.basePremium * 0.3;
    }
  }

  return modifier;
}

export function calculatePolicyModifier(
  policyBasePremium: number,
  yearsWithMHPCO: number,
  isFirstInsurance: boolean,
  isFollowUpContract: boolean
): number {
  let modifier = 0;

  // Long-standing customer loyalty discount: 20% (if >= 2 years)
  if (yearsWithMHPCO >= 2) {
    modifier -= policyBasePremium * 0.2;
  }

  // First insurance surcharge: 10%
  if (isFirstInsurance) {
    modifier += policyBasePremium * 0.1;
  }

  // Follow-up contract discount: 15%
  if (isFollowUpContract) {
    modifier -= policyBasePremium * 0.15;
  }

  return modifier;
}

export function calculatePremium(
  items: Item[],
  yearsWithMHPCO: number,
  isFirstInsurance: boolean,
  isFollowUpContract: boolean
): number {
  // Calculate base premium for all items
  const basePremium = calculateBasePremium(items);

  // Calculate item-specific modifiers (cursed, high enchantment)
  let itemModifiers = 0;
  for (const item of items) {
    itemModifiers += calculateItemModifier(item);
  }

  // Calculate policy-wide modifiers
  const policyModifiers = calculatePolicyModifier(
    basePremium,
    yearsWithMHPCO,
    isFirstInsurance,
    isFollowUpContract
  );

  // Total premium before fee
  const subtotal = basePremium + itemModifiers + policyModifiers;

  // Add processing fee
  const totalWithFee = subtotal + 5;

  // Round up in MHPCO's favor (ceiling for premiums)
  return Math.ceil(totalWithFee);
}
