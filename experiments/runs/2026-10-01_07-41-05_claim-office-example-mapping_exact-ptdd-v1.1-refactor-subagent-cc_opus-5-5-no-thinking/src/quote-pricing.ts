import type { Customer, Item } from "./claim-office.js";
import { COMPONENT_BASE_PREMIUM, COMPONENT_TYPES, ITEM_BASE_PREMIUMS } from "./price-list.js";

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function itemBasePremium(item: Item): number {
  const basePremium = ITEM_BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return basePremium;
}

function individualItems(items: Item[]): Item[] {
  return items.filter((item) => !isComponent(item));
}

function policyBasePremium(items: Item[]): number {
  const itemsPremium = individualItems(items).reduce((sum, item) => sum + itemBasePremium(item), 0);
  const componentsPremium = COMPONENT_TYPES.reduce(
    (sum, componentType) =>
      sum + alikeComponentsBasePremium(items.filter((item) => item.type === componentType).length),
    0,
  );
  return itemsPremium + componentsPremium;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function itemSurchargesInPercent(items: Item[]): number {
  return individualItems(items).reduce(
    (sum, item) => sum + itemBasePremium(item) * itemSurchargePercent(item),
    0,
  );
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierPercent(customer: Customer, isFollowUpContract: boolean): number {
  const loyalty = isLongStanding(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = isFollowUpContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT - loyalty - followUp;
}

export function quotePremium(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const policyPremiumInPercent =
    policyBasePremium(items) * (PERCENT + policyModifierPercent(customer, isFollowUpContract));
  const premiumInPercent = policyPremiumInPercent + itemSurchargesInPercent(items);
  return Math.ceil(premiumInPercent / PERCENT) + PROCESSING_FEE;
}
