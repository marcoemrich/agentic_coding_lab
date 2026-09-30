import { percentOf, roundPremium, sum } from "./amounts.js";

export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const PROCESSING_FEE = 5;
// The MHPCO price list for main items.
const PRICE_LIST: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

export const isKnownItemType = (type: string): boolean =>
  COMPONENT_TYPES.includes(type) || type in PRICE_LIST;

const assertKnownItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const mainItemBasePremium = (item: Item): number => PRICE_LIST[item.type].basePremium;

// Exactly BLOCK_SIZE alike components form a block at a special price.
const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;

export const countOfType = (items: Item[], type: string): number => items.filter((item) => item.type === type).length;

const mainItemsOf = (items: Item[]): Item[] => items.filter((item) => !isComponent(item));

const policyBasePremium = (items: Item[]): number => {
  const mainItemsPremium = sum(mainItemsOf(items).map(mainItemBasePremium));
  const componentsPremium = sum(COMPONENT_TYPES.map((type) => componentGroupPremium(countOfType(items, type))));
  return mainItemsPremium + componentsPremium;
};

// Item-specific modifiers apply to the affected item's own base premium.
// Items without an enchantment level (e.g. runes) count as level 0.
export const enchantmentOf = (item: Item | undefined): number => item?.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean => enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemSurcharge = (item: Item): number => percentOf(mainItemBasePremium(item), itemSurchargePercent(item));

// Policy-wide modifiers apply to the policy base premium; every quoted item is a first insurance.
const isLongStanding = (yearsWithMHPCO: number): boolean => yearsWithMHPCO >= LOYALTY_YEARS;

const policyModifierPercent = (yearsWithMHPCO: number, isFollowUp: boolean): number =>
  FIRST_INSURANCE_PERCENT -
  (isLongStanding(yearsWithMHPCO) ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

export const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  assertKnownItems(items);
  const basePremium = policyBasePremium(items);
  const itemSurchargesTotal = sum(mainItemsOf(items).map(itemSurcharge));
  const policyAdjustment = percentOf(basePremium, policyModifierPercent(yearsWithMHPCO, isFollowUp));
  return roundPremium(basePremium + itemSurchargesTotal + policyAdjustment + PROCESSING_FEE);
};

const insuranceValueOf = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : PRICE_LIST[item.type].insuranceValue;

// Block discounts affect the premium only, never the insurance sum.
export const insuranceSum = (items: Item[]): number => sum(items.map(insuranceValueOf));
