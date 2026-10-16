import type { Customer } from "./customer.js";
import type { Item } from "./item.js";
import { COMPONENT, COMPONENT_TYPES, priceListEntry } from "./priceList.js";

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

function mainItems(items: Item[]): Item[] {
  return items.filter((item) => !COMPONENT_TYPES.includes(item.type));
}

function itemBasePremium(item: Item): number {
  return priceListEntry(item.type).basePremium;
}

function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT.basePremium;
}

// "Alike" components are components of exactly the same type.
function alikeComponentsBasePremium(items: Item[]): number {
  return COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentsBasePremium(items.filter((item) => item.type === type).length),
    0,
  );
}

function policyBasePremium(items: Item[]): number {
  return mainItems(items).reduce((sum, item) => sum + itemBasePremium(item), 0) + alikeComponentsBasePremium(items);
}

function premiumRoundedInMHPCOFavor(amount: number): number {
  return Math.ceil(amount);
}

// Item-specific modifiers apply to the base premium of the affected item only.
function itemRiskSurchargeRate(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE : 0;
  const highEnchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + highEnchantment;
}

// Reading: surcharges apply to main items; components have no individual base premium inside a block.
function itemRiskSurcharges(items: Item[]): number {
  return mainItems(items).reduce((sum, item) => sum + itemBasePremium(item) * itemRiskSurchargeRate(item), 0);
}

// Policy-wide modifiers apply to the policy base premium; every quoted item is a first insurance.
function policyModifierRate(customer: Customer, followUpContract: boolean): number {
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT : 0;
  const followUpDiscount = followUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE - loyaltyDiscount - followUpDiscount;
}

export function quotePremium(items: Item[], customer: Customer, followUpContract: boolean): number {
  const policyBase = policyBasePremium(items);
  return premiumRoundedInMHPCOFavor(
    policyBase + itemRiskSurcharges(items) + policyBase * policyModifierRate(customer, followUpContract) + PROCESSING_FEE,
  );
}
