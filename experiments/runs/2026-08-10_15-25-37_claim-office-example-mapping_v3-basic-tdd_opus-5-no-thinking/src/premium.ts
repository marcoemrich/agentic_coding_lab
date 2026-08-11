import { BLOCK_PREMIUM, BLOCK_SIZE, lookUp } from './priceList.js';
import type { Item } from './types.js';

export interface QuoteContext {
  yearsWithMHPCO: number;
  /** Zero-based position of this quote among the customer's contracts in the scenario. */
  contractIndex: number;
}

export interface QuoteResult {
  /** Sum of the item base premiums, block discounts already applied. */
  basePremium: number;
  /** Base premium plus the item-specific curse and enchantment surcharges. */
  afterItemModifiers: number;
  /** Final premium, rounded up in the MHPCO's favour. */
  premium: number;
  insuranceSum: number;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

/**
 * Base premium each item contributes. Components of a type that appears
 * exactly BLOCK_SIZE times share the discounted block premium equally.
 */
function itemBasePremiums(items: Item[]): number[] {
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (lookUp(item.type).isComponent) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  return items.map((item) => {
    const entry = lookUp(item.type);
    if (entry.isComponent && componentCounts.get(item.type) === BLOCK_SIZE) {
      return BLOCK_PREMIUM / BLOCK_SIZE;
    }
    return entry.basePremium;
  });
}

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed) {
    rate += CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return rate;
}

/**
 * Policy-wide modifiers are percentages of the policy base premium and are
 * combined additively, as the worked examples in the price list show.
 */
function policyModifierRate(context: QuoteContext): number {
  let rate = FIRST_INSURANCE_SURCHARGE;
  if (context.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT;
  }
  if (context.contractIndex > 0) {
    rate -= FOLLOW_UP_DISCOUNT;
  }
  return rate;
}

export function quotePremium(items: Item[], context: QuoteContext): QuoteResult {
  const bases = itemBasePremiums(items);
  const basePremium = bases.reduce((sum, base) => sum + base, 0);

  const afterItemModifiers = items.reduce(
    (sum, item, index) => sum + bases[index] * itemSurchargeRate(item),
    basePremium,
  );

  const premium = afterItemModifiers + basePremium * policyModifierRate(context) + PROCESSING_FEE;

  return {
    basePremium,
    afterItemModifiers,
    // Rounding in the MHPCO's favour: premiums go up.
    premium: Math.ceil(premium),
    insuranceSum: items.reduce((sum, item) => sum + lookUp(item.type).insuranceValue, 0),
  };
}
