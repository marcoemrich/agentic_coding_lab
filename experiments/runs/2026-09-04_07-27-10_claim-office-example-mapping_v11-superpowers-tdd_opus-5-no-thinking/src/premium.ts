export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function isKnownType(type: string): boolean {
  return type in BASE_PREMIUMS || COMPONENT_TYPES.includes(type);
}

function assertKnownTypes(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function componentsPremium(items: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }

  let total = 0;
  for (const count of countsByType.values()) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}

export function basePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);

  const mainTotal = mainItems.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);
  return mainTotal + componentsPremium(components);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_VALUE = 250;

function insuranceValue(type: string): number {
  return INSURANCE_VALUES[type] ?? COMPONENT_VALUE;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValue(item.type), 0);
}

/** Surcharges tied to a single item, computed on that item's own base premium. */
function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) continue;
    const base = BASE_PREMIUMS[item.type];
    if (item.cursed) total += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
}

/**
 * Modifiers that apply to the policy as a whole, all computed as a
 * percentage of the policy base premium.
 */
function policyModifiers(base: number, customer: Customer, previousContracts: number): number {
  let total = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) total -= base * LOYALTY_DISCOUNT;
  if (previousContracts > 0) total -= base * FOLLOW_UP_DISCOUNT;
  return total;
}

export function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  assertKnownTypes(items);
  const base = basePremium(items);
  const total =
    base +
    itemSurcharges(items) +
    policyModifiers(base, customer, previousContracts) +
    PROCESSING_FEE;
  return Math.ceil(total);
}
