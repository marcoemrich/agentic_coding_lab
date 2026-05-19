interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface Step {
  op: "quote" | "claim";
  items: Item[];
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ScenarioOutput {
  results: QuoteResult[];
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_PREMIUM = 25;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const calculateComponentPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const calculateMainItemPremium = (item: Item): number => {
  const itemBase = MAIN_ITEM_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return itemBase + curseSurcharge + enchantmentSurcharge;
};

const FIRST_INSURANCE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function processScenario(scenario: Scenario): ScenarioOutput {
  let quoteCount = 0;
  const results = scenario.steps.map((step) => {
    quoteCount++;
    let premiumBeforeFee = 0;
    let policyBasePremium = 0;
    const componentCounts: Record<string, number> = {};

    for (const item of step.items) {
      if (item.type in MAIN_ITEM_PREMIUMS) {
        policyBasePremium += MAIN_ITEM_PREMIUMS[item.type];
        premiumBeforeFee += calculateMainItemPremium(item);
      } else {
        componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
      }
    }

    for (const count of Object.values(componentCounts)) {
      const componentPremium = calculateComponentPremium(count);
      policyBasePremium += componentPremium;
      premiumBeforeFee += componentPremium;
    }

    premiumBeforeFee += policyBasePremium * FIRST_INSURANCE_RATE;
    if (scenario.customer.yearsWithMHPCO >= 2) {
      premiumBeforeFee -= policyBasePremium * 0.2;
    }
    if (quoteCount > 1) {
      premiumBeforeFee -= policyBasePremium * FOLLOW_UP_DISCOUNT_RATE;
    }

    const premium = Math.ceil(premiumBeforeFee + PROCESSING_FEE);
    return { premium };
  });
  return { results };
}
