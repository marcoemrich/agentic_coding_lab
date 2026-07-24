const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25 };
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.10;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;
const CURSED_RISK_FACTOR = 1.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RISK_FACTOR = 1.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_FACTOR = 0.8;
const REPEAT_CONTRACT_DISCOUNT_FACTOR = 0.85;
const DEDUCTIBLE = 100;

export const quote = (
  customer: { yearsWithMHPCO: number },
  items: { type: string; material?: string; enchantment?: number; cursed?: boolean }[],
  contractNumber: number
): number => {
  const item = items[0];
  let basePremium = items.length === COMPONENT_BUNDLE_SIZE ? COMPONENT_BUNDLE_PREMIUM : BASE_PREMIUMS[item.type];
  if (item.cursed) basePremium *= CURSED_RISK_FACTOR;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) basePremium *= HIGH_ENCHANTMENT_RISK_FACTOR;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) basePremium *= LOYALTY_DISCOUNT_FACTOR;
  if (contractNumber >= 2) {
    return Math.ceil(basePremium * REPEAT_CONTRACT_DISCOUNT_FACTOR + PROCESSING_FEE);
  }
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  return Math.ceil(basePremium + firstInsuranceSurcharge + PROCESSING_FEE);
};

export const claim = (
  policy: { items: { type: string; material?: string; enchantment?: number }[] },
  incident: { cause: string; damages: { itemType: string; amount: number }[] }
): number => {
  const totalDamage = incident.damages.reduce((sum, d) => sum + d.amount, 0);
  return totalDamage - DEDUCTIBLE;
};
