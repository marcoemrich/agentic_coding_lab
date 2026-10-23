import { priceListEntryOf } from "./price-list.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => priceListEntryOf(item.type).isComponent;

const itemBasePremium = (item: Item): number => priceListEntryOf(item.type).basePremium;

const alikeComponentsPremium = (components: Item[]): number =>
  components.length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : components.reduce((sum, component) => sum + itemBasePremium(component), 0);

const componentsPremium = (components: Item[]): number => {
  const componentTypes = new Set(components.map((component) => component.type));
  return [...componentTypes].reduce(
    (sum, type) => sum + alikeComponentsPremium(components.filter((component) => component.type === type)),
    0,
  );
};

const curseSurchargePercent = (item: Item): number => (item.cursed ? CURSE_SURCHARGE_PERCENT : 0);

const highEnchantmentSurchargePercent = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;

const itemSurchargePercent = (item: Item): number => curseSurchargePercent(item) + highEnchantmentSurchargePercent(item);

const itemSurchargeOf = (item: Item): number => (itemBasePremium(item) * itemSurchargePercent(item)) / PERCENT;

const basePremiumOf = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  return mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0) + componentsPremium(components);
};

const loyaltyDiscountPercent = (yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0;

const followUpDiscountPercent = (isFollowUpContract: boolean): number =>
  isFollowUpContract ? FOLLOW_UP_DISCOUNT_PERCENT : 0;

const policyWidePercent = (yearsWithMHPCO: number, isFollowUpContract: boolean): number =>
  PERCENT +
  FIRST_INSURANCE_PERCENT -
  loyaltyDiscountPercent(yearsWithMHPCO) -
  followUpDiscountPercent(isFollowUpContract);

export const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUpContract: boolean): number => {
  const base = basePremiumOf(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurchargeOf(item), 0);
  const total = base * policyWidePercent(yearsWithMHPCO, isFollowUpContract) + itemSurcharges * PERCENT;
  return Math.ceil(total / PERCENT) + PROCESSING_FEE;
};
