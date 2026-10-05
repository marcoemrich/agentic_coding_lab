const COMPONENT_PRICE = { base: 25, value: 250 };
export const prices: Record<string, { base: number; value: number }> = {
  sword: { base: 100, value: 1000 },
  amulet: { base: 60, value: 600 },
  staff: { base: 80, value: 800 },
  potion: { base: 40, value: 400 },
  rune: { ...COMPONENT_PRICE },
  moonstone: { ...COMPONENT_PRICE },
};

function requireKnownItemType(type: string): void {
  if (!Object.hasOwn(prices, type)) throw new Error(`Unknown item type: ${type}`);
}

export function basePremiumForItemType(type: string): number {
  requireKnownItemType(type);
  return prices[type].base;
}

export function insuranceValueForItemType(type: string): number {
  return prices[type].value;
}
