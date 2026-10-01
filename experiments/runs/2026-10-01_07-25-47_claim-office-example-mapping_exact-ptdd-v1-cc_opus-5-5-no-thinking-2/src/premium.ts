import { COMPONENT_BASE_PREMIUM, COMPONENT_TYPES, isComponent, priceOf, type ItemInput } from "./item.js";

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

function componentsBasePremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function policyBasePremium(items: ItemInput[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const mainItemsPremium = mainItems.reduce((sum, item) => sum + priceOf(item).basePremium, 0);
  const componentsPremium = COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
  return mainItemsPremium + componentsPremium;
}

function roundPremiumInMHPCOFavor(premium: number): number {
  return Math.ceil(premium);
}

function itemSurchargePercent(item: ItemInput): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function itemSurchargesInPercentUnits(items: ItemInput[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + priceOf(item).basePremium * itemSurchargePercent(item), 0);
}

export interface CustomerHistory {
  yearsWithMHPCO: number;
  previousContracts: number;
}

function policyModifierPercent(customer: CustomerHistory): number {
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = customer.previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyalty + followUp;
}

export function quotePremium(items: ItemInput[], customer: CustomerHistory): number {
  const policyPremiumInPercentUnits = policyBasePremium(items) * (PERCENT + policyModifierPercent(customer));
  return roundPremiumInMHPCOFavor(
    (policyPremiumInPercentUnits + itemSurchargesInPercentUnits(items)) / PERCENT + PROCESSING_FEE,
  );
}
