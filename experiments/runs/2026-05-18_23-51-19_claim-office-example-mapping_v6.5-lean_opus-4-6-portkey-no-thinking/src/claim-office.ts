interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
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
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };

interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function mainItemPremium(items: Item[]): number {
  return items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((sum, item) => sum + (MAIN_ITEM_PREMIUMS[item.type] ?? 0), 0);
}

function componentPremium(items: Item[]): number {
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const counts = new Map<string, number>();
  for (const c of components) {
    counts.set(c.type, (counts.get(c.type) ?? 0) + 1);
  }
  return [...counts.values()].reduce(
    (sum, count) => sum + (count === 3 ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
}

function computeBasePremium(items: Item[]): number {
  return mainItemPremium(items) + componentPremium(items);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => {
    const itemBase = MAIN_ITEM_PREMIUMS[item.type] ?? 0;
    const cursed = item.cursed ? itemBase * 0.5 : 0;
    const enchanted = (item.enchantment ?? 0) >= 5 ? itemBase * 0.3 : 0;
    return sum + cursed + enchanted;
  }, 0);
}

function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    if (COMPONENT_TYPES.has(item.type)) {
      return sum + COMPONENT_INSURANCE_VALUE;
    }
    return sum + (INSURANCE_VALUES[item.type] ?? 0);
  }, 0);
}

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies: { items: Item[]; insuranceSum: number; remainingCap: number }[] = [];
  const results: (QuoteResult | ClaimResult)[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!(item.type in MAIN_ITEM_PREMIUMS) && !COMPONENT_TYPES.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      quoteCount++;
      const basePremium = computeBasePremium(step.items);
      const surcharges = itemSurcharges(step.items);
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? basePremium * 0.2 : 0;
      const followUpDiscount = quoteCount > 1 ? basePremium * 0.15 : 0;
      const premium = Math.ceil(
        basePremium + surcharges + basePremium * FIRST_INSURANCE_SURCHARGE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
      );
      const insuranceSum = computeInsuranceSum(step.items);
      policies.push({ items: step.items, insuranceSum, remainingCap: insuranceSum * 2 });
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        const payout = Math.max(0, damage.amount - DEDUCTIBLE);
        totalPayout += payout;
      }
      totalPayout = Math.min(totalPayout, policy.remainingCap);
      policy.remainingCap -= totalPayout;
      results.push({ payout: totalPayout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
}
