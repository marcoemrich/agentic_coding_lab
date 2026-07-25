export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteCustomer {
  yearsWithMHPCO: number;
}

export interface QuoteInput {
  customer: QuoteCustomer;
  items: QuoteItem[];
}

const PROCESSING_FEE_GOLD = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_OF_3_PREMIUM = 60;

const FIRST_INSURANCE_MULTIPLIER = 1.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Rounds up to the nearest whole gold, avoiding floating-point artifacts
// like 100 * 1.1 = 110.00000000000001 by rounding to 6 decimals first.
const roundUpToWholeGold = (amount: number): number => {
  return Math.ceil(Math.round(amount * 1e6) / 1e6);
};

export interface QuoteContext {
  isFollowUpContract?: boolean;
}

export const calculatePremium = (
  input: QuoteInput,
  context: QuoteContext = {}
): number => {
  if (input.items.length === 0) {
    return PROCESSING_FEE_GOLD;
  }

  const componentPremium = (count: number): number => {
    if (count === 3) {
      return COMPONENT_BLOCK_OF_3_PREMIUM;
    }
    return count * COMPONENT_BASE_PREMIUM;
  };

  const isComponent = (item: QuoteItem) => COMPONENT_TYPES.includes(item.type);
  const componentItems = input.items.filter(isComponent);
  const mainItems = input.items.filter((item) => !isComponent(item));

  const componentsSum = COMPONENT_TYPES.reduce((sum, type) => {
    const count = componentItems.filter((item) => item.type === type).length;
    return sum + componentPremium(count);
  }, 0);

  const policyBaseSum =
    componentsSum +
    mainItems.reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);

  // A cursed item incurs a surcharge equal to 50% of its own base premium;
  // a highly enchanted item (enchantment >= threshold) incurs a 30% surcharge
  // (spec: item-specific modifiers apply to the affected item's base premium).
  const cursedSurcharge = (item: QuoteItem): number =>
    item.cursed ? BASE_PREMIUMS[item.type] * CURSED_SURCHARGE_RATE : 0;

  const highEnchantmentSurcharge = (item: QuoteItem): number =>
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;

  const itemSurchargeSum = mainItems.reduce(
    (sum, item) => sum + cursedSurcharge(item) + highEnchantmentSurcharge(item),
    0
  );

  // Sum after the first-insurance multiplier and item surcharges, but before
  // any policy-wide discounts (loyalty and/or follow-up contract).
  const policySumBeforeDiscounts =
    policyBaseSum * FIRST_INSURANCE_MULTIPLIER + itemSurchargeSum;

  const loyaltyDiscount =
    input.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBaseSum * LOYALTY_DISCOUNT_RATE
      : 0;

  const followUpDiscount = context.isFollowUpContract
    ? policyBaseSum * FOLLOW_UP_CONTRACT_DISCOUNT_RATE
    : 0;

  const total =
    policySumBeforeDiscounts -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE_GOLD;
  return roundUpToWholeGold(total);
};
