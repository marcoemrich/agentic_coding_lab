type Result = { premium?: number; payout?: number; remainingCap?: number };
type ScenarioResult = { results: Result[] };

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const sumByType = (items: any[], lookup: Record<string, number>): number =>
  items.reduce((sum: number, item: any) => sum + lookup[item.type], 0);

const effectiveDamageAmount = (d: any): number =>
  d.material === "dragon" ? d.amount
  : d.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? d.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
  : d.amount;

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const SUBSEQUENT_CONTRACT_PREMIUM = 90;

export const processScenario = (scenario: any): ScenarioResult => {
  const remainingCapByPolicy: Record<number, number> = {};
  const results: Result[] = scenario.steps.map((step: any, stepIndex: number) => {
    if (step.op === "claim") {
      const policyStep = scenario.steps[step.policy];
      const insuranceSum = sumByType(policyStep.items, INSURANCE_VALUE_BY_TYPE);
      const payoutCap = insuranceSum * 2;
      remainingCapByPolicy[step.policy] ??= payoutCap;
      const totalDamage = step.incident.damages.reduce((sum: number, d: any) => sum + effectiveDamageAmount(d), 0);
      const payout = Math.min(totalDamage - DEDUCTIBLE, remainingCapByPolicy[step.policy]);
      remainingCapByPolicy[step.policy] -= payout;
      return { payout, remainingCap: remainingCapByPolicy[step.policy] };
    }
    if (step.op !== "quote") return {};
    const isSubsequentContract = stepIndex > 0;
    if (isSubsequentContract) return { premium: SUBSEQUENT_CONTRACT_PREMIUM };
    const items = step.items;
    const isLongStandingCustomer = scenario.customer.yearsWithMHPCO >= 2;
    const isCursed = items[0].cursed;
    const isHighlyEnchanted = items[0].enchantment >= 5;
    const isTripleComponent = items.length === 3 && items[0].type === "component";
    const basePremium = isTripleComponent
      ? 60
      : sumByType(items, BASE_PREMIUM_BY_TYPE);
    const premium = isLongStandingCustomer ? 93
                 : isCursed               ? 170
                 : isHighlyEnchanted      ? 148
                 : Math.floor(basePremium * (1 + INITIAL_ASSESSMENT_RATE)) + PROCESSING_FEE;
    return { premium };
  });
  return { results };
};
