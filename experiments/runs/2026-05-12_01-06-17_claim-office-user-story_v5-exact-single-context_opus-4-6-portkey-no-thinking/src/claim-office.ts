interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

// Item catalog
const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};
const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};
const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BUILDING_BLOCK_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;

// Premium surcharges and discounts
const CURSED_SURCHARGE_PERCENT = 50;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const SECOND_CONTRACT_DISCOUNT_PERCENT = 15;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const PROCESSING_FEE = 5;

// Claim constants
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const DRAGON_MATERIAL = "dragon";

function isComponent(type: string): boolean {
  return !(type in MAIN_ITEM_PREMIUMS);
}

function ceilPercent(base: number, percent: number): number {
  return Math.ceil(base * percent / 100);
}

function floorPercent(base: number, percent: number): number {
  return Math.floor(base * percent / 100);
}

function countComponentsByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  return counts;
}

function calculateComponentPremium(count: number): number {
  const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
  const remainder = count % BUILDING_BLOCK_SIZE;
  return blocks * BUILDING_BLOCK_PREMIUM + remainder * COMPONENT_PREMIUM;
}

function calculateMainItemPremium(item: Item): number {
  const base = MAIN_ITEM_PREMIUMS[item.type];
  const cursedSurcharge = item.cursed ? ceilPercent(base, CURSED_SURCHARGE_PERCENT) : 0;
  const enchantmentSurcharge = item.enchantment >= ENCHANTMENT_THRESHOLD ? ceilPercent(base, ENCHANTMENT_SURCHARGE_PERCENT) : 0;
  return base + cursedSurcharge + enchantmentSurcharge;
}

function calculateItemPremiums(items: Item[]): number {
  const mainItemTotal = items
    .filter((item) => !isComponent(item.type))
    .reduce((sum, item) => sum + calculateMainItemPremium(item), 0);

  const componentTotal = Object.values(countComponentsByType(items))
    .reduce((sum, count) => sum + calculateComponentPremium(count), 0);

  return mainItemTotal + componentTotal;
}

function calculateInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      sum += COMPONENT_INSURANCE_VALUE;
    } else {
      sum += MAIN_ITEM_INSURANCE_VALUES[item.type];
    }
  }
  return sum;
}

function calculateContractAdjustment(basePremium: number, isFirstInsurance: boolean): number {
  if (isFirstInsurance) {
    return basePremium + ceilPercent(basePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);
  }
  return basePremium - floorPercent(basePremium, SECOND_CONTRACT_DISCOUNT_PERCENT);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function calculateReimbursement(damage: Damage, policyItems: Item[]): number {
  const matchingItem = policyItems.find((i) => i.type === damage.itemType);
  const isDragon = matchingItem?.material === DRAGON_MATERIAL;
  const isHighlyEnchanted = matchingItem !== undefined && matchingItem.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  if (!isDragon && isHighlyEnchanted) {
    return Math.floor(damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT / 100);
  }
  return damage.amount;
}

function processClaim(step: ClaimStep, policies: Policy[]): { payout: number; remainingCap: number } {
  const policy = policies[step.policy];
  const totalReimbursement = step.incident.damages.reduce(
    (sum, d) => sum + calculateReimbursement(d, policy.items), 0
  );
  const afterDeductible = Math.max(0, totalReimbursement - DEDUCTIBLE);
  const payout = Math.min(afterDeductible, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function processQuote(step: QuoteStep, isFirstInsurance: boolean, yearsWithMHPCO: number, policies: Policy[]): { premium: number } {
  const insuranceSum = calculateInsuranceSum(step.items);
  policies.push({ items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
  const totalBasePremium = calculateItemPremiums(step.items);
  const premiumAfterAdjustment = calculateContractAdjustment(totalBasePremium, isFirstInsurance);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? floorPercent(premiumAfterAdjustment, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const premium = premiumAfterAdjustment - loyaltyDiscount + PROCESSING_FEE;
  return { premium };
}

export function processScenario(scenario: Scenario): { results: unknown[] } {
  let quoteIndex = 0;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    const result = processQuote(step, quoteIndex === 0, scenario.customer.yearsWithMHPCO, policies);
    quoteIndex++;
    return result;
  });
  return { results };
}
