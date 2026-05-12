const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PROCESSING_FEE = 5;

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const results = scenario.steps.map((step: any) => {
    let totalBasePremium = 0;
    const componentCounts: Record<string, number> = {};
    for (const item of step.items) {
      if (item.type === "component") {
        componentCounts[item.componentType] = (componentCounts[item.componentType] || 0) + 1;
      } else {
        let itemPremium = BASE_PREMIUMS[item.type];
        if (item.cursed) {
          itemPremium += itemPremium * CURSED_SURCHARGE_PERCENT / 100;
        }
        if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
          itemPremium += BASE_PREMIUMS[item.type] * ENCHANTMENT_SURCHARGE_PERCENT / 100;
        }
        totalBasePremium += itemPremium;
      }
    }
    for (const count of Object.values(componentCounts)) {
      const buildingBlocks = Math.floor(count / BUILDING_BLOCK_SIZE);
      const remainder = count % BUILDING_BLOCK_SIZE;
      totalBasePremium += buildingBlocks * BUILDING_BLOCK_PREMIUM + remainder * BASE_PREMIUMS["component"];
    }
    quoteCount++;
    let premium = totalBasePremium;
    if (quoteCount === 1) {
      premium += totalBasePremium * FIRST_INSURANCE_SURCHARGE_PERCENT / 100;
    }
    if (scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
      premium -= premium * LOYALTY_DISCOUNT_PERCENT / 100;
    }
    premium += PROCESSING_FEE;
    return { premium };
  });
  return { results };
}
