const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INDIVIDUAL = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

function isComponent(item: any): boolean {
  return COMPONENT_TYPES.has(item.type);
}

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT = 0.15;

function regularItemPremiums(items: any[]): { basePremium: number; surcharges: number } {
  return items
    .filter((item: any) => !isComponent(item))
    .reduce(
      (acc, item: any) => {
        const base = BASE_PREMIUMS[item.type] || 0;
        const cursed = item.cursed ? base * CURSED_SURCHARGE : 0;
        const highEnch = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE : 0;
        return {
          basePremium: acc.basePremium + base,
          surcharges: acc.surcharges + cursed + highEnch,
        };
      },
      { basePremium: 0, surcharges: 0 },
    );
}

function countByType(items: any[]): Record<string, number> {
  return items.reduce(
    (counts: Record<string, number>, item: any) => ({
      ...counts,
      [item.type]: (counts[item.type] || 0) + 1,
    }),
    {},
  );
}

function componentPremium(items: any[]): number {
  const counts = countByType(items.filter((item: any) => isComponent(item)));
  return Object.values(counts).reduce(
    (sum, count) => sum + (count === BLOCK_SIZE ? BLOCK_PRICE : count * COMPONENT_INDIVIDUAL),
    0,
  );
}

function validateItems(items: any[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS) && !isComponent(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function calculatePremium(items: any[], customer: any, isFollowUp: boolean): number {
  validateItems(items);
  const { basePremium, surcharges } = regularItemPremiums(items);
  const policyBase = basePremium + componentPremium(items);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? policyBase * FOLLOWUP_DISCOUNT : 0;
  return Math.ceil(policyBase + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
}

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  return {
    results: scenario.steps.map((step: any) => {
      if (step.op === "quote") {
        quoteCount++;
        return { premium: calculatePremium(step.items, scenario.customer, quoteCount > 1) };
      }
      return {};
    }),
  };
}
