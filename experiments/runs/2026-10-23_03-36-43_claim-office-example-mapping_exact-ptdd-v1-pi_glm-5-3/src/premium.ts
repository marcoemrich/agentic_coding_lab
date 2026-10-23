/** The MHPCO's processing fee, added to every premium in whole G. */
const PROCESSING_FEE_G = 5;

/** Initial assessment surcharge on a customer's first insurance. */
const FIRST_INSURANCE_ASSESSMENT = 0.1;

/** Risk surcharge on a cursed item, as a share of its base premium. */
const CURSED_RISK_SURCHARGE = 0.5;

/** Risk surcharge on a highly enchanted item, as a share of its base premium. */
const HIGH_ENCHANTMENT_RISK_SURCHARGE = 0.3;

/** An item is highly enchanted from this enchantment level onwards. */
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Loyalty discount for long-standing customers, on the policy base premium. */
const LOYALTY_DISCOUNT = 0.2;

/** Customers count as long-standing from this many years with MHPCO. */
const LOYALTY_YEARS = 2;

/** Discount on each of the customer's contracts after their first. */
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

/** The MHPCO price list: insurance value and base premium per item type. */
export const PRICE_LIST_G = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
  rune: { insuranceValue: 250, basePremium: 25 },
} as const;

export type ItemType = keyof typeof PRICE_LIST_G;

/** Insurance value of an item type, unmodified by premium modifiers. */
export function insuranceValueOf(type: ItemType): number {
  return PRICE_LIST_G[type].insuranceValue;
}

/** Whether the MHPCO price list knows this item type. */
export function isKnownItemType(type: string): type is ItemType {
  return type in PRICE_LIST_G;
}

/** Special base premium for a building block of exactly 3 alike components. */
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM_G = 60;

/** A quote step from the scenario, as the CLI schema defines it. */
export interface QuoteStep {
  op: "quote";
  items: Array<{ type: string; cursed?: boolean; enchantment?: number }>;
}

/** Base premium for a group of alike components, honoring the block offer. */
function alikeComponentsBasePremium(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM_G;
  }
  return count * PRICE_LIST_G.rune.basePremium;
}

/** Item-specific risk surcharges, applied to the affected item's base premium. */
function itemRiskSurcharges(item: {
  type: ItemType;
  cursed?: boolean;
  enchantment?: number;
}): number {
  const basePremium = PRICE_LIST_G[item.type].basePremium;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += basePremium * CURSED_RISK_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += basePremium * HIGH_ENCHANTMENT_RISK_SURCHARGE;
  }
  return surcharge;
}

/**
 * Policy base premium: the sum of item base premiums, where a group
 * of exactly 3 alike components is priced as one building block.
 */
function policyBasePremium(items: Array<{ type: ItemType }>): number {
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let base = 0;
  for (const [type, count] of counts) {
    if (type === "rune" || type === "moonstone") {
      base += alikeComponentsBasePremium(count);
    } else {
      base += count * PRICE_LIST_G[type].basePremium;
    }
  }
  return base;
}

/** A customer, as the CLI schema defines it. */
export interface Customer {
  yearsWithMHPCO: number;
}

/**
 * Policy-wide modifiers on the policy base premium: the 10%
 * first-insurance assessment, less the loyalty discount for
 * long-standing customers and the follow-up contract discount for
 * each contract after the customer's first.
 */
function policyWideModifiers(
  policyBaseG: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const assessmentG = policyBaseG * FIRST_INSURANCE_ASSESSMENT;
  const loyaltyG =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBaseG * LOYALTY_DISCOUNT : 0;
  const followUpG = isFollowUpContract ? policyBaseG * FOLLOW_UP_CONTRACT_DISCOUNT : 0;
  return assessmentG - loyaltyG - followUpG;
}

/**
 * Premium for a quote: policy base premium (sum of item base
 * premiums) plus item-specific risk surcharges, plus the policy-wide
 * modifiers (first-insurance assessment, loyalty discount), plus the
 * processing fee, rounded up in the MHPCO's favor.
 */
export function quotePremium(
  step: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  const items = step.items as Array<{
    type: ItemType;
    cursed?: boolean;
    enchantment?: number;
  }>;
  const policyBaseG = policyBasePremium(items);
  const riskSurchargesG = items.reduce((sum, item) => sum + itemRiskSurcharges(item), 0);
  const modifiersG = policyWideModifiers(policyBaseG, customer, isFollowUpContract);
  return Math.ceil(policyBaseG + riskSurchargesG + modifiersG + PROCESSING_FEE_G);
}
