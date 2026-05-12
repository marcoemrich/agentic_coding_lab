const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PCT = 110; // 10% surcharge → multiply by 110/100
const CURSED_SURCHARGE_PCT = 150;              // 50% risk surcharge → multiply by 150/100
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 130;    // 30% risk surcharge → multiply by 130/100
const LOYALTY_DISCOUNT_PCT = 80;               // 20% loyalty discount → multiply by 80/100
const SUBSEQUENT_CONTRACT_DISCOUNT_PCT = 85;   // 15% subsequent-contract discount → multiply by 85/100
const COMPONENT_BUNDLE_PREMIUM = 60;           // 3 alike components → special base premium
const PCT_DIVISOR = 100 * 100 * 100 * 100;     // denominator for 4 chained %-multipliers

const DEDUCTIBLE = 100;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

export const processScenario = (scenario: any): unknown => {
  const results: any[] = [];
  const policies: any[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step: any, stepIndex: number) => {
    if (step.op === "quote") {
      const items = step.items;
      const item = items[0];
      const base = items.length === 3 ? COMPONENT_BUNDLE_PREMIUM : BASE_PREMIUMS[item.type];
      const cursedPct = item.cursed ? CURSED_SURCHARGE_PCT : 100;
      const enchantedPct = item.enchantment >= 5 ? HIGH_ENCHANTMENT_SURCHARGE_PCT : 100;
      const loyaltyPct = scenario.customer.yearsWithMHPCO >= 2 ? LOYALTY_DISCOUNT_PCT : 100;
      const contractPct = quoteCount === 0 ? FIRST_INSURANCE_SURCHARGE_PCT : SUBSEQUENT_CONTRACT_DISCOUNT_PCT;
      const premium = Math.ceil(base * cursedPct * enchantedPct * loyaltyPct * contractPct / PCT_DIVISOR) + PROCESSING_FEE;
      results.push({ premium });
      const insuranceSum = INSURANCE_VALUES[item.type];
      policies[stepIndex] = { remainingCap: 2 * insuranceSum };
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const totalDamage = step.incident.damages.reduce((sum: number, d: any) => sum + d.amount, 0);
      const uncappedPayout = Math.max(0, totalDamage - DEDUCTIBLE);
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });
  return { results };
};
