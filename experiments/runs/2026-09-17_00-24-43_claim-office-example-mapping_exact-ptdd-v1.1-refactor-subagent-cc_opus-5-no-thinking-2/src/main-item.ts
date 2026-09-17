import type { Item } from "./policy.js";
import type { ItemPricing } from "./premium-contribution.js";
import { combinedPricings } from "./premium-contribution.js";
import { basePremiumOf } from "./price-list.js";
import { riskSurchargeOf } from "./risk-surcharge.js";

/**
 * What one main item contributes: the price list's base premium, and the
 * item's own risk surcharges, which scale that same base premium.
 */
function priceMainItem(item: Item): ItemPricing {
  const basePremium = basePremiumOf(item);
  return {
    basePremium,
    riskSurcharges: riskSurchargeOf(item, basePremium),
  };
}

export function priceMainItems(mainItems: readonly Item[]): ItemPricing {
  return combinedPricings(mainItems.map(priceMainItem));
}
