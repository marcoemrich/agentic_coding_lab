const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const LOYALTY_YEARS_THRESHOLD = 2;
const COMPONENT_GROUP_SIZE = 3;
const COMPONENT_GROUP_BASE_PREMIUM = 60;

const surchargeAmount = (base: number, pct: number) => Math.ceil(base * pct / 100);
const discountAmount = (base: number, pct: number) => Math.floor(base * pct / 100);

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

export const quote = (items: unknown[], customer: { yearsWithMHPCO: number }, contractNumber: number): number => {
  const item = (items as Array<{ type: string; cursed: boolean; enchantment: number }>)[0];
  const basePremium = items.length === COMPONENT_GROUP_SIZE ? COMPONENT_GROUP_BASE_PREMIUM : BASE_PREMIUMS[item.type];
  const firstInsuranceSurcharge = contractNumber === 1 ? surchargeAmount(basePremium, 10) : 0;
  const repeatContractDiscount = contractNumber > 1 ? discountAmount(basePremium, 15) : 0;
  const cursedSurcharge = item.cursed ? surchargeAmount(basePremium, 50) : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? surchargeAmount(basePremium, 30) : 0;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? discountAmount(basePremium, 20) : 0;
  const totalSurcharges = firstInsuranceSurcharge + cursedSurcharge + enchantmentSurcharge;
  const totalDiscounts = repeatContractDiscount + loyaltyDiscount;
  return basePremium + totalSurcharges - totalDiscounts + PROCESSING_FEE;
};

export const claim = (policy: unknown, incident: unknown): unknown => {
  const damages = (incident as { damages: Array<{ amount: number; enchantment: number; material: string }> }).damages;
  const currentCap = (policy as { remainingCap: number }).remainingCap;
  const damage = damages[0];
  const reimbursable = damage.material === "dragon" || damage.enchantment < HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount
    : discountAmount(damage.amount, 50);
  const payout = Math.min(reimbursable - DEDUCTIBLE, currentCap);
  const remainingCap = currentCap - payout;
  return { payout, remainingCap };
};
