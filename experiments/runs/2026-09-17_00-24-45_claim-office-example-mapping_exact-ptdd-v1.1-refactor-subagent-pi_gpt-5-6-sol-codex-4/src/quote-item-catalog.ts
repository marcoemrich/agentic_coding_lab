export const COMPONENT_BASE_PREMIUM = 25;

export const COMPONENT_TYPES = ["rune", "moonstone"] as const;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

interface QuoteItem {
  type: string;
}

export function isComponentType(type: string): boolean {
  return COMPONENT_TYPES.some((componentType) => componentType === type);
}

export function quoteItemBasePremium(item: QuoteItem): number {
  return isComponentType(item.type) ? COMPONENT_BASE_PREMIUM : MAIN_ITEM_BASE_PREMIUM[item.type];
}

export function validateQuoteItemTypes(items: QuoteItem[]): void {
  const unknown = items.find(
    (item) => !isComponentType(item.type) && MAIN_ITEM_BASE_PREMIUM[item.type] === undefined,
  );
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
}
