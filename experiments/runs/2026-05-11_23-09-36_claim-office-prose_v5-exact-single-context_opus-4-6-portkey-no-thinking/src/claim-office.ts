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
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT = 0.50;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;
const CURSED_SURCHARGE = 0.50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.30;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.20;
const REPEAT_CUSTOMER_DISCOUNT = 0.15;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const PROCESSING_FEE = 5;

function computeBasePremium(items: any[]): number {
  let basePremium = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    const mainPremium = BASE_PREMIUMS[item.type];
    if (mainPremium !== undefined) {
      let itemPremium = mainPremium;
      if (item.cursed) itemPremium += Math.ceil(mainPremium * CURSED_SURCHARGE);
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) itemPremium += Math.ceil(mainPremium * HIGH_ENCHANTMENT_SURCHARGE);
      basePremium += itemPremium;
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }

  for (const count of Object.values(componentCounts)) {
    const bundles = Math.floor(count / COMPONENT_BUNDLE_SIZE);
    const remainder = count % COMPONENT_BUNDLE_SIZE;
    basePremium += bundles * COMPONENT_BUNDLE_PREMIUM + remainder * COMPONENT_BASE_PREMIUM;
  }

  return basePremium;
}

function processClaim(step: any, policies: { insuranceSum: number; remainingCap: number }[]): any {
  const policy = policies[step.policy];
  const totalDamage = step.incident.damages.reduce(
    (sum: number, d: any) => {
      let amount = d.amount;
      if (d.material !== "dragon" && d.enchantment >= CLAIM_ENCHANTMENT_THRESHOLD) amount = Math.floor(amount * CLAIM_ENCHANTMENT_REIMBURSEMENT);
      return sum + amount;
    },
    0
  );
  const payout = Math.max(0, totalDamage - DEDUCTIBLE);
  const cappedPayout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
}

function processQuote(
  step: any,
  customer: any,
  quoteCount: number,
  policies: { insuranceSum: number; remainingCap: number }[],
  index: number,
): { premium: number } {
  const basePremium = computeBasePremium(step.items);
  let premium = basePremium;
  if (quoteCount === 0) {
    premium += Math.ceil(basePremium * FIRST_INSURANCE_SURCHARGE);
  } else {
    premium -= Math.floor(basePremium * REPEAT_CUSTOMER_DISCOUNT);
  }
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= Math.floor(basePremium * LOYALTY_DISCOUNT);
  }
  premium += PROCESSING_FEE;
  const insuranceSum = step.items.reduce(
    (sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE),
    0
  );
  policies[index] = { insuranceSum, remainingCap: insuranceSum * 2 };
  return { premium };
}

export function processScenario(scenario: any): any {
  const customer = scenario.customer;
  let quoteCount = 0;
  const policies: { insuranceSum: number; remainingCap: number }[] = [];
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      const result = processQuote(step, customer, quoteCount, policies, index);
      quoteCount++;
      return result;
    }
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    return {};
  });
  return { results };
}
