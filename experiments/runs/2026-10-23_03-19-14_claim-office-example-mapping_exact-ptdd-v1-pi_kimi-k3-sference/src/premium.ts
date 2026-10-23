// MHPCO price list and premium policy.
const FEE = 5;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;
const CURSE_TENTHS = 5;
const HIGH_ENCHANTMENT_TENTHS = 3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const FIRST_INSURANCE_TENTHS = 1;
const LOYALTY_TENTHS = -2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_TENTHS = -1.5;
const TENTHS = 10;

const COMPONENT_TYPES = ["rune", "moonstone"];

interface QuoteItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

function policyRateTenths(yearsWithMHPCO: number, followUpContract: boolean): number {
  return (
    FIRST_INSURANCE_TENTHS +
    (yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_TENTHS : 0) +
    (followUpContract ? FOLLOW_UP_TENTHS : 0)
  );
}

function itemSurchargeTenths(item: QuoteItem): number {
  return (
    (item.cursed ? CURSE_TENTHS : 0) +
    ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_TENTHS : 0)
  );
}

function typeBase(type: string, alikeCount: number): number {
  if (!(type in BASE_PREMIUM)) {
    throw new Error(`unknown item type: ${type}`);
  }
  if (COMPONENT_TYPES.includes(type) && alikeCount === BLOCK_SIZE) {
    return BLOCK_BASE;
  }
  return BASE_PREMIUM[type] * alikeCount;
}

export function quotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  followUpContract: boolean,
): number {
  const types = [...new Set(items.map((item) => item.type))];
  const base = types.reduce(
    (sum, type) => sum + typeBase(type, items.filter((item) => item.type === type).length),
    0,
  );
  const itemSurcharge = items.reduce(
    (sum, item) => sum + (BASE_PREMIUM[item.type] * itemSurchargeTenths(item)) / TENTHS,
    0,
  );
  const policySurcharge = (base * policyRateTenths(yearsWithMHPCO, followUpContract)) / TENTHS;
  return Math.ceil(base + itemSurcharge + policySurcharge) + FEE;
}
