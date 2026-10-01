export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;

const MAIN_ITEMS: Record<string, { insuranceValue: number; basePremium: number }> = {
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

function mainItem(type: string): { insuranceValue: number; basePremium: number } {
  const entry = MAIN_ITEMS[type];
  if (!entry) throw new Error(`unknown item type: ${type}`);
  return entry;
}

export function insuranceValue(type: string): number {
  return isComponent(type) ? COMPONENT_INSURANCE_VALUE : mainItem(type).insuranceValue;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
}

const CAP_FACTOR = 2;

export function payoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_FACTOR;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

/** Base premium of one item, ignoring component block discounts. */
export function itemBasePremium(item: Item): number {
  return isComponent(item.type) ? COMPONENT_BASE_PREMIUM : mainItem(item.type).basePremium;
}

export function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item.type));
  const components = items.filter((item) => isComponent(item.type));
  let total = mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0);
  for (const count of countByType(components).values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

/** Sum of the item-specific curse and high-enchantment surcharges. */
function itemSurcharges(items: Item[]): number {
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

/**
 * Total premium: item surcharges apply to the affected item's base premium,
 * policy-wide modifiers to the policy base premium, and the fee comes last.
 * Every item in a quote counts as a first insurance regardless of history.
 */
export function quote(customer: Customer, items: Item[], priorContracts: number): number {
  const base = policyBasePremium(items);
  let premium = base + itemSurcharges(items);
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) premium -= base * LOYALTY_DISCOUNT;
  if (items.length > 0) premium += base * FIRST_INSURANCE_SURCHARGE;
  if (priorContracts > 0) premium -= base * FOLLOW_UP_CONTRACT_DISCOUNT;
  return Math.ceil(premium + PROCESSING_FEE);
}
