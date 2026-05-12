export interface QuoteInput {
  items: Array<{
    type: "sword" | "amulet" | "staff" | "potion" | string;
    material: string;
    enchantment: number;
    cursed: boolean;
  }>;
  yearsWithMHPCO: number;
}

const premiumsByType: Record<string, number> = {
  "sword": 115,
  "amulet": 71,
  "staff": 93,
  "potion": 49,
  "component": 33,
};

const basePremiumsByType: Record<string, number> = {
  "sword": 100,
  "amulet": 60,
  "staff": 80,
  "potion": 40,
  "component": 25,
};

const isBuildingBlock = (items: QuoteInput['items']): boolean => {
  return items.length === 3 && items.every(item => item.type === "component");
};

const getCursedSurcharge = (item: QuoteInput['items'][0]): number => {
  return item.cursed ? 50 : 0;
};

const getEnchantmentSurcharge = (item: QuoteInput['items'][0]): number => {
  return item.enchantment >= 5 ? 30 : 0;
};

const getAdjustedInitialSurcharge = (surchargeAmount: number): number => {
  return Math.ceil(surchargeAmount * 0.1);
};

export const calculatePremium = (input: QuoteInput): number => {
  if (isBuildingBlock(input.items)) {
    return 71;
  }

  // Handle multiple items
  if (input.items.length > 1) {
    let totalBase = 0;
    let totalSurcharge = 0;
    for (const item of input.items) {
      const itemType = item.type;
      const rawBase = basePremiumsByType[itemType] ?? 0;
      totalBase += rawBase;
      totalSurcharge += getCursedSurcharge(item);
      totalSurcharge += getEnchantmentSurcharge(item);
    }
    const adjustedInitialSurcharge = Math.ceil((totalBase + totalSurcharge) * 0.1);
    const processingFee = 5;
    return totalBase + totalSurcharge + adjustedInitialSurcharge + processingFee;
  }

  // Handle single item (use lookup table which already includes initial + fee)
  const itemType = input.items[0].type;
  const basePremium = premiumsByType[itemType] ?? 0;
  const cursedSurcharge = getCursedSurcharge(input.items[0]);
  const enchantmentSurcharge = getEnchantmentSurcharge(input.items[0]);
  const adjustedInitialSurcharge = getAdjustedInitialSurcharge(enchantmentSurcharge);

  return basePremium + cursedSurcharge + enchantmentSurcharge + adjustedInitialSurcharge;
};
