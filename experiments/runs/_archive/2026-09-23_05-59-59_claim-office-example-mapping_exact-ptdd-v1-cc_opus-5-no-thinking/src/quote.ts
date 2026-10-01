import { customerModifierRate } from "./customer-modifiers.js";
import { itemsBasePremium, itemsRiskSurcharge } from "./item-pricing.js";
import type { Customer, Item } from "./item.js";
import { roundPremiumInMHPCOFavour } from "./mhpco-rounding.js";

export type { Customer, Item };

const PROCESSING_FEE = 5;

export function basePremium(items: Item[]): number {
  return itemsBasePremium(items) + itemsRiskSurcharge(items);
}

export function quote(
  customer: Customer,
  items: Item[],
  previousQuotes: number,
): number {
  const policyBasePremium = itemsBasePremium(items);
  const premium =
    policyBasePremium +
    itemsRiskSurcharge(items) +
    policyBasePremium * customerModifierRate(customer, previousQuotes) +
    PROCESSING_FEE;
  return roundPremiumInMHPCOFavour(premium);
}
