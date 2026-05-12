const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const DEDUCTIBLE = 100;

function isComponent(type: string): boolean {
  return !(type in BASE_PREMIUMS);
}

function computeItemPremium(item: any): number {
  let premium = BASE_PREMIUMS[item.type];
  if (item.cursed) {
    premium = premium * 150 / 100;
  }
  if (item.enchantment >= 5) {
    premium = premium * 130 / 100;
  }
  return premium;
}

function computeComponentsPremium(components: any[]): number {
  const counts: Record<string, number> = {};
  for (const item of components) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  let premium = 0;
  for (const type in counts) {
    const count = counts[type];
    const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
    const remaining = count % COMPONENT_BLOCK_SIZE;
    premium += blocks * COMPONENT_BLOCK_PREMIUM + remaining * COMPONENT_PREMIUM;
  }
  return premium;
}

function computeQuotePremium(items: any[], customer: any, isFirstQuote: boolean): number {
  const mainItems = items.filter((item: any) => !isComponent(item.type));
  const components = items.filter((item: any) => isComponent(item.type));
  let premium = 0;
  for (const item of mainItems) {
    premium += computeItemPremium(item);
  }
  premium += computeComponentsPremium(components);
  const contractModifier = isFirstQuote ? 110 : 85;
  premium = premium * contractModifier / 100;
  if (customer.yearsWithMHPCO >= 2) {
    premium = premium * 80 / 100;
  }
  return Math.ceil(premium + PROCESSING_FEE);
}

function computeInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUES[item.type] || 250;
  }
  return sum;
}

function processClaim(step: any, policy: any): any {
  let effectiveDamage = 0;
  for (const damage of step.incident.damages) {
    const amount = damage.enchantment >= 8 ? damage.amount * 50 / 100 : damage.amount;
    effectiveDamage += amount;
  }
  const uncappedPayout = Math.max(0, effectiveDamage - DEDUCTIBLE);
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const policies: any[] = [];
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      quoteCount++;
      const insuranceSum = computeInsuranceSum(step.items);
      policies[index] = { insuranceSum, remainingCap: insuranceSum * 2 };
      return { premium: computeQuotePremium(step.items, scenario.customer, quoteCount === 1) };
    }
    if (step.op === "claim") {
      return processClaim(step, policies[step.policy]);
    }
  });
  return { results };
}
