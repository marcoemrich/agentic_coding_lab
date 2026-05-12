export interface Item {
  type: "sword" | "amulet" | "staff" | "potion" | "component";
  material: string;
  enchantment: number;
  cursed: boolean;
}

export interface QuoteInput {
  yearsWithMHPCO: number;
  items: Item[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const PROCESSING_FEE = 5;

const applySurcharges = (item: Item, premium: number): number => {
  let surchargedPremium = premium;

  // Apply cursed surcharge (50%)
  if (item.cursed) {
    surchargedPremium *= 1.5;
  }

  // Apply enchantment surcharge for highly enchanted items (level >= 5, 30%)
  if (item.enchantment >= 5) {
    surchargedPremium *= 1.3;
  }

  return surchargedPremium;
};

const calculateItemPremium = (items: Item[]): number => {
  // Check for 3 identical components building block
  if (
    items.length === 3 &&
    items.every((item) => item.type === "component")
  ) {
    return 60; // Building block premium
  }

  const itemType = items[0]?.type;
  const basePremium = BASE_PREMIUMS[itemType ?? ""] ?? 0;

  if (!items[0]) {
    return basePremium;
  }

  return applySurcharges(items[0], basePremium);
};

export const calculateQuote = (input: QuoteInput): number => {
  let itemPremium = calculateItemPremium(input.items);

  // Apply loyalty discount for long-standing customers (>= 2 years, 20%)
  if (input.yearsWithMHPCO >= 2) {
    itemPremium *= 0.8;
  }

  return itemPremium + PROCESSING_FEE;
};
