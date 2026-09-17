/**
 * MHPCO's risk rating of a single insured item.
 *
 * This module owns one underwriting policy: which properties of an item the
 * office considers risky, and what surcharge each of those risks carries. Such
 * a risk surcharge is always charged on the base premium of the affected item
 * alone, never on the policy total — that is what makes it item-specific and
 * keeps it apart from the policy-wide modifiers that depend on the customer's
 * history rather than on the item.
 */

import { itemBasePremium } from "./price-list.js";
import { type Item } from "./item.js";

const PERCENT = 100;

/** A risky property of an item, and the surcharge MHPCO charges for it. */
interface RiskRating {
  readonly appliesTo: (item: Item) => boolean;
  readonly surchargePercent: number;
}

/**
 * The office's register of item risks. Each entry is an independent ruling:
 * further risks are added here, and the rate of an existing one is revised
 * here, without touching how a premium is assembled.
 */
const HIGHLY_ENCHANTED_FROM = 5;

const RISK_RATINGS: readonly RiskRating[] = [
  { appliesTo: (item) => item.cursed === true, surchargePercent: 50 },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= HIGHLY_ENCHANTED_FROM,
    surchargePercent: 30,
  },
];

/** The total item-specific risk surcharge MHPCO charges for one item. */
function itemRiskSurcharge(item: Item): number {
  const basePremium = itemBasePremium(item);
  return RISK_RATINGS.filter((rating) => rating.appliesTo(item)).reduce(
    (total, rating) => total + (basePremium * rating.surchargePercent) / PERCENT,
    0,
  );
}

/** The item-specific risk surcharges of all items a policy covers. */
export function itemRiskSurcharges(items: readonly Item[]): number {
  return items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
}
