const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const countComponentsByType = (items: any[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts[item.type] = (counts[item.type] || 0) + 1;
    }
  }
  return counts;
};

const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const calculateComponentPremium = (items: any[]): number => {
  const counts = countComponentsByType(items);
  return Object.values(counts).reduce(
    (total: number, count: number) => total + componentGroupPremium(count),
    0
  );
};

const itemBasePremium = (item: any): number =>
  BASE_PREMIUMS[item.type] || 0;

const itemSurcharges = (item: any): number => {
  const base = itemBasePremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const validateItems = (items: any[]): void => {
  for (const item of items) {
    if (!BASE_PREMIUMS[item.type] && !COMPONENT_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const policyWideAdjustment = (policyBase: number, customer: any, isFollowUp: boolean): number => {
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp
    ? policyBase * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return firstInsurance - loyaltyDiscount - followUpDiscount;
};

const calculateQuotePremium = (items: any[], customer: any, isFollowUp: boolean): number => {
  validateItems(items);
  const equipmentBasePremium = items.reduce(
    (sum: number, item: any) => sum + itemBasePremium(item),
    0
  );
  const itemSpecificSurcharges = items.reduce(
    (sum: number, item: any) => sum + itemSurcharges(item),
    0
  );
  const componentPremium = calculateComponentPremium(items);
  const policyBasePremium = equipmentBasePremium + componentPremium;
  const total = policyBasePremium + itemSpecificSurcharges
    + policyWideAdjustment(policyBasePremium, customer, isFollowUp)
    + PROCESSING_FEE;
  return Math.ceil(total);
};

const DEDUCTIBLE = 100;

const calculateClaimPayout = (damages: any[]): number => {
  return damages.reduce(
    (total: number, damage: any) => total + Math.max(0, damage.amount - DEDUCTIBLE),
    0
  );
};

const processStep = (step: any, customer: any, quoteCount: number): any => {
  if (step.op === "claim") {
    return { payout: calculateClaimPayout(step.damages) };
  }
  const isFollowUp = quoteCount > 0;
  return { premium: calculateQuotePremium(step.items, customer, isFollowUp) };
};

export const processScenario = (scenario: any): any => {
  let quoteCount = 0;
  const results: any[] = [];
  for (const step of scenario.steps) {
    results.push(processStep(step, scenario.customer, quoteCount));
    if (step.op !== "claim") {
      quoteCount++;
    }
  }
  return { results };
};
