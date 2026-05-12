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

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface ScenarioResult {
  results: Array<{ premium?: number; payout?: number; remainingCap?: number }>;
}

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BUNDLE_SIZE = 3;
const COMPONENT_BUNDLE_PREMIUM = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const PROCESSING_FEE = 5;

function isComponent(type: string): boolean {
  return !(type in MAIN_ITEM_PREMIUMS);
}

function componentPremium(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      counts[item.type] = (counts[item.type] ?? 0) + 1;
    }
  }
  return Object.values(counts).reduce((sum, count) => {
    const bundles = Math.floor(count / COMPONENT_BUNDLE_SIZE);
    const remaining = count % COMPONENT_BUNDLE_SIZE;
    return sum + bundles * COMPONENT_BUNDLE_PREMIUM + remaining * COMPONENT_PREMIUM;
  }, 0);
}

function mainItemPremium(item: Item): number {
  let premium = MAIN_ITEM_PREMIUMS[item.type];
  if (item.cursed) {
    premium *= 1 + CURSED_SURCHARGE;
  }
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    premium *= 1 + HIGH_ENCHANTMENT_SURCHARGE;
  }
  return premium;
}

function calculateBasePremium(items: Item[]): number {
  const mainItemTotal = items
    .filter((item) => !isComponent(item.type))
    .reduce((sum, item) => sum + mainItemPremium(item), 0);
  return mainItemTotal + componentPremium(items);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const MULTI_CONTRACT_DISCOUNT = 0.15;

function contractModifierRate(isFirstContract: boolean): number {
  return isFirstContract ? FIRST_INSURANCE_SURCHARGE : -MULTI_CONTRACT_DISCOUNT;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    const value = INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE;
    return sum + value;
  }, 0);
}

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies: Array<{ items: Item[]; remainingCap: number }> = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const basePremium = calculateBasePremium(step.items);
      const rate = contractModifierRate(quoteCount === 0);
      quoteCount++;
      let adjustedPremium = basePremium + basePremium * rate;
      if (scenario.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
        adjustedPremium -= adjustedPremium * LOYALTY_DISCOUNT;
      }
      const premium = Math.ceil(adjustedPremium) + PROCESSING_FEE;
      const cap = 2 * insuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: cap });
      return { premium };
    } else {
      const policy = policies[step.policy];
      const totalReimbursable = step.incident.damages.reduce((sum, d) => {
        const insuredItem = policy.items.find((i) => i.type === d.itemType);
        const reimbursementRate =
          insuredItem &&
          insuredItem.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
            ? CLAIM_HIGH_ENCHANTMENT_RATE
            : 1;
        return sum + d.amount * reimbursementRate;
      }, 0);
      const afterDeductible = Math.max(0, totalReimbursable - DEDUCTIBLE);
      const payout = Math.min(afterDeductible, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
  });
  return { results };
}
