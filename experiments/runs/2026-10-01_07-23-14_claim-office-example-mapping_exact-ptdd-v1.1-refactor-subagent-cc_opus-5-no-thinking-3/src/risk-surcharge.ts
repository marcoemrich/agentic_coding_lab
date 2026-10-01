import { type Item, surchargeableBasePremiumOf } from "./price-list.js";

// The MHPCO's risk-surcharge clauses: how much the office adds to an item's
// own base premium for the hazards the item itself carries. Each clause is
// keyed on an attribute of the insured item and the clauses stack. These
// clauses change with the office's underwriting risk policy, independently of
// the discounts it grants for customer standing.
//
// This is the quote-side counterpart of the reimbursement clauses, which are
// keyed on the same kind of attribute but decide what the office pays out.

const CURSE_SURCHARGE_RATE = 0.5;

// Items of this enchantment level or above carry a high-enchantment surcharge.
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargeRateOf(item: Item): number {
  return (
    (isCursed(item) ? CURSE_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0)
  );
}

// Item-specific modifiers apply to the affected item's base premium, never to
// the policy total, so each item is surcharged on its own and the surcharges
// are summed.
function itemRiskSurchargeOf(item: Item): number {
  return surchargeableBasePremiumOf(item) * riskSurchargeRateOf(item);
}

export function itemRiskSurchargesOf(items: Item[]): number {
  return items.reduce((total, item) => total + itemRiskSurchargeOf(item), 0);
}
