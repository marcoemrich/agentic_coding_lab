import {
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_PREMIUM,
  Customer,
  Item,
  assertKnownType,
  isComponent,
  mainItemPremium,
} from './catalog';

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const FLOAT_PRECISION = 1e6;

/** Base premium of each item; alike components in a group of exactly 3 share the block price. */
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

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
}

export function quotePremium(items: Item[], customer: Customer, isFollowUpContract: boolean): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, p) => sum + p, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargeRate(item), 0);

  let policyRate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) policyRate -= LOYALTY_DISCOUNT;
  if (isFollowUpContract) policyRate -= FOLLOW_UP_DISCOUNT;

  const total = policyBase + itemSurcharges + policyBase * policyRate + PROCESSING_FEE;
  return Math.ceil(roundFloatNoise(total));
}

/** Guards against binary float artefacts (e.g. 165.00000000000003) before rounding. */
export function roundFloatNoise(value: number): number {
  return Math.round(value * FLOAT_PRECISION) / FLOAT_PRECISION;
}
