const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT_DENOMINATOR = 100;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BASE_PREMIUM: Readonly<Record<string, number>> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export function validateKnownItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function basePremiumFor(items: Item[]): number {
  const types = new Set(items.map((item) => item.type));
  return Array.from(types).reduce((sum, type) => {
    const count = items.filter((item) => item.type === type).length;
    const premium = COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM
      : count * BASE_PREMIUM[type];
    return sum + premium;
  }, 0);
}

function cursedSurchargeFor(items: Item[]): number {
  const cursedBase = items.filter((item) => item.cursed).reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return (cursedBase * CURSED_SURCHARGE_PERCENT) / PERCENT_DENOMINATOR;
}

function enchantmentSurchargeFor(items: Item[]): number {
  const enchantedBase = items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  return (enchantedBase * HIGH_ENCHANTMENT_SURCHARGE_PERCENT) / PERCENT_DENOMINATOR;
}

function loyaltyDiscountFor(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS
    ? (base * LOYALTY_DISCOUNT_PERCENT) / PERCENT_DENOMINATOR
    : 0;
}

function followUpDiscountFor(base: number, isFollowUp: boolean): number {
  return isFollowUp ? (base * FOLLOW_UP_DISCOUNT_PERCENT) / PERCENT_DENOMINATOR : 0;
}

export function premiumFor(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const base = basePremiumFor(items);
  const assessment = (base * INITIAL_ASSESSMENT_PERCENT) / PERCENT_DENOMINATOR;
  return Math.ceil(base + assessment + cursedSurchargeFor(items) + enchantmentSurchargeFor(items)
    - loyaltyDiscountFor(base, yearsWithMHPCO) - followUpDiscountFor(base, isFollowUp) + PROCESSING_FEE);
}
