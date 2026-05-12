const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

export const quote = (customer: unknown, items: unknown[], previousContracts = 0): number => {
  if (items.length === 0) return PROCESSING_FEE;
  const { yearsWithMHPCO } = customer as { yearsWithMHPCO: number };
  const item = items[0] as { type: string; cursed: boolean; enchantment: number };
  const itemBase = BASE_PREMIUM[item.type];
  const isBlock = items.length === COMPONENT_BLOCK_SIZE && items.every(i => (i as { type: string }).type === item.type);
  const policyBase = isBlock ? COMPONENT_BLOCK_BASE : items.reduce((sum, i) => sum + BASE_PREMIUM[(i as { type: string }).type], 0);
  const cursedSurcharge = item.cursed ? itemBase * CURSED_SURCHARGE_RATE : 0;
  const enchantSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = previousContracts > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(policyBase + cursedSurcharge + enchantSurcharge + policyBase * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

export const claim = (policy: unknown, incident: unknown): unknown => {
  const { cap, items } = policy as { cap: number; items: Array<{ enchantment: number }> };
  const { damages } = incident as { damages: Array<{ amount: number }> };
  const damageAmount = damages[0].amount;
  const reimbursed = items[0].enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : damageAmount;
  const uncappedPayout = reimbursed - DEDUCTIBLE;
  const payout = Math.min(uncappedPayout, cap);
  return { payout, remainingCap: cap - payout };
};
