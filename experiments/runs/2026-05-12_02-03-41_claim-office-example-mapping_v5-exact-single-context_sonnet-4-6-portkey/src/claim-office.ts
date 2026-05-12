const PROCESSING_FEE = 5;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

const ITEM_BASE_PREMIUMS: Record<string, number> = { sword: 100 };
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;

const computeQuotePremium = (step: any): unknown => {
  const items: any[] = step.items ?? [];
  const policyBase = items.reduce((sum, item) => sum + (ITEM_BASE_PREMIUMS[item.type] ?? 0), 0);
  const curseSurcharge = items.reduce((sum, item) => sum + (item.cursed ? (ITEM_BASE_PREMIUMS[item.type] ?? 0) * CURSE_SURCHARGE_RATE : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item) => sum + (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? (ITEM_BASE_PREMIUMS[item.type] ?? 0) * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0), 0);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  return { premium: Math.ceil(policyBase + curseSurcharge + enchantmentSurcharge + firstInsuranceSurcharge + PROCESSING_FEE) };
};

const ITEM_INSURANCE_VALUES: Record<string, number> = { sword: 1000 };
const DEDUCTIBLE = 100;

export const processScenario = (scenario: Scenario): { results: unknown[] } => {
  const results: unknown[] = [];
  const remainingCaps: Record<number, number> = {};

  scenario.steps.forEach((step: any) => {
    if (step.op === "claim") {
      const policyStep = scenario.steps[step.policy] as any;
      const items: any[] = policyStep.items ?? [];
      const insuranceSum = items.reduce((sum: number, item: any) => sum + (ITEM_INSURANCE_VALUES[item.type] ?? 0), 0);
      if (remainingCaps[step.policy] === undefined) remainingCaps[step.policy] = insuranceSum * 2;
      const cap = remainingCaps[step.policy];
      const rawPayout = (step.incident.damages as any[]).reduce((sum: number, d: any) => sum + Math.max(0, d.amount - DEDUCTIBLE), 0);
      const payout = Math.floor(Math.min(rawPayout, cap));
      remainingCaps[step.policy] = cap - payout;
      results.push({ payout, remainingCap: remainingCaps[step.policy] });
    } else {
      results.push(computeQuotePremium(step));
    }
  });

  return { results };
};
