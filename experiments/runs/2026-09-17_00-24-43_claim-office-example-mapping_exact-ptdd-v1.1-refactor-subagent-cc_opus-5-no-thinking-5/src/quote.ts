import {
  COMPONENT_BASE_PREMIUM,
  isComponent,
  mainItemBasePremium,
  type Item,
} from "./price-list.js";

export type { Item };

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT = 100;

// Percentages are kept as exact fractions (integer numerator over PERCENT);
// scaling by a float rate such as 0.1 yields artefacts like 115.00000000000001.
function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

/**
 * MHPCO rounds a premium up: every fraction of a G the customer owes falls to
 * the customer. This is the premium side of the office's single rounding
 * principle -- "in the MHPCO's favor" names a direction, and which direction
 * favors the office depends on which way the money moves. The claim office holds
 * the paying side of the same principle, and rounds the other way. Neither
 * derives from the other: the office could revise how it rounds what it collects
 * without touching how it rounds what it pays.
 */
function roundPremiumInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

/**
 * Settling turns an underwritten amount into the sum actually payable. It is the
 * MHPCO's accounting convention, not an underwriting rule: the processing fee is
 * charged at the very end, untouched by any percentage modifier, and only the
 * settled premium is rounded -- every intermediate amount stays fractional.
 */
function settlePremium(underwrittenAmount: number): number {
  return roundPremiumInMHPCOsFavor(underwrittenAmount + PROCESSING_FEE);
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/**
 * Two items are "alike" when they share an item type -- not merely a family.
 * The price list settles this: 2 runes + 1 moonstone form no block (75 G), so
 * rune-y and gemstone-y kinship is not enough to build a block together.
 */
function alikeGroupKey(item: Item): string {
  return item.type;
}

function countAlikeGroups(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = alikeGroupKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/**
 * A building block of exactly 3 alike components is offered at a special rate;
 * the block is not greedy, so 4 or 7 runes form no block at all.
 */
function componentGroupBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

/**
 * The price list quotes a group of alike items as a whole, because only a group
 * can qualify for the block rate. Main items have no group rate: they are priced
 * one by one.
 */
function alikeGroupBasePremium(type: string, count: number): number {
  return isComponent(type)
    ? componentGroupBasePremium(count)
    : count * mainItemBasePremium(type);
}

export function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countAlikeGroups(items)) {
    total += alikeGroupBasePremium(type, count);
  }
  return total;
}

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

/** The threshold is inclusive: exactly enchantment 5 already counts as high. */
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

/**
 * The risk the price list reads off a single item. The surcharges stack: an
 * item that carries several risks is charged for each of them.
 */
function itemRiskSurchargePercent(item: Item): number {
  const cursePercent = item.cursed === true ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

/**
 * The premium an item's own risk is charged against. The MHPCO reads risk off
 * main items only, and charges it on that item's own tariff row -- never on the
 * policy total. A component is a raw ingredient: it bears no curse and no
 * enchantment of its own, and inside a block it has no premium of its own that a
 * surcharge could be charged against, so it offers no base to charge.
 *
 * Whether an item bears risk and what that risk is charged against are one
 * decision, not two: the office excludes components precisely because they have
 * no row of their own. Should it one day surcharge a cursed rune, this single
 * line is where it must say what that surcharge is reckoned on.
 */
function riskBearingBasePremium(item: Item): number {
  return isComponent(item.type) ? 0 : mainItemBasePremium(item.type);
}

/**
 * An item's own risk surcharges are charged on its price-list row, never on the
 * policy total.
 */
function itemRiskSurcharge(item: Item): number {
  return percentOf(riskBearingBasePremium(item), itemRiskSurchargePercent(item));
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
}

/** The threshold is inclusive: exactly 2 years already earns the discount. */
function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/**
 * The discount is offered on "each contract after their first", so any contract
 * preceded by at least one earlier one qualifies -- the very first does not.
 */
function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

/**
 * Policy-wide modifiers are all charged against the policy base premium, so the
 * MHPCO nets them into a single percentage: a long-standing customer earns a
 * loyalty discount, a follow-up contract earns its own discount, and every
 * quoted policy carries the first-insurance assessment.
 *
 * The assessment is deliberately unconditional -- it is not a missing check on
 * customer history. The MHPCO treats each item in a quote as a first insurance
 * regardless of how long the customer has been with the office, so even a
 * long-standing customer's follow-up contract still carries the 10 %.
 */
function policyWideModifierPercent(customer: Customer, previousContracts: number): number {
  const loyaltyPercent = isLongStanding(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUpContract(previousContracts) ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  return FIRST_INSURANCE_SURCHARGE_PERCENT + loyaltyPercent + followUpPercent;
}

export function quote(customer: Customer, items: Item[], previousContracts: number): number {
  // Item-specific modifiers are charged on the affected item's own base premium;
  // policy-wide modifiers are charged on the policy base premium, the plain sum
  // of all item base premiums -- never on a base that already carries item
  // surcharges. Settling then turns the underwritten amount into the sum payable.
  const policyBase = policyBasePremium(items);
  const netPolicyModifierPercent = policyWideModifierPercent(customer, previousContracts);
  const policyModifiers = percentOf(policyBase, netPolicyModifierPercent);
  return settlePremium(policyBase + itemSurcharges(items) + policyModifiers);
}
