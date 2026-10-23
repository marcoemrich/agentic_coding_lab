import { basePremium } from "./base-premium.js";
import type { Item } from "./item.js";
import { riskSurchargeInHundredths } from "./item-risk-surcharge.js";
import { policyModifierPercent, type CustomerHistory } from "./policy-modifiers.js";

const HUNDREDTHS_PER_G = 100;
const PROCESSING_FEE = 5;

export function quotePremium(items: Item[], history: CustomerHistory): number {
  const base = basePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + riskSurchargeInHundredths(item), 0);
  const policyModifiers = base * policyModifierPercent(history);
  const premiumInHundredths = base * HUNDREDTHS_PER_G + itemSurcharges + policyModifiers;
  return Math.ceil(premiumInHundredths / HUNDREDTHS_PER_G) + PROCESSING_FEE;
}
