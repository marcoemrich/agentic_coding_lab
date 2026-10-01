import {
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_PREMIUM,
  Item,
  ROUNDING_EPSILON,
  assertKnownType,
  isComponent,
  mainItemPremium,
} from './catalog';

export interface CustomerHistory {
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

/** Base premium of each item, in input order. Components in an exact block of 3 share the block price. */
function itemBasePremiums(items: Item[]): number[] {
  items.forEach((item) => assertKnownType(item.type));
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  return items.map((item) => {
    if (!isComponent(item.type)) return mainItemPremium(item.type);
    return componentCounts.get(item.type) === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE
      : COMPONENT_PREMIUM;
  });
}

export function basePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((sum, p) => sum + p, 0);
}

function itemSurcharge(item: Item, base: number): number {
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  return surcharge;
}

export function quotePremium(items: Item[], customer: CustomerHistory): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, p) => sum + p, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + itemSurcharge(item, bases[i]), 0);

  let policyModifier = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) policyModifier -= LOYALTY_DISCOUNT;
  if (customer.previousContracts > 0) policyModifier -= FOLLOW_UP_DISCOUNT;

  const premium = policyBase + itemSurcharges + policyBase * policyModifier + PROCESSING_FEE;
  return Math.ceil(premium - ROUNDING_EPSILON);
}
