export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface CustomerContext {
  yearsWithMHPCO: number;
  previousContracts: number;
}

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PROCESSING_FEE = 5;
const HUNDREDTHS_PER_G = 100;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

/** Base premium of each item; components in a block share the block premium. */
function itemBasePremiums(items: Item[]): number[] {
  const counts = countByType(items);
  return items.map((item) => {
    if (Object.hasOwn(MAIN_ITEM_BASE_PREMIUM, item.type)) return MAIN_ITEM_BASE_PREMIUM[item.type];
    if (!COMPONENT_TYPES.has(item.type)) throw new Error(`Unknown item type: "${item.type}"`);
    return counts.get(item.type) === BLOCK_SIZE
      ? BLOCK_BASE_PREMIUM / BLOCK_SIZE
      : COMPONENT_BASE_PREMIUM;
  });
}

const sum = (values: number[]) => values.reduce((acc, v) => acc + v, 0);

export function basePremium(items: Item[]): number {
  return sum(itemBasePremiums(items));
}

function itemSurchargePercent(item: Item): number {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE_PERCENT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return rate;
}

function policySurchargePercent(customer: CustomerContext): number {
  let rate = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) rate -= LOYALTY_DISCOUNT_PERCENT;
  if (customer.previousContracts > 0) rate -= FOLLOW_UP_DISCOUNT_PERCENT;
  return rate;
}

export function quotePremium(items: Item[], customer: CustomerContext): number {
  const itemBases = itemBasePremiums(items);
  const policyBase = sum(itemBases);
  // Work in hundredths of G so that intermediate amounts stay exact until the final rounding.
  const itemSurchargeHundredths = sum(
    items.map((item, i) => itemBases[i] * itemSurchargePercent(item)),
  );
  const policyModifierHundredths = policyBase * policySurchargePercent(customer);
  const premiumHundredths =
    (policyBase + PROCESSING_FEE) * HUNDREDTHS_PER_G + itemSurchargeHundredths + policyModifierHundredths;
  return Math.ceil(premiumHundredths / HUNDREDTHS_PER_G);
}
