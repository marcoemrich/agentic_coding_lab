const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE = 1.10;
const CURSED_RISK_SURCHARGE = 1.50;
const ENCHANTMENT_RISK_SURCHARGE = 1.30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.80;
const LONG_STANDING_CUSTOMER_YEARS = 2;
const MULTI_CONTRACT_DISCOUNT = 0.85;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  component: 25,
};

const roundUpG = (amount: number): number => Math.ceil(Math.round(amount * 100) / 100);
const applyIf = (condition: boolean, factor: number): number => condition ? factor : 1;

export const quote = (customer: { yearsWithMHPCO: number; contractCount: number }, items: { type: string; cursed: boolean; enchantment: number }[]): number => {
  const loyaltyMultiplier = applyIf(customer.yearsWithMHPCO >= LONG_STANDING_CUSTOMER_YEARS, LOYALTY_DISCOUNT);
  const contractRateMultiplier = customer.contractCount === 0 ? INITIAL_ASSESSMENT_SURCHARGE : MULTI_CONTRACT_DISCOUNT;
  const totalItemPremium = items.reduce((sum, item) => {
    const basePremium = BASE_PREMIUMS[item.type];
    const cursedMultiplier = applyIf(item.cursed, CURSED_RISK_SURCHARGE);
    const enchantmentMultiplier = applyIf(item.enchantment >= HIGH_ENCHANTMENT_LEVEL, ENCHANTMENT_RISK_SURCHARGE);
    return sum + roundUpG(basePremium * contractRateMultiplier * cursedMultiplier * enchantmentMultiplier * loyaltyMultiplier);
  }, 0);
  return totalItemPremium + PROCESSING_FEE;
};

export const claim = (policy: { remainingCap: number }, incident: { damages: { amount: number; enchantment: number; material: string }[] }): { payout: number; remainingCap: number } => {
  const damage = incident.damages[0];
  const rawPayout = Math.max(0, damage.amount - DEDUCTIBLE);
  const fullReimbursement = damage.material === "dragon" || damage.enchantment < HIGH_ENCHANTMENT_CLAIM_LEVEL;
  const adjustedPayout = fullReimbursement ? rawPayout : rawPayout * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  const payout = Math.min(adjustedPayout, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};
