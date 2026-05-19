const PROCESSING_FEE = 5;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;

const calculateComponentPremium = (componentCounts: Record<string, number>): number => {
  let premium = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    premium += count === BLOCK_SIZE
      ? BLOCK_PREMIUM
      : count * (BASE_PREMIUMS[type] ?? 0);
  }
  return premium;
};

const calculateQuotePremium = (items: any[], customer: any): number => {
  const componentCounts: Record<string, number> = {};
  let itemSurcharges = 0;
  let policyBasePremium = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const itemBase = BASE_PREMIUMS[item.type] ?? 0;
      policyBasePremium += itemBase;
      if (item.cursed) {
        itemSurcharges += itemBase * CURSED_SURCHARGE_RATE;
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemSurcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
      }
    }
  }
  policyBasePremium += calculateComponentPremium(componentCounts);
  let policyPremium = policyBasePremium + itemSurcharges;
  policyPremium += policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS) {
    policyPremium -= policyBasePremium * LOYALTY_DISCOUNT_RATE;
  }
  return policyPremium;
};

export const processScenario = (scenario: any): any => {
  const results = scenario.steps.map((step: any) => {
    if (step.op === "quote") {
      return { premium: Math.ceil(calculateQuotePremium(step.items, scenario.customer) + PROCESSING_FEE) };
    }
  });
  return { results };
};
