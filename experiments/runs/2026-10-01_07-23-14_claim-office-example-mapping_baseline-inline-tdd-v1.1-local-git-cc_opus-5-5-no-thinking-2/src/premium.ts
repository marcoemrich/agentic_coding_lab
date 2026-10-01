import { Item, catalogEntry, isComponent } from './catalog';

export interface Customer {
  yearsWithMHPCO: number;
  previousContracts: number;
}

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/** Base premium of each item, with component blocks spread evenly over their members. */
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    catalogEntry(item.type);
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  return items.map((item) => {
    const count = componentCounts.get(item.type);
    if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
    return catalogEntry(item.type).basePremium;
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

function policyModifierRate(customer: Customer): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) rate -= LOYALTY_DISCOUNT;
  if (customer.previousContracts > 0) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
}

export function quotePremium(items: Item[], customer: Customer): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, p) => sum + p, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargeRate(item), 0);
  const total = policyBase + itemSurcharges + policyBase * policyModifierRate(customer) + PROCESSING_FEE;
  return Math.ceil(roundFloatNoise(total));
}

/** Removes binary floating point artifacts (e.g. 165.00000000000003) before rounding. */
export function roundFloatNoise(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}
