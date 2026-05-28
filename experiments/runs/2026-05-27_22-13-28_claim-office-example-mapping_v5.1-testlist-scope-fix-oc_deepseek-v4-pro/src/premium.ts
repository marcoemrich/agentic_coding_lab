export type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";

export interface Item {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const BASE_PREMIUM: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES: ItemType[] = ["rune", "moonstone"];

export function calculatePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  for (const item of items) {
    if (!BASE_PREMIUM[item.type]) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  const componentCounts: Record<string, number> = {};
  let basePremium = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const bp = BASE_PREMIUM[item.type];
      basePremium += bp;
      if (item.cursed) {
        itemSurcharges += bp * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        itemSurcharges += bp * 0.3;
      }
    }
  }

  for (const type of Object.keys(componentCounts)) {
    const count = componentCounts[type];
    const bp = BASE_PREMIUM[type as ItemType];
    if (count === 3) {
      basePremium += 60;
    } else {
      basePremium += count * bp;
    }
  }

  const firstInsurance = basePremium * 0.1;
  let loyaltyDiscount = 0;
  if (yearsWithMHPCO >= 2) {
    loyaltyDiscount = basePremium * 0.2;
  }
  const followUpDiscount = isFollowUp ? basePremium * 0.15 : 0;
  const total = basePremium + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + 5;

  return Math.ceil(total);
}