const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;
const FIRST_INSURANCE_RATE = 0.1;
const PROCESSING_FEE = 5;

const computeBlockDiscount = (items: any[]): number => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  let discount = 0;
  for (const count of Object.values(counts)) {
    if (count === BLOCK_SIZE) {
      discount += BLOCK_DISCOUNT;
    }
  }
  return discount;
};

const computeItemPremium = (item: any): number => {
  const base = BASE_PREMIUM[item.type] ?? 0;
  const cursedSurcharge = item.cursed ? base * 0.5 : 0;
  const enchantmentSurcharge = item.enchantment >= 5 ? base * 0.3 : 0;
  return base + cursedSurcharge + enchantmentSurcharge;
};

const processQuote = (items: any[], customer: any, isFollowUp: boolean): { premium: number } => {
  const itemsTotal = items.reduce((sum, item) => sum + computeItemPremium(item), 0);
  const base = itemsTotal - computeBlockDiscount(items);
  let modifier = FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= 2) modifier -= 0.2;
  if (isFollowUp) modifier -= 0.15;
  const premium = base + base * modifier + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

export const processScenario = (scenario: any): any => {
  let quoteCount = 0;
  const results = scenario.steps.map((step: any) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      return processQuote(step.items, scenario.customer, isFollowUp);
    }
  });
  return { results };
};
