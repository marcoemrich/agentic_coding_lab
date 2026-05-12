type Result = { premium: number } | { payout: number; remainingCap: number };

type Item = { type: string; material: string; enchantment: number; cursed: boolean };
type Damage = { itemType: string; amount: number };
type Step = {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
};
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type Policy = { insuranceSum: number; remainingCap: number };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  component: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};

const CURSED_RISK_FACTOR = 1.5;
const INITIAL_ASSESSMENT_FACTOR = 1.1;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  const results: Result[] = [];
  const policies: Policy[] = [];

  scenario.steps.forEach((step, i) => {
    if (step.op === "quote") {
      let basePremium = 0;
      let insuranceSum = 0;
      for (const item of step.items ?? []) {
        const itemBase = BASE_PREMIUMS[item.type] ?? 0;
        basePremium += item.cursed ? itemBase * CURSED_RISK_FACTOR : itemBase;
        insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
      }
      const premium = Math.floor(basePremium * INITIAL_ASSESSMENT_FACTOR) + PROCESSING_FEE;
      policies[i] = { insuranceSum, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy!];
      const totalDamage = step.incident!.damages.reduce((sum, d) => sum + d.amount, 0);
      const payout = totalDamage - DEDUCTIBLE;
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });

  return { results };
};
