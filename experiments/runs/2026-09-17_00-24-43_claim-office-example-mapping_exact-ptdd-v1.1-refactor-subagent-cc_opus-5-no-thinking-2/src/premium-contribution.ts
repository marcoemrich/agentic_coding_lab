/**
 * What insured items contribute to a premium, before policy-wide modifiers.
 *
 * The two contributions are kept apart all the way up because policy-wide
 * modifiers scale only the policy base premium: a risk surcharge has already
 * been assessed against its own item and must not be scaled again.
 */
export interface ItemPricing {
  /** Sum of item base premiums -- the policy base premium. */
  readonly basePremium: number;
  /** Item-specific risk surcharges, each on its own item's base premium. */
  readonly riskSurcharges: number;
}

/** An item that contributes nothing -- the identity for combining pricings. */
export const NO_PRICING: ItemPricing = { basePremium: 0, riskSurcharges: 0 };

/**
 * Pricings combine by adding each contribution separately: base premiums
 * accumulate into the policy base premium, and risk surcharges accumulate
 * alongside it, because policy-wide modifiers scale only the former.
 */
export function combinedPricing(
  left: ItemPricing,
  right: ItemPricing,
): ItemPricing {
  return {
    basePremium: left.basePremium + right.basePremium,
    riskSurcharges: left.riskSurcharges + right.riskSurcharges,
  };
}

/** What a whole group of priced items contributes, combined. */
export function combinedPricings(
  pricings: readonly ItemPricing[],
): ItemPricing {
  return pricings.reduce(combinedPricing, NO_PRICING);
}
