const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const DEDUCTIBLE = 100;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const calculateComponentPremium = (componentCounts: Record<string, number>): number => {
  let total = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    total += count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM
      : count * (BASE_PREMIUMS[type] || 0);
  }
  return total;
};

const calculateItemPremiums = (items: any[]): { policyBase: number; itemSurcharges: number } => {
  const componentCounts: Record<string, number> = {};
  let standardItemBase = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const base = BASE_PREMIUMS[item.type] || 0;
      standardItemBase += base;
      if (item.cursed) {
        itemSurcharges += base * CURSE_SURCHARGE_RATE;
      }
      if (item.enchantment >= ENCHANTMENT_THRESHOLD) {
        itemSurcharges += base * ENCHANTMENT_SURCHARGE_RATE;
      }
    }
  }

  return { policyBase: standardItemBase + calculateComponentPremium(componentCounts), itemSurcharges };
};

const processQuote = (
  step: any,
  customer: any,
  quoteCount: number,
): { premium: number; insuranceSum: number } => {
  const { policyBase, itemSurcharges } = calculateItemPremiums(step.items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    quoteCount > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const rawPremium =
    policyBase + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  const insuranceSum = step.items.reduce(
    (sum: number, item: any) => sum + (BASE_PREMIUMS[item.type] || 0) * INSURANCE_VALUE_MULTIPLIER,
    0,
  );
  return { premium: Math.ceil(rawPremium), insuranceSum };
};

const processClaim = (
  step: any,
  policy: { items: any[]; remainingCap: number },
): { payout: number; remainingCap: number } => {
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    let reimbursement = damage.amount;
    if (item && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursement = damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    const payout = reimbursement - DEDUCTIBLE;
    totalPayout += Math.max(0, payout);
  }
  totalPayout = Math.min(totalPayout, policy.remainingCap);
  totalPayout = Math.floor(totalPayout);
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: any): any => {
  let quoteCount = 0;
  const policies: Record<number, { items: any[]; remainingCap: number }> = {};
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "quote") {
      const { premium, insuranceSum } = processQuote(step, scenario.customer, quoteCount);
      quoteCount++;
      policies[index] = { items: step.items, remainingCap: insuranceSum * 2 };
      return { premium };
    }
    if (step.op === "claim") {
      return processClaim(step, policies[step.policy]);
    }
    return {};
  });
  return { results };
};
