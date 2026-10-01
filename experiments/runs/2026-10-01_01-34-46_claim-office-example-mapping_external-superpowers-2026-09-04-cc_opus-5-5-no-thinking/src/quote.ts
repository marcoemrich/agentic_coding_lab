import { COMPONENT, Item, assertKnownType, isMainItem, mainItemBasePremium } from './catalog';

export type { Item } from './catalog';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface History {
  previousContracts: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const ONE_HUNDRED_PERCENT = 100;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / ONE_HUNDRED_PERCENT;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function componentsBasePremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * COMPONENT.basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function mainItemPremium(item: Item): number {
  const base = mainItemBasePremium(item.type);
  let surchargePercent = 0;
  if (item.cursed) surchargePercent += CURSE_SURCHARGE_PERCENT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) surchargePercent += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return base + percentOf(base, surchargePercent);
}

function policyModifierPercent(customer: Customer, history: History): number {
  let percent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) percent -= LOYALTY_DISCOUNT_PERCENT;
  if (history.previousContracts > 0) percent -= FOLLOW_UP_DISCOUNT_PERCENT;
  return percent;
}

export function quote(items: Item[], customer: Customer, history: History): number {
  items.forEach((item) => assertKnownType(item.type));
  const mainItems = items.filter((item) => isMainItem(item.type));
  const components = items.filter((item) => !isMainItem(item.type));

  // Components carry no item-specific modifiers, so their base premium is also their item premium.
  const componentsBase = sum([...countByType(components).values()].map(componentsBasePremium));
  const policyBase = sum(mainItems.map((item) => mainItemBasePremium(item.type))) + componentsBase;
  const itemPremiums = sum(mainItems.map(mainItemPremium)) + componentsBase;

  return Math.ceil(itemPremiums + percentOf(policyBase, policyModifierPercent(customer, history)) + PROCESSING_FEE);
}
