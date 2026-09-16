import { basePremiumOf, isComponent, type Item } from "./price-list.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PERCENT = 100;

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Premiums are rounded up: to whole G in the MHPCO's favor. */
const roundPremiumInMHPCOFavour = Math.ceil;

export interface Customer {
  yearsWithMHPCO: number;
}

function componentGroupPremium(type: string, count: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * basePremiumOf(type);
}

/** Alike components are counted per type; a group of exactly three is offered as a block. */
function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  return [...countsByType].reduce((sum, [type, count]) => sum + componentGroupPremium(type, count), 0);
}

export function policyBasePremium(items: Item[]): number {
  const mainPremium = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + basePremiumOf(item.type), 0);
  return mainPremium + componentsBasePremium(items.filter(isComponent));
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargeRate(item: Item): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE : 0;
  return curse + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);
}

/** Item-specific surcharges are rated on the base premium of the affected item only. */
function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + basePremiumOf(item.type) * itemSurchargeRate(item), 0);
}

export function insuredItemsPremium(items: Item[]): number {
  return policyBasePremium(items) + itemSurcharges(items);
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStandingCustomer(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_RATE + loyalty + followUp;
}

/** Amounts are kept as exact hundredths of a G so that only the final premium is rounded. */
export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const baseHundredths = policyBasePremium(items) * PERCENT;
  const policyModifiers = baseHundredths * policyModifierRate(customer, previousContracts);
  const surcharges = itemSurcharges(items) * PERCENT;
  return roundPremiumInMHPCOFavour((baseHundredths + surcharges + policyModifiers) / PERCENT + PROCESSING_FEE);
}
