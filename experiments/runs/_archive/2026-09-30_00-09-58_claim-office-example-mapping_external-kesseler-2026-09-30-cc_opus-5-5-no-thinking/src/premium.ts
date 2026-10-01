import { Item, priceListEntry } from './catalog';

export interface Customer {
  yearsWithMHPCO: number;
  previousContracts: number;
}

const PERCENT = 100;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function itemSurchargePercent(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const highEnchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + highEnchantment;
}

function itemBasePremium(item: Item, items: Item[]): number {
  const entry = priceListEntry(item.type);
  const alike = items.filter((other) => other.type === item.type).length;
  return entry.component && alike === BLOCK_SIZE ? BLOCK_BASE_PREMIUM / BLOCK_SIZE : entry.basePremium;
}

function itemPremium(item: Item, items: Item[]): number {
  const base = itemBasePremium(item, items);
  return base + percentOf(base, itemSurchargePercent(item));
}

function policyModifierPercent(customer: Customer): number {
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = customer.previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyalty + followUp;
}

export function quote(items: Item[], customer: Customer): number {
  const base = items.reduce((sum, item) => sum + itemBasePremium(item, items), 0);
  const itemPremiums = items.reduce((sum, item) => sum + itemPremium(item, items), 0);
  return Math.ceil(itemPremiums + percentOf(base, policyModifierPercent(customer)) + PROCESSING_FEE);
}
