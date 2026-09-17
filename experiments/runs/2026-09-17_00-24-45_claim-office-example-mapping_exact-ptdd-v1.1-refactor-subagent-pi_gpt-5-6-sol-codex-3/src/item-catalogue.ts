const ITEM_BASE_PREMIUM_G: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const ITEM_INSURANCE_VALUE_G: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export function itemBasePremium(itemType: string): number {
  const premium = ITEM_BASE_PREMIUM_G[itemType];
  if (premium === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return premium;
}

export function itemInsuranceValue(itemType: string): number {
  const value = ITEM_INSURANCE_VALUE_G[itemType];
  if (value === undefined) throw new Error(`Unknown item type: ${itemType}`);
  return value;
}

