const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 0.50;
const ENCHANTMENT_SURCHARGE = 0.30;
const ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const LOYALTY_DISCOUNT = 0.20;
const LOYALTY_YEARS_THRESHOLD = 2;
const MULTI_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.50;

function roundInFavorOfMHPCO(amount: number): number {
  return Math.ceil(amount - 1e-9);
}

function calculateTotalItemPremium(items: any[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (item.type in MAIN_ITEM_PREMIUMS) {
      const riskSurchargeRate =
        (item.cursed ? CURSED_SURCHARGE : 0) +
        (item.enchantment >= ENCHANTMENT_THRESHOLD ? ENCHANTMENT_SURCHARGE : 0);
      total += MAIN_ITEM_PREMIUMS[item.type] * (1 + riskSurchargeRate);
    } else {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    }
  }

  for (const type of Object.keys(componentCounts)) {
    const count = componentCounts[type];
    const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
    const remainder = count % COMPONENT_BLOCK_SIZE;
    total += blocks * COMPONENT_BLOCK_PREMIUM + remainder * COMPONENT_PREMIUM;
  }

  return total;
}

function calculateInsuranceSum(items: any[]): number {
  let total = 0;
  for (const item of items) {
    total += MAIN_ITEM_INSURANCE_VALUES[item.type] || COMPONENT_INSURANCE_VALUE;
  }
  return total;
}

function getReimbursementRate(item: any): number {
  if (item.material === "dragon") return 1;
  if (item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return 1;
}

export const processScenario = (scenario: any): unknown => {
  const { customer } = scenario;
  const isLoyalCustomer = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  let quoteCount = 0;
  const policies: Array<{ items: any[]; insuranceSum: number; remainingCap: number }> = [];
  return {
    results: scenario.steps.map((step: any, stepIndex: number) => {
      if (step.op === "quote") {
        const isFirstQuote = quoteCount === 0;
        quoteCount++;
        const customerAdjustment = isFirstQuote
          ? (isLoyalCustomer ? -LOYALTY_DISCOUNT : FIRST_INSURANCE_SURCHARGE)
          : -MULTI_CONTRACT_DISCOUNT;
        const totalItemPremium = calculateTotalItemPremium(step.items);
        const premium = roundInFavorOfMHPCO(totalItemPremium * (1 + customerAdjustment)) + PROCESSING_FEE;
        const insuranceSum = calculateInsuranceSum(step.items);
        policies[stepIndex] = { items: step.items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
        return { premium };
      }
      if (step.op === "claim") {
        const policy = policies[step.policy];
        const totalReimbursable = step.incident.damages.reduce((sum: number, d: any) => {
          const item = policy.items.find((i: any) => i.type === d.itemType);
          return sum + d.amount * getReimbursementRate(item);
        }, 0);
        const payout = Math.min(totalReimbursable - DEDUCTIBLE, policy.remainingCap);
        policy.remainingCap -= payout;
        return { payout, remainingCap: policy.remainingCap };
      }
      return {};
    }),
  };
};
