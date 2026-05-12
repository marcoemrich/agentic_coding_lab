const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_PREMIUM,
  moonstone: COMPONENT_PREMIUM,
};

function computeItemsBasePremium(items: Array<{ type: string }>): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return Object.entries(counts).reduce((total, [type, count]) => {
    const unitPremium = BASE_PREMIUMS[type];
    if (unitPremium === COMPONENT_PREMIUM && count === COMPONENT_BLOCK_SIZE) {
      return total + COMPONENT_BLOCK_PREMIUM;
    }
    return total + unitPremium * count;
  }, 0);
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

function computeItemSurcharge(items: Item[], predicate: (item: Item) => boolean, rate: number): number {
  return items
    .filter(predicate)
    .reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * rate, 0);
}

interface Step {
  op?: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

function processQuote(items: Item[], customer: { yearsWithMHPCO: number }, stepIndex: number): { premium: number; insuranceSum: number } {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const policyBasePremium = computeItemsBasePremium(items);
  const itemSurcharges =
    computeItemSurcharge(items, (item) => !!item.cursed, CURSED_SURCHARGE_RATE) +
    computeItemSurcharge(items, (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD, HIGH_ENCHANTMENT_SURCHARGE_RATE);
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = stepIndex > 0 ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = Math.ceil(policyBasePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { premium, insuranceSum };
}

function processClaim(policy: Policy, damages: Array<{ itemType: string; amount: number }>): { payout: number; remainingCap: number } {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount");
    }
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  const insuredCounts: Record<string, number> = {};
  for (const item of policy.items) {
    insuredCounts[item.type] = (insuredCounts[item.type] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      throw new Error(`Damage entries exceed insured count for: ${type}`);
    }
  }
  const totalPayout = damages.reduce((sum, damage) => {
    const insuredItem = policy.items.find((item) => item.type === damage.itemType);
    if (!insuredItem) {
      throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    }
    const reimbursementRate = (insuredItem.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD ? CLAIM_HIGH_ENCHANTMENT_RATE : 1;
    const reimbursedAmount = damage.amount * reimbursementRate;
    return sum + Math.max(0, reimbursedAmount - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: { customer: { yearsWithMHPCO: number }; steps: Step[] }): unknown {
  const { customer } = scenario;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return processClaim(policies[step.policy!], step.incident!.damages);
    }
    const items = step.items ?? [];
    const { premium, insuranceSum } = processQuote(items, customer, stepIndex);
    policies[stepIndex] = { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
    return { premium };
  });
  return { results };
}
