export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const INSURANCE_VALUES: Record<string, number> = {
  amulet: 600,
};

const INITIAL_ASSESSMENT_SURCHARGE_NUMERATOR = 110;
const MULTI_CONTRACT_DISCOUNT_NUMERATOR = 85;
const CURSED_SURCHARGE_NUMERATOR = 150;
const ENCHANTMENT_SURCHARGE_NUMERATOR = 130;
const LOYALTY_DISCOUNT_NUMERATOR = 80;
const COMPONENT_BASE_PREMIUM = 25;
const GROUP_COMPONENT_COUNT = 3;
const GROUP_COMPONENT_PREMIUM = 60;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const PROCESSING_FEE = 5;
const PERCENTAGE_BASE = 100;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_NUMERATOR = 50;
const DRAGON_MATERIAL = "dragon";

export const processScenario = (scenario: Scenario): { results: unknown[] } => {
  const policies: Array<{ remainingCap: number; items: Array<{ type: string; enchantment: number; material: string }> }> = [];
  const results = scenario.steps.map((s, stepIndex) => {
    const step = s as {
      op: string;
      items?: Array<{ type: string; material: string; cursed: boolean; enchantment: number }>;
      policy?: number;
      incident?: { damages: Array<{ itemType: string; amount: number }> };
    };

    if (step.op === "claim") {
      const policy = policies[step.policy!];
      const { dragonTotal, nonDragonTotal } = step.incident!.damages.reduce((acc, d) => {
        const claimedItem = policy.items.find(i => i.type === d.itemType);
        if (claimedItem?.material === DRAGON_MATERIAL) {
          return { ...acc, dragonTotal: acc.dragonTotal + d.amount };
        }
        const amount = claimedItem && claimedItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD ? d.amount * HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_NUMERATOR / PERCENTAGE_BASE : d.amount;
        return { ...acc, nonDragonTotal: acc.nonDragonTotal + amount };
      }, { dragonTotal: 0, nonDragonTotal: 0 });
      const uncappedPayout = dragonTotal + Math.max(0, nonDragonTotal - DEDUCTIBLE);
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
    const insuranceSum = step.items!.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE), 0);
    policies[stepIndex] = { remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER, items: step.items! };

    const isThreeAlikeComponents = step.items!.length === GROUP_COMPONENT_COUNT &&
      step.items!.every(i => i.type === step.items[0].type) &&
      BASE_PREMIUMS[step.items[0].type] === undefined;
    const totalBase = isThreeAlikeComponents
      ? GROUP_COMPONENT_PREMIUM
      : step.items.reduce((sum, item) => {
          const base = BASE_PREMIUMS[item.type] ?? COMPONENT_BASE_PREMIUM;
          const afterCursed = item.cursed ? base * CURSED_SURCHARGE_NUMERATOR / PERCENTAGE_BASE : base;
          const afterEnchanted = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? afterCursed * ENCHANTMENT_SURCHARGE_NUMERATOR / PERCENTAGE_BASE : afterCursed;
          return sum + afterEnchanted;
        }, 0);
    const afterAssessment = stepIndex === 0
      ? totalBase * INITIAL_ASSESSMENT_SURCHARGE_NUMERATOR / PERCENTAGE_BASE
      : totalBase * MULTI_CONTRACT_DISCOUNT_NUMERATOR / PERCENTAGE_BASE;
    const afterLoyalty = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? afterAssessment * LOYALTY_DISCOUNT_NUMERATOR / PERCENTAGE_BASE : afterAssessment;
    const premium = Math.ceil(afterLoyalty) + PROCESSING_FEE;
    return { premium };
  });
  return { results };
};
