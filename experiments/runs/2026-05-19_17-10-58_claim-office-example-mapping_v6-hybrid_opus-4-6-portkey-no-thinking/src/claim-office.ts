const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const calculateComponentPremium = (componentCounts: Record<string, number>): number => {
  let premium = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === BLOCK_SIZE) {
      premium += BLOCK_PREMIUM;
    } else {
      premium += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }
  return premium;
};

const calculateItemSurcharges = (item: any, basePremium: number): number => {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += basePremium * 0.5;
  }
  if (item.enchantment >= 5) {
    surcharge += basePremium * 0.3;
  }
  return surcharge;
};

const isComponent = (item: any): boolean => COMPONENT_TYPES.includes(item.type);

const calculateQuotePremium = (items: any[], customer: any, isFollowUp: boolean): number => {
  let policyBasePremium = 0;
  let itemSurcharges = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const itemBase = BASE_PREMIUMS[item.type] ?? 0;
      policyBasePremium += itemBase;
      itemSurcharges += calculateItemSurcharges(item, itemBase);
    }
  }

  policyBasePremium += calculateComponentPremium(componentCounts);

  const firstInsuranceSurcharge = policyBasePremium * 0.1;
  const loyaltyDiscount = customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
  const followUpDiscount = isFollowUp ? policyBasePremium * 0.15 : 0;

  return Math.ceil(policyBasePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const results = scenario.steps.map((step: any) => {
    const isFollowUp = quoteCount > 0;
    quoteCount++;
    const premium = calculateQuotePremium(step.items, scenario.customer, isFollowUp);
    return { premium };
  });
  return { results };
}
