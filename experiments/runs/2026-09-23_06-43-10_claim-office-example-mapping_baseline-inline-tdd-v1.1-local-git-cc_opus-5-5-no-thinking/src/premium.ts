import {
  Item,
  assertKnownType,
  isComponent,
  mainItemPremium,
  COMPONENT_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_BLOCK_PREMIUM,
} from './catalog';

export interface QuoteContext {
  yearsWithMHPCO: number;
  isFollowUp: boolean;
}

// All percentages are expressed in whole percent so the premium can be
// computed exactly in hundredths of a G and rounded only once at the end.
const CURSE_SURCHARGE = 50;
const HIGH_ENCHANTMENT_SURCHARGE = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 20;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 10;
const FOLLOW_UP_DISCOUNT = 15;
const PROCESSING_FEE = 5;
const HUNDREDTHS = 100;

function componentGroupPremium(count: number): number {
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

/** Base premium of each item, in the same order as the input. */
function itemBasePremiums(items: Item[]): number[] {
  items.forEach((item) => assertKnownType(item.type));
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  return items.map((item) => {
    if (!isComponent(item.type)) return mainItemPremium(item.type);
    const count = componentCounts.get(item.type)!;
    return componentGroupPremium(count) / count;
  });
}

export function basePremium(items: Item[]): number {
  return itemBasePremiums(items).reduce((sum, p) => sum + p, 0);
}

function itemSurchargePercent(item: Item): number {
  let percent = 0;
  if (item.cursed) percent += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) percent += HIGH_ENCHANTMENT_SURCHARGE;
  return percent;
}

function policyModifierPercent(context: QuoteContext): number {
  let percent = FIRST_INSURANCE_SURCHARGE;
  if (context.yearsWithMHPCO >= LOYALTY_YEARS) percent -= LOYALTY_DISCOUNT;
  if (context.isFollowUp) percent -= FOLLOW_UP_DISCOUNT;
  return percent;
}

export function quotePremium(items: Item[], context: QuoteContext): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((sum, p) => sum + p, 0);
  const itemSurcharges = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargePercent(item), 0);
  const inHundredths =
    policyBase * HUNDREDTHS +
    itemSurcharges +
    policyBase * policyModifierPercent(context) +
    PROCESSING_FEE * HUNDREDTHS;
  return Math.ceil(Math.round(inHundredths) / HUNDREDTHS);
}
