const PROCESSING_FEE = 5;
const BLOCK_QUANTITY = 3;
const BLOCK_RATE = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_PAYOUT_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

const basePremiumFor = (type: string): number => BASE_PREMIUMS[type] ?? 100;

export const quote = (
  customer: unknown,
  items: unknown[],
  isFirstQuote?: boolean
): number => {
  const typedItems = items as { type: string; cursed?: boolean; enchantment?: number }[];
  const typeCounts = typedItems.reduce<Record<string, number>>(
    (acc, item) => ({ ...acc, [item.type]: (acc[item.type] ?? 0) + 1 }),
    {}
  );
  const policyBase = Object.entries(typeCounts).reduce(
    (sum, [type, count]) => sum + (count === BLOCK_QUANTITY ? BLOCK_RATE : count * basePremiumFor(type)),
    0
  );
  const { curseSurcharges, enchantSurcharges } = typedItems.reduce(
    (acc, item) => {
      const base = basePremiumFor(item.type);
      return {
        curseSurcharges: acc.curseSurcharges + (item.cursed ? base * CURSE_SURCHARGE_RATE : 0),
        enchantSurcharges: acc.enchantSurcharges + ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD ? base * ENCHANT_SURCHARGE_RATE : 0),
      };
    },
    { curseSurcharges: 0, enchantSurcharges: 0 }
  );
  const loyaltyDiscount = (customer as { yearsWithMHPCO: number }).yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = isFirstQuote ? policyBase * FIRST_INSURANCE_RATE : 0;
  const followUpDiscount = isFirstQuote ? 0 : policyBase * FOLLOW_UP_DISCOUNT_RATE;
  const premiumBeforeFee = policyBase + curseSurcharges + enchantSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
  return Math.ceil(premiumBeforeFee + PROCESSING_FEE);
};

export const claim = (
  _customer: unknown,
  policy: unknown,
  incident: unknown
): { payout: number; remainingCap: number } => {
  const typedPolicy = policy as { item: { enchantment?: number }; remainingCap: number };
  const basePayout = (incident as { damage: number }).damage - DEDUCTIBLE;
  const uncappedPayout = (typedPolicy.item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD ? basePayout * HIGH_ENCHANT_PAYOUT_RATE : basePayout;
  const payout = Math.floor(Math.min(uncappedPayout, typedPolicy.remainingCap));
  const remainingCap = typedPolicy.remainingCap - payout;
  return { payout, remainingCap };
};
