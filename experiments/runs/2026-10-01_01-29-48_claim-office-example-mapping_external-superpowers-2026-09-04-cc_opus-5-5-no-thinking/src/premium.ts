import { Item, priceListEntry } from './catalog';

export interface QuoteContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
}

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const WHOLE = 100; // percent
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

/** Base premium of each item; a component in a block carries its share of the block premium. */
function itemBasePremiums(items: Item[]): number[] {
  const entries = items.map((item) => priceListEntry(item.type));
  const componentCounts = new Map<string, number>();
  items.forEach((item, i) => {
    if (entries[i].kind === 'component') {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  });
  return items.map((item, i) =>
    entries[i].kind === 'component' && componentCounts.get(item.type) === BLOCK_SIZE
      ? BLOCK_PREMIUM / BLOCK_SIZE
      : entries[i].basePremium,
  );
}

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export function policyBasePremium(items: Item[]): number {
  return sum(itemBasePremiums(items));
}

function itemSurchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) percent += CURSE_SURCHARGE_PERCENT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) percent += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return percent;
}

function policyModifierPercent(context: QuoteContext): number {
  let percent = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (context.yearsWithMHPCO >= LOYALTY_YEARS) percent -= LOYALTY_DISCOUNT_PERCENT;
  if (context.isFollowUpContract) percent -= FOLLOW_UP_DISCOUNT_PERCENT;
  return percent;
}

export function quotePremium(items: Item[], context: QuoteContext): number {
  const premiums = itemBasePremiums(items);
  const base = sum(premiums);
  // Work in hundredths of a G (premium × percent) so all intermediate amounts stay exact.
  const itemSurcharges = sum(items.map((item, i) => premiums[i] * itemSurchargePercent(item)));
  const hundredths = base * (WHOLE + policyModifierPercent(context)) + itemSurcharges;
  return Math.ceil(hundredths / WHOLE) + PROCESSING_FEE;
}
