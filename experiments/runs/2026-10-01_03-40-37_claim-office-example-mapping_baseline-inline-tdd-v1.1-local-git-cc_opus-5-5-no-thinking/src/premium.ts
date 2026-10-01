import { COMPONENT_BLOCK_PREMIUM, COMPONENT_BLOCK_SIZE, Customer, Item, priceOf } from './catalog';

const PROCESSING_FEE = 5;
const PERCENT = 100;

// All modifiers in whole percent so intermediate amounts stay exact (amounts * 100).
const CURSE_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PCT = 20;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_PCT = 10;
const FOLLOW_UP_DISCOUNT_PCT = 15;

/** Base premium of each item; components of a type forming an exact block share the block premium. */
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (priceOf(item.type).component) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }
  return items.map((item) => {
    const price = priceOf(item.type);
    if (price.component && componentCounts.get(item.type) === COMPONENT_BLOCK_SIZE) {
      return COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE;
    }
    return price.basePremium;
  });
}

function itemSurchargePct(item: Item): number {
  let pct = 0;
  if (item.cursed) pct += CURSE_SURCHARGE_PCT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) pct += HIGH_ENCHANTMENT_SURCHARGE_PCT;
  return pct;
}

function policyModifierPct(customer: Customer, previousContracts: number): number {
  // Every item in a quote is treated as a first insurance, regardless of customer history.
  let pct = FIRST_INSURANCE_SURCHARGE_PCT;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) pct -= LOYALTY_DISCOUNT_PCT;
  if (previousContracts > 0) pct -= FOLLOW_UP_DISCOUNT_PCT;
  return pct;
}

/** Premium in whole G, rounded up; `previousContracts` counts the customer's earlier quotes. */
export function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const bases = itemBasePremiums(items);
  const policyBase = bases.reduce((a, b) => a + b, 0);
  const surchargesTimes100 = items.reduce((sum, item, i) => sum + bases[i] * itemSurchargePct(item), 0);
  const policyModifiersTimes100 = policyBase * policyModifierPct(customer, previousContracts);
  const totalTimes100 = policyBase * PERCENT + surchargesTimes100 + policyModifiersTimes100;
  return Math.ceil(totalTimes100 / PERCENT) + PROCESSING_FEE;
}
