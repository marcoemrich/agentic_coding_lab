import {
  COMPONENT_INSURANCE_VALUE,
  componentsBasePremium,
  isComponent,
} from "./component-price-rules.js";
import { priceMainItems } from "./main-item.js";
import type { Item } from "./policy.js";
import type { ItemPricing } from "./premium-contribution.js";
import { combinedPricing } from "./premium-contribution.js";
import { insuranceValueOf as mainItemInsuranceValueOf } from "./price-list.js";

/**
 * The MHPCO insures two kinds of thing, and each kind is governed by its own
 * price rules: main items follow the price list, components may form blocks.
 * Both of a kind's figures -- what insuring it costs and what it is insured
 * for -- come from those same rules, as the spec states them together.
 *
 * This module is the one place that decides which rules govern an item, so
 * that a new kind of insurable thing is added here and nowhere else.
 */

/**
 * Components are insured at a flat rate and carry no item-specific risk:
 * a rune has neither an enchantment level nor a material to be cursed.
 */
function priceComponents(components: readonly Item[]): ItemPricing {
  return {
    basePremium: componentsBasePremium(components),
    riskSurcharges: 0,
  };
}

/**
 * Pricing is decided per kind rather than per item, because a kind's rules
 * may look at the whole group: three alike components form a block only
 * when they are priced together.
 */
export function priceItems(items: readonly Item[]): ItemPricing {
  return combinedPricing(
    priceMainItems(items.filter((item) => !isComponent(item))),
    priceComponents(items.filter(isComponent)),
  );
}

/** What the rules governing this item's kind state it is insured for. */
export function insuranceValueOf(item: Item): number {
  return isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : mainItemInsuranceValueOf(item);
}
