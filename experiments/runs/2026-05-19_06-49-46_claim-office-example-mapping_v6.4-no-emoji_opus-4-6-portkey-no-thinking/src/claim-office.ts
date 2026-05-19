const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const basePremium = (item: any): number => BASE_PREMIUMS[item.type] ?? 0;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const mainItemPremium = (item: any): number => {
  const base = basePremium(item);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return base + cursedSurcharge + enchantmentSurcharge;
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: any): boolean => COMPONENT_TYPES.includes(item.type);

const componentsPremium = (components: any[]): number => {
  const grouped: Record<string, number> = {};
  for (const c of components) {
    grouped[c.type] = (grouped[c.type] ?? 0) + 1;
  }

  let total = 0;
  for (const [type, count] of Object.entries(grouped)) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * basePremium({ type });
  }
  return total;
};

const calculateItemsPremium = (items: any[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((i: any) => !isComponent(i));
  const mainTotal = mainItems.reduce((sum: number, item: any) => sum + mainItemPremium(item), 0);
  return mainTotal + componentsPremium(components);
};

const policyBasePremium = (items: any[]): number =>
  items.reduce((sum: number, item: any) => sum + basePremium(item), 0);

export const processScenario = (scenario: any): any => {
  const results = scenario.steps.map((step: any) => {
    const itemsPremium = calculateItemsPremium(step.items);
    const policyBase = policyBasePremium(step.items);
    const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
    const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
    const premium = Math.ceil(itemsPremium + firstInsurance - loyaltyDiscount + PROCESSING_FEE);
    return { premium };
  });
  return { results };
};
