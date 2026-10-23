export class ClaimOfficeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaimOfficeError";
  }
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteOptions {
  yearsWithMHPCO: number;
  isFirstContract: boolean;
}

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function roundUp(amount: number): number {
  return Math.ceil(amount);
}

function isComponent(type: string): boolean {
  return ITEM_BASE_PREMIUM[type] === COMPONENT_BASE_PREMIUM;
}

function premiumForComponentType(type: string, count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function basePremiumForType(type: string, count: number): number {
  if (isComponent(type)) return premiumForComponentType(type, count);
  return (ITEM_BASE_PREMIUM[type] ?? 0) * count;
}

function itemSurcharge(item: Item): number {
  const base = ITEM_BASE_PREMIUM[item.type] ?? 0;
  if (!base) return 0;
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function policyWideModifier(policyBase: number, options: QuoteOptions): number {
  let modifier = policyBase * FIRST_INSURANCE_RATE;
  if (options.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    modifier -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (!options.isFirstContract) {
    modifier -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }
  return modifier;
}

export function quotePremium(
  items: Item[],
  options: QuoteOptions,
): number {
  for (const item of items) {
    if (!(item.type in ITEM_BASE_PREMIUM)) {
      throw new ClaimOfficeError(`unknown item type: ${item.type}`);
    }
  }
  const counts = countByType(items);
  let basePremiumSum = 0;
  let policyBase = 0;
  let itemSurcharges = 0;
  for (const item of items) {
    policyBase += ITEM_BASE_PREMIUM[item.type] ?? 0;
    itemSurcharges += itemSurcharge(item);
  }
  for (const [type, count] of counts) {
    basePremiumSum += basePremiumForType(type, count);
  }
  const total =
    basePremiumSum +
    itemSurcharges +
    policyWideModifier(policyBase, options) +
    PROCESSING_FEE;
  return roundUp(total);
}
