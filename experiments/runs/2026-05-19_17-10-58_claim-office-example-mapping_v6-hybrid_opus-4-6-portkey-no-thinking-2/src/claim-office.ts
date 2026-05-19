const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function countComponentsByType(items: any[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts[item.type] = (counts[item.type] || 0) + 1;
    }
  }
  return counts;
}

function priceForComponentGroup(count: number): number {
  return count === 3 ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function computeComponentPremium(items: any[]): number {
  const counts = countComponentsByType(items);
  return Object.values(counts).reduce((sum, count) => sum + priceForComponentGroup(count), 0);
}

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function basePremiumForItem(item: any): number {
  return BASE_PREMIUMS[item.type] || 0;
}

function surchargeForItem(item: any): number {
  const base = basePremiumForItem(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSED_SURCHARGE_RATE;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return surcharge;
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const results = scenario.steps.map((step: any) => {
    const isFollowUp = quoteCount > 0;
    quoteCount++;
    const nonComponentPremium = step.items.reduce((sum: number, item: any) => sum + basePremiumForItem(item), 0);
    const componentPremium = computeComponentPremium(step.items);
    const basePremium = nonComponentPremium + componentPremium;
    const itemSurcharges = step.items.reduce((sum: number, item: any) => sum + surchargeForItem(item), 0);
    const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
    const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
    const premium = basePremium + itemSurcharges + basePremium * FIRST_INSURANCE_SURCHARGE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
    return { premium };
  });
  return { results };
}
