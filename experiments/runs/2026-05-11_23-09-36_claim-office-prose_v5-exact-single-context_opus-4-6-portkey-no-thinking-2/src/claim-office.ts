const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_SUMS: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const CURSED_SURCHARGE = 0.50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.30;
const INITIAL_ASSESSMENT_SURCHARGE = 0.10;
const REPEAT_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.20;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.50;

function ceilToGold(amount: number): number {
  return Math.ceil(amount - 1e-9);
}

function computeBasePremium(items: any[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      let itemPremium = BASE_PREMIUMS[item.type];
      if (item.cursed) {
        itemPremium *= (1 + CURSED_SURCHARGE);
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemPremium *= (1 + HIGH_ENCHANTMENT_SURCHARGE);
      }
      total += itemPremium;
    }
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
    const remainder = count % COMPONENT_BLOCK_SIZE;
    total += blocks * COMPONENT_BLOCK_PREMIUM + remainder * BASE_PREMIUMS[type];
  }

  return total;
}

function computeInsuranceSum(items: any[]): number {
  return items.reduce(
    (sum: number, item: any) => sum + INSURANCE_SUMS[item.type],
    0,
  );
}

function computeDamagePayout(damage: any, item: any): number {
  if (item.material === "dragon") {
    return damage.amount;
  }
  if (item.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return Math.max(0, damage.amount - DEDUCTIBLE);
}

function processClaim(step: any, policy: { items: any[]; remainingCap: number }): any {
  let totalPayout = 0;
  for (const damage of step.damages) {
    totalPayout += computeDamagePayout(damage, policy.items[damage.item]);
  }
  totalPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  const customer = scenario.customer;
  let quoteCount = 0;
  const policies: { items: any[]; remainingCap: number }[] = [];
  const results = scenario.steps.map((step: any, stepIndex: number) => {
    if (step.op === "quote") {
      quoteCount++;
      const basePremium = computeBasePremium(step.items);
      let adjusted: number;
      if (quoteCount === 1) {
        adjusted = basePremium * (1 + INITIAL_ASSESSMENT_SURCHARGE);
      } else {
        adjusted = basePremium * (1 - REPEAT_CONTRACT_DISCOUNT);
      }
      if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
        adjusted *= (1 - LOYALTY_DISCOUNT);
      }
      const premium = ceilToGold(adjusted) + PROCESSING_FEE;
      policies[stepIndex] = {
        items: step.items,
        remainingCap: CAP_MULTIPLIER * computeInsuranceSum(step.items),
      };
      return { premium };
    }
    if (step.op === "claim") {
      return processClaim(step, policies[step.policy]);
    }
    return {};
  });
  return { results };
}
