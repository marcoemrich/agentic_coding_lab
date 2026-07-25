import type { Item, QuoteCustomer } from "./types.js";
import { correctFloatingPointError } from "./rounding.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Rounds up to the next whole gold piece, in the MHPCO's favor.
const roundUpToNearestGold = (amount: number): number => Math.ceil(correctFloatingPointError(amount));

const getBasePremiumForType = (type: string): number => {
  const basePremium = BASE_PREMIUM_BY_ITEM_TYPE[type];
  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

// A block of exactly BLOCK_SIZE alike items is priced as a discounted
// bundle (BLOCK_PRICE) instead of at the per-item base premium.
const priceForItemGroup = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * getBasePremiumForType(type);

const sumBasePremiums = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    total += priceForItemGroup(type, count);
  }
  return total;
};

// Every surcharge and discount in this policy takes the same shape: a
// percentage of some base amount, applied only when a condition holds
// (cursed, highly enchanted, loyal, follow-up contract). Naming that
// shared shape once avoids repeating "condition ? base * rate : 0" for
// each of the four modifiers below.
const amountIfEligible = (condition: boolean | undefined, base: number, rate: number): number =>
  condition ? base * rate : 0;

const sumItemModifierSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => {
    const itemBase = getBasePremiumForType(item.type);
    const curseSurcharge = amountIfEligible(item.cursed, itemBase, CURSE_SURCHARGE_RATE);
    const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
    const enchantmentSurcharge = amountIfEligible(isHighlyEnchanted, itemBase, HIGH_ENCHANTMENT_SURCHARGE_RATE);
    return sum + curseSurcharge + enchantmentSurcharge;
  }, 0);

// A returning customer (>= LOYALTY_YEARS_THRESHOLD years) gets a discount
// off the policy base premium, mirroring how sumItemModifierSurcharges
// isolates the item-specific modifiers.
const computeLoyaltyDiscount = (customer: QuoteCustomer, policyBase: number): number =>
  amountIfEligible(customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD, policyBase, LOYALTY_DISCOUNT_RATE);

// A customer on a follow-up contract gets a discount off the policy base
// premium, mirroring computeLoyaltyDiscount's shape for policy-wide discounts.
const computeFollowUpDiscount = (customer: QuoteCustomer, policyBase: number): number =>
  amountIfEligible(customer.isFollowUpContract, policyBase, FOLLOW_UP_CONTRACT_DISCOUNT_RATE);

export const computePremium = (customer: QuoteCustomer, items: Item[]): number => {
  const policyBase = sumBasePremiums(items);
  const withFirstInsurance = policyBase * (1 + FIRST_INSURANCE_SURCHARGE_RATE);
  const loyaltyDiscount = computeLoyaltyDiscount(customer, policyBase);
  const followUpDiscount = computeFollowUpDiscount(customer, policyBase);
  const withPolicyModifiers = withFirstInsurance - loyaltyDiscount - followUpDiscount;
  const withItemSurcharges = withPolicyModifiers + sumItemModifierSurcharges(items);
  const total = withItemSurcharges + PROCESSING_FEE;
  return roundUpToNearestGold(total);
};
