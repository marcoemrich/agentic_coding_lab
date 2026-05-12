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

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = -20;
const REPEAT_CONTRACT_DISCOUNT_PERCENT = -15;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PROCESSING_FEE = 5;
const HIGH_ENCHANTMENT_REIMBURSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSE_PERCENT = 50;

function adjustByPercent(amount: number, percent: number): number {
  return Math.ceil(amount * (100 + percent) / 100);
}

function isMainItem(item: any): boolean {
  return item.type in BASE_PREMIUMS;
}

function computeItemPremium(item: any): number {
  let premium = BASE_PREMIUMS[item.type];
  if (item.cursed) {
    premium = adjustByPercent(premium, CURSED_SURCHARGE_PERCENT);
  }
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    premium = adjustByPercent(premium, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);
  }
  return premium;
}

function computeBasePremium(items: any[]): number {
  const mainItemTotal = items
    .filter(isMainItem)
    .reduce((sum, item) => sum + computeItemPremium(item), 0);

  const componentCount = items.filter((item) => !isMainItem(item)).length;
  const blocks = Math.floor(componentCount / COMPONENT_BLOCK_SIZE);
  const remainder = componentCount % COMPONENT_BLOCK_SIZE;
  const componentTotal = blocks * COMPONENT_BLOCK_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;

  return mainItemTotal + componentTotal;
}

function computeInsuranceSum(items: any[]): number {
  return items.reduce((sum, item) => {
    const value = INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE;
    return sum + value;
  }, 0);
}

function processQuote(step: any, customer: any, quoteCount: number): { premium: number } {
  const basePremium = computeBasePremium(step.items);
  const contractPercent = quoteCount === 0
    ? FIRST_INSURANCE_SURCHARGE_PERCENT
    : REPEAT_CONTRACT_DISCOUNT_PERCENT;
  let premium = adjustByPercent(basePremium, contractPercent);
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium = adjustByPercent(premium, LOYALTY_DISCOUNT_PERCENT);
  }
  premium += PROCESSING_FEE;
  return { premium };
}

function reimbursableAmount(d: any): number {
  if (d.material === "dragon") return d.amount;
  if (d.enchantment >= HIGH_ENCHANTMENT_REIMBURSE_THRESHOLD) {
    return Math.floor(d.amount * HIGH_ENCHANTMENT_REIMBURSE_PERCENT / 100);
  }
  return d.amount;
}

function processClaim(step: any, policy: { remainingCap: number }): { payout: number; remainingCap: number } {
  const totalDamage = step.incident.damages.reduce(
    (sum: number, d: any) => sum + reimbursableAmount(d), 0
  );
  const payout = Math.min(Math.max(0, totalDamage - DEDUCTIBLE), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  const customer = scenario.customer;
  let quoteCount = 0;
  const policies: { items: any[]; remainingCap: number }[] = [];
  const results = scenario.steps.map((step: any) => {
    if (step.op === "quote") {
      const result = processQuote(step, customer, quoteCount);
      quoteCount++;
      const insuranceSum = computeInsuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      return result;
    } else {
      return processClaim(step, policies[step.policy]);
    }
  });
  return { results };
}
