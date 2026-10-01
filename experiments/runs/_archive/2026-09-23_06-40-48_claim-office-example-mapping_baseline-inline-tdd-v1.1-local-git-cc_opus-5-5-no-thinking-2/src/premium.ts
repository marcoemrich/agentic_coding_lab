import {
  Item,
  assertKnownType,
  isComponent,
  mainItemPremium,
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_PREMIUM,
} from './catalog';

export interface CustomerContext {
  yearsWithMHPCO: number;
  previousContracts: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const EPSILON = 1e-9;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function groupPremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

export function componentBasePremium(items: Item[]): number {
  let total = 0;
  for (const count of countByType(items.filter((i) => isComponent(i.type))).values()) {
    total += groupPremium(count);
  }
  return total;
}

/** Base premium per item; components in a block share the block premium equally. */
function itemBasePremiums(items: Item[]): number[] {
  const counts = countByType(items);
  return items.map((item) => {
    if (!isComponent(item.type)) return mainItemPremium(item.type);
    const count = counts.get(item.type) ?? 1;
    return groupPremium(count) / count;
  });
}

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed === true) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
}

function policyModifierRate(customer: CustomerContext): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) rate -= LOYALTY_DISCOUNT;
  if (customer.previousContracts > 0) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
}

export function quotePremium(items: Item[], customer: CustomerContext): number {
  items.forEach((item) => assertKnownType(item.type));
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, b) => sum + b, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargeRate(item), 0);
  const total = policyBase + itemSurcharges + policyBase * policyModifierRate(customer) + PROCESSING_FEE;
  return Math.ceil(total - EPSILON);
}
