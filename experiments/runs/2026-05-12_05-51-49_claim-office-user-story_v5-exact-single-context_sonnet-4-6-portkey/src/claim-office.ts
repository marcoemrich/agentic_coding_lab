type Item = { type: string; cursed: boolean; enchantment: number };

type QuoteStep = { op: "quote"; items: Item[] };

type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number; enchantment?: number; material?: string }>;
  };
};

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
};

type ScenarioResult = {
  results: unknown[];
};

const COMPONENT_BASE_PREMIUM = 25;
const TRIPLE_COMPONENT_BASE_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.30;
const FIRST_CONTRACT_SURCHARGE_RATE = 0.10;
const LOYALTY_DISCOUNT_RATE = 0.20;
const SUBSEQUENT_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const BASE_INSURANCE_SUMS: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_SUM = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.50;

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const policyData: Array<{ insuranceSum: number; remainingCap: number }> = [];

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      const policy = policyData[step.policy];
      const totalDamage = step.incident.damages.reduce((s, d) => {
        const reimbursable = d.material !== "dragon" && d.enchantment >= 8
          ? Math.floor(d.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE)
          : d.amount;
        return s + reimbursable;
      }, 0);
      const uncappedPayout = totalDamage - DEDUCTIBLE;
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }

    const firstItem = step.items[0];
    const isTripleComponent =
      step.items.length === 3 &&
      step.items.every((i) => i.type === firstItem.type) &&
      !(firstItem.type in BASE_PREMIUMS);
    const isFirstContract = stepIndex === 0;

    const pricedItems: Array<{ item: Item; basePremium: number }> = isTripleComponent
      ? [{ item: firstItem, basePremium: TRIPLE_COMPONENT_BASE_PREMIUM }]
      : step.items.map((item) => ({ item, basePremium: BASE_PREMIUMS[item.type] ?? COMPONENT_BASE_PREMIUM }));

    const itemsTotal = pricedItems.reduce((sum, { item, basePremium }) => {
      const cursedSurcharge = item.cursed ? Math.ceil(basePremium * CURSED_SURCHARGE_RATE) : 0;
      const enchantmentSurcharge = item.enchantment >= 5 ? Math.ceil(basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE) : 0;
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? Math.floor(basePremium * LOYALTY_DISCOUNT_RATE) : 0;
      const firstContractSurcharge = isFirstContract ? Math.ceil(basePremium * FIRST_CONTRACT_SURCHARGE_RATE) : 0;
      const subsequentDiscount = !isFirstContract ? Math.floor(basePremium * SUBSEQUENT_DISCOUNT_RATE) : 0;
      return sum + basePremium + firstContractSurcharge - subsequentDiscount + cursedSurcharge + enchantmentSurcharge - loyaltyDiscount;
    }, 0);

    const insuranceSum = isTripleComponent
      ? 3 * COMPONENT_INSURANCE_SUM
      : step.items.reduce((s, item) => s + (BASE_INSURANCE_SUMS[item.type] ?? COMPONENT_INSURANCE_SUM), 0);
    policyData.push({ insuranceSum, remainingCap: CAP_MULTIPLIER * insuranceSum });

    const premium = itemsTotal + PROCESSING_FEE;
    return { premium };
  });
  return { results };
};
