export type Customer = {
  yearsWithMHPCO: number;
};

export type QuoteItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

/**
 * MHPCO price list: insurance value and base premium per item type.
 * Components (rune, moonstone) are insured at 250 G and pay a base
 * premium of 25 G; a block of exactly three alike components is a
 * separate policy decision handled by `computeComponentPremium`.
 */
export const ITEM_BASE_PREMIUM: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const PROCESSING_FEE = 5;

export function quote(_customer: Customer, items: QuoteItem[], _contractNumber: number): number {
  if (items.length === 0) return PROCESSING_FEE;
  const base = ITEM_BASE_PREMIUM[items[0].type] ?? 0;
  return base + PROCESSING_FEE;
}
