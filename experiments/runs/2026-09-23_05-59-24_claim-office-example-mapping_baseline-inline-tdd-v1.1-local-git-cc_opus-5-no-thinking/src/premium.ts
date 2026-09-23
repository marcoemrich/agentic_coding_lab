export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.includes(type);
}

export function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * The block price applies only to a group of exactly BLOCK_SIZE alike
 * components; any other count is charged per single component.
 */
function componentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

export function itemInsuranceValue(item: Item): number {
  return isComponent(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_ITEMS[item.type].insuranceValue;
}

export function itemBasePremium(item: Item): number {
  return isComponent(item.type)
    ? COMPONENT_BASE_PREMIUM
    : MAIN_ITEMS[item.type].basePremium;
}

/**
 * Components are rated per type so a block of exactly three alike ones
 * earns the block price; main items are simply rated one by one.
 */
export function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += isComponent(type)
      ? componentsBasePremium(count)
      : count * itemBasePremium({ type });
  }
  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

/**
 * Item-specific modifiers are measured against the base premium of the
 * affected item alone. Components are rated singly here, so a block
 * discount never shrinks a surcharge.
 */
export function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const base = itemBasePremium(item);
    let surcharge = 0;
    if (item.cursed) surcharge += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
    return sum + surcharge;
  }, 0);
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

/**
 * Policy-wide modifiers are measured against the policy base premium.
 * Every quote counts as a first insurance for the items it covers, even
 * for a long-standing customer on a follow-up contract.
 */
function policyModifiers(base: number, customer: Customer, previousContracts: number): number {
  let total = FIRST_INSURANCE_SURCHARGE * base;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) total -= LOYALTY_DISCOUNT * base;
  if (previousContracts > 0) total -= FOLLOW_UP_CONTRACT_DISCOUNT * base;
  return total;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const base = policyBasePremium(items);
  const total =
    base + itemSurcharges(items) + policyModifiers(base, customer, previousContracts);
  return Math.ceil(total + PROCESSING_FEE);
}
