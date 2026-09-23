import { COMPONENT_BLOCK_PREMIUM, COMPONENT_BLOCK_SIZE, specFor } from './catalog';

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Policy {
  premium: number;
  basePremium: number;
  insuranceSum: number;
  items: Item[];
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/** Base premium of a single item, ignoring component blocks. */
function itemBasePremium(item: Item): number {
  return specFor(item.type).basePremium;
}

/**
 * Base premium of all components, honouring the building block discount:
 * every group of exactly COMPONENT_BLOCK_SIZE alike components is charged
 * COMPONENT_BLOCK_PREMIUM instead of the individual premiums.
 */
function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const item of components) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }

  let total = 0;
  for (const [type, count] of countsByType) {
    const single = specFor(type).basePremium;
    total += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * single;
  }
  return total;
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

/** Rounds in the MHPCO's favour: premiums go up. */
export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

/**
 * Computes the policy for a quote step.
 * `contractIndex` is the zero-based number of the customer's contracts so far;
 * every contract after the first receives the follow-up discount.
 */
export function quote(customer: Customer, items: Item[], contractIndex: number): Policy {
  const components = items.filter((item) => specFor(item.type).isComponent);
  const mainItems = items.filter((item) => !specFor(item.type).isComponent);

  const basePremium =
    mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0) +
    componentsBasePremium(components);

  const itemModifiers = items.reduce((sum, item) => sum + itemSurcharges(item), 0);

  let policyModifiers = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) policyModifiers -= basePremium * LOYALTY_DISCOUNT;
  policyModifiers += basePremium * FIRST_INSURANCE_SURCHARGE;
  if (contractIndex > 0) policyModifiers -= basePremium * FOLLOW_UP_DISCOUNT;

  const premium = roundPremium(basePremium + itemModifiers + policyModifiers + PROCESSING_FEE);

  const insuranceSum = items.reduce((sum, item) => sum + specFor(item.type).insuranceValue, 0);

  return { premium, basePremium, insuranceSum, items };
}
