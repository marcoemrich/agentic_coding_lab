import { COMPONENT_BLOCK_PREMIUM, COMPONENT_BLOCK_SIZE, Customer, Item, specFor } from './items';

const ROUNDING_PRECISION = 6;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/** Base premium of each item; components of a type counted exactly 3 times share the block price. */
function itemBasePremiums(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map((item) => {
    const spec = specFor(item.type);
    if (spec.component && counts.get(item.type) === COMPONENT_BLOCK_SIZE) {
      return COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
    }
    return spec.basePremium;
  });
}

export function basePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((sum, p) => sum + p, 0);
}

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
}

function policyModifierRate(customer: Customer, isFollowUp: boolean): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) rate -= LOYALTY_DISCOUNT;
  if (isFollowUp) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
}

/** Rounds up, tolerating floating-point noise from fractional intermediates. */
function roundUp(amount: number): number {
  return Math.ceil(Number(amount.toFixed(ROUNDING_PRECISION)));
}

export function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, p) => sum + p, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargeRate(item), 0);
  const policyModifiers = policyBase * policyModifierRate(customer, isFollowUp);
  return roundUp(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
}
