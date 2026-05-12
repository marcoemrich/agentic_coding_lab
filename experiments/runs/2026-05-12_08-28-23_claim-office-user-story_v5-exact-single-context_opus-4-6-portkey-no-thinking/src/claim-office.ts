const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const COMPONENT_INSURANCE_VALUE = 250;

const ITEM_CATALOG: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

function calculateQuotePremium(items: any[], customer: any, quoteIndex: number): number {
  let basePremium = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (ITEM_CATALOG[item.type] != null) {
      const base = ITEM_CATALOG[item.type].basePremium;
      let itemPremium = base;
      if (item.cursed) itemPremium += base / 2;
      if (item.enchantment >= 5) itemPremium += base * 3 / 10;
      basePremium += itemPremium;
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }
  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / 3);
    const remainder = count % 3;
    basePremium += blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_PREMIUM;
  }
  const customerAdjustment = customer.yearsWithMHPCO >= 2
    ? -basePremium / 5
    : basePremium / 10;
  let premiumBeforeFee = basePremium + customerAdjustment;
  if (quoteIndex > 0) {
    premiumBeforeFee = premiumBeforeFee * 17 / 20;
  }
  return Math.ceil(premiumBeforeFee + PROCESSING_FEE);
}

function calculateInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    if (ITEM_CATALOG[item.type] != null) {
      sum += ITEM_CATALOG[item.type].insuranceValue;
    } else {
      sum += COMPONENT_INSURANCE_VALUE;
    }
  }
  return sum;
}

function processClaim(policy: { insuranceSum: number; remainingCap: number; items: any[] }, incident: any): { payout: number; remainingCap: number } {
  let reimbursableAmount = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((it: any) => it.type === damage.itemType);
    const isDragon = item?.material === "dragon";
    const reducedForEnchantment = item && item.enchantment >= 8 && !isDragon;
    reimbursableAmount += reducedForEnchantment ? damage.amount / 2 : damage.amount;
  }
  const uncappedPayout = Math.max(0, reimbursableAmount - DEDUCTIBLE);
  const payout = Math.floor(Math.min(policy.remainingCap, uncappedPayout));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: any): any {
  let quoteCount = 0;
  const policies: { insuranceSum: number; remainingCap: number; items: any[] }[] = [];
  const results: any[] = [];
  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    if (step.op === "quote") {
      const insuranceSum = calculateInsuranceSum(step.items);
      policies[i] = { insuranceSum, remainingCap: insuranceSum * 2, items: step.items };
      results.push({ premium: calculateQuotePremium(step.items, input.customer, quoteCount++) });
    } else if (step.op === "claim") {
      results.push(processClaim(policies[step.policy], step.incident));
    }
  }
  return { results };
}
