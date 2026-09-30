import { Customer, Item } from './types';
import { catalogEntry } from './catalog';

const FIRST_INSURANCE_SURCHARGE = 0.1;
const PROCESSING_FEE = 5;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export function quote(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const unknown = items.find((item) => !catalogEntry(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
  const pricedItems = items.map((item) => ({ item, basePremium: itemBasePremium(item, items) }));
  const base = pricedItems.reduce((sum, { basePremium }) => sum + basePremium, 0);
  const itemSurcharges = pricedItems.reduce((sum, { item, basePremium }) => sum + basePremium * itemSurchargeRate(item), 0);
  return Math.ceil(base + itemSurcharges + base * policyModifierRate(customer, isFollowUpContract) + PROCESSING_FEE);
}

function itemBasePremium(item: Item, items: Item[]): number {
  const entry = catalogEntry(item.type)!;
  if (!entry.isComponent) return entry.basePremium;
  const alike = items.filter((other) => other.type === item.type).length;
  return alike === BLOCK_SIZE ? BLOCK_BASE_PREMIUM / BLOCK_SIZE : entry.basePremium;
}

function itemSurchargeRate(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
}

function policyModifierRate(customer: Customer, isFollowUpContract: boolean): number {
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUpContract ? FOLLOW_UP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE - loyalty - followUp;
}
