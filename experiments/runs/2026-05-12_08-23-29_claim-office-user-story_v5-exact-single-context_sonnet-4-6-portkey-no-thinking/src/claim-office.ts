const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const INSURANCE_SUMS: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

// Quote constants
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const SUBSEQUENT_CONTRACT_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;

// Claim constants
const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

const quoteStep = (step: any, years: number): { premium: number } => {
  const item = step.items[0];
  const basePremium = step.items.length === BUILDING_BLOCK_SIZE ? BUILDING_BLOCK_PREMIUM : BASE_PREMIUMS[item.type];
  const isNewCustomer = years === 0;
  const isSubsequentCustomer = years > 0 && years < LOYALTY_YEARS_THRESHOLD;
  const isLoyalCustomer = years >= LOYALTY_YEARS_THRESHOLD;
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantedSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  const firstInsuranceSurcharge = isNewCustomer ? basePremium * FIRST_INSURANCE_SURCHARGE_RATE : 0;
  const loyaltyDiscount = isLoyalCustomer ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const subsequentDiscount = isSubsequentCustomer ? basePremium * SUBSEQUENT_CONTRACT_DISCOUNT_RATE : 0;
  const premium = Math.ceil(basePremium + cursedSurcharge + enchantedSurcharge + firstInsuranceSurcharge - loyaltyDiscount - subsequentDiscount + PROCESSING_FEE);
  return { premium };
};

const claimStep = (step: any, steps: any[], currentRemainingCap: number): { payout: number; remainingCap: number } => {
  const policyStep = steps[step.policy];
  const item = policyStep.items[0];
  const damage = step.incident.damages[0].amount;
  const isDragonMaterial = item.material === DRAGON_MATERIAL;
  const effectiveDamage = item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? damage * ENCHANTMENT_REIMBURSEMENT_RATE : damage;
  const uncappedPayout = isDragonMaterial ? damage : Math.ceil(effectiveDamage - DEDUCTIBLE);
  const payout = Math.min(uncappedPayout, currentRemainingCap);
  const remainingCap = currentRemainingCap - payout;
  return { payout, remainingCap };
};

export const processScenario = (input: any): any => {
  const years = input.customer.yearsWithMHPCO;
  const remainingCaps = new Map<number, number>();
  const results = [];
  for (const step of input.steps) {
    if (step.op === "quote") {
      results.push(quoteStep(step, years));
    } else {
      const policyStep = input.steps[step.policy];
      const insuranceSum = INSURANCE_SUMS[policyStep.items[0].type];
      const payoutCap = insuranceSum * PAYOUT_CAP_MULTIPLIER;
      const currentRemainingCap = remainingCaps.get(step.policy) ?? payoutCap;
      const result = claimStep(step, input.steps, currentRemainingCap);
      remainingCaps.set(step.policy, result.remainingCap);
      results.push(result);
    }
  }
  return { results };
};
