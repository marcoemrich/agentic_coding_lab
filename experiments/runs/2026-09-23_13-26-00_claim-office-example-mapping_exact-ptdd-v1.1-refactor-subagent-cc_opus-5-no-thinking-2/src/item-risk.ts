import { surchargeableBasePremiumOf, type Item } from "./item-pricing.js";

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Whether the MHPCO considers the object cursed. */
function isCursed(item: Item): boolean {
  return item.cursed === true;
}

/** Whether the MHPCO considers the object highly enchanted. */
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

/**
 * A risk surcharge clause of the MHPCO's underwriting rulebook: the condition
 * under which the office judges an object risky, and the rate it charges for
 * that risk. Condition and rate belong to one clause and change together.
 */
interface RiskSurchargeClause {
  appliesTo(item: Item): boolean;
  rate: number;
}

/** The risk surcharge clauses the MHPCO's rulebook currently contains. */
const RISK_SURCHARGE_CLAUSES: RiskSurchargeClause[] = [
  { appliesTo: isCursed, rate: CURSE_SURCHARGE_RATE },
  { appliesTo: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

/** The rates of the risk surcharges an individual object attracts. */
function riskSurchargeRates(item: Item): number[] {
  return RISK_SURCHARGE_CLAUSES.filter((clause) => clause.appliesTo(item)).map(
    (clause) => clause.rate,
  );
}

/**
 * Item-specific risk surcharges: the MHPCO's underwriting judgement about how
 * risky an individual object is. Each surcharge is levied on the base premium
 * of the affected item alone, never on the policy total. Which amount that is
 * belongs to the price list, not to the underwriting rulebook, so it is asked
 * for rather than derived here.
 */
function itemRiskSurcharge(item: Item): number {
  const itemBase = surchargeableBasePremiumOf(item);
  return riskSurchargeRates(item).reduce((running, rate) => running + itemBase * rate, 0);
}

/** The total of the item-specific risk surcharges the policy attracts. */
export function policyItemRiskSurcharges(items: Item[]): number {
  return items.reduce((running, item) => running + itemRiskSurcharge(item), 0);
}
