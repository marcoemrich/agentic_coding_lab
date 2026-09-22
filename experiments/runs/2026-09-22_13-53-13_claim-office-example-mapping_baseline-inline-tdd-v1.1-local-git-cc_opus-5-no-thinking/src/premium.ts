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

const COMPONENTS: Record<string, PriceListEntry> = {
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

export function isComponent(type: string): boolean {
  return type in COMPONENTS;
}

function priceList(type: string): PriceListEntry {
  const entry = MAIN_ITEMS[type] ?? COMPONENTS[type];
  if (!entry) throw new Error(`unknown item type: ${type}`);
  return entry;
}

export function insuranceValue(item: Item): number {
  return priceList(item.type).insuranceValue;
}

export function itemBasePremium(item: Item): number {
  return priceList(item.type).basePremium;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

export function policyBasePremium(items: Item[]): number {
  const componentCounts = countByType(items.filter((item) => isComponent(item.type)));
  const mainTotal = items
    .filter((item) => !isComponent(item.type))
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
  let componentTotal = 0;
  for (const [type, count] of componentCounts) {
    componentTotal +=
      count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENTS[type].basePremium;
  }
  return mainTotal + componentTotal;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return surcharge;
}

export function quotePremium(
  customer: Customer,
  items: Item[],
  previousContracts: number,
): number {
  const base = policyBasePremium(items);
  let premium = base;
  premium += items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) premium -= base * LOYALTY_DISCOUNT;
  premium += base * FIRST_INSURANCE_SURCHARGE;
  if (previousContracts > 0) premium -= base * FOLLOW_UP_DISCOUNT;
  return Math.ceil(premium + PROCESSING_FEE);
}
