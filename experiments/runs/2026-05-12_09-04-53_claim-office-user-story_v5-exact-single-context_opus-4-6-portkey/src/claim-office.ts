interface ScenarioResult {
  results: Array<{ premium?: number; payout?: number; remainingCap?: number }>;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const DEDUCTIBLE = 100;

const COMPONENT_TYPES = new Set(["rune"]);
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

function calculateMainItemPremium(item: any): number {
  let premium = BASE_PREMIUMS[item.type];
  if (item.cursed) {
    premium = premium * 3 / 2;
  }
  if (item.enchantment >= 5) {
    premium = premium * 13 / 10;
  }
  return premium;
}

function calculateItemPremiums(items: any[]): number {
  const componentCounts: Record<string, number> = {};
  let mainItemPremium = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      mainItemPremium += calculateMainItemPremium(item);
    }
  }

  let componentPremium = 0;
  for (const type of Object.keys(componentCounts)) {
    const count = componentCounts[type];
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remaining = count % BUILDING_BLOCK_SIZE;
    componentPremium += blocks * BUILDING_BLOCK_PREMIUM + remaining * BASE_PREMIUMS[type];
  }

  return mainItemPremium + componentPremium;
}

function applyCustomerModifiers(premium: number, customer: any, isFirstInsurance: boolean): number {
  let adjusted = premium;
  if (isFirstInsurance) {
    adjusted = adjusted * 11 / 10;
  } else {
    adjusted = adjusted * 17 / 20;
    if (customer.yearsWithMHPCO >= 2) {
      adjusted = adjusted * 4 / 5;
    }
  }
  return adjusted;
}

function processQuote(step: any, customer: any, isFirstInsurance: boolean): { premium: number } {
  const itemPremiums = calculateItemPremiums(step.items);
  const adjusted = applyCustomerModifiers(itemPremiums, customer, isFirstInsurance);
  const premium = Math.ceil(adjusted) + PROCESSING_FEE;
  return { premium };
}

function calculateInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUES[item.type] || 0;
  }
  return sum;
}

function processClaim(step: any, policy: { items: any[]; remainingCap: number }): { payout: number; remainingCap: number } {
  let reimbursableDamage = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    const isDragonMaterial = item && item.material === "dragon";
    const isHighlyEnchanted = item && item.enchantment >= 8;
    const amount = (!isDragonMaterial && isHighlyEnchanted)
      ? Math.floor(damage.amount / 2)
      : damage.amount;
    reimbursableDamage += amount;
  }
  const uncappedPayout = Math.max(0, Math.floor(reimbursableDamage - DEDUCTIBLE));
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): ScenarioResult {
  const customer = scenario.customer;
  const results: ScenarioResult["results"] = [];
  let quoteCount = 0;
  const policies: Array<{ items: any[]; remainingCap: number }> = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFirstInsurance = customer.yearsWithMHPCO === 0 && quoteCount === 0;
      results.push(processQuote(step, customer, isFirstInsurance));
      policies.push({ items: step.items, remainingCap: calculateInsuranceSum(step.items) * 2 });
      quoteCount++;
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies[step.policy]));
    }
  }

  return { results };
}
