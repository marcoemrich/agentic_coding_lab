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
    damages: { itemType: string; amount: number }[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface ScenarioOutput {
  results: (QuoteResult | ClaimResult)[];
}

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;

function getItemBasePremium(type: string): number {
  return BASE_PREMIUMS[type] ?? COMPONENT_PREMIUM;
}

function calculateItemPremiums(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }

  let total = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (type in BASE_PREMIUMS) {
      total += count * getItemBasePremium(type);
    } else {
      const blocks = Math.floor(count / 3);
      const remaining = count % 3;
      total += blocks * BUILDING_BLOCK_PREMIUM + remaining * COMPONENT_PREMIUM;
    }
  }

  for (const item of items) {
    if (item.cursed) {
      total += Math.ceil((getItemBasePremium(item.type) * 50) / 100);
    }
    if (item.enchantment >= 5) {
      total += Math.ceil((getItemBasePremium(item.type) * 30) / 100);
    }
  }
  return total;
}

const LOYALTY_DISCOUNT_PERCENT = 20;
const MULTI_CONTRACT_DISCOUNT_PERCENT = 15;

function applyDiscount(amount: number, percent: number): number {
  return amount - Math.floor((amount * percent) / 100);
}

function getItemValue(type: string): number {
  return ITEM_VALUES[type] ?? COMPONENT_VALUE;
}

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  const { yearsWithMHPCO } = scenario.customer;
  const policies: { items: Item[]; insuranceSum: number; remainingCap: number }[] = [];
  const results: (QuoteResult | ClaimResult)[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const itemPremiums = calculateItemPremiums(step.items);
      let premiumBeforeFee = itemPremiums;

      if (yearsWithMHPCO === 0) {
        premiumBeforeFee = Math.ceil((premiumBeforeFee * (100 + FIRST_INSURANCE_SURCHARGE_PERCENT)) / 100);
      }

      if (yearsWithMHPCO >= 2) {
        premiumBeforeFee = applyDiscount(premiumBeforeFee, LOYALTY_DISCOUNT_PERCENT);
      } else if (yearsWithMHPCO > 0) {
        premiumBeforeFee = applyDiscount(premiumBeforeFee, MULTI_CONTRACT_DISCOUNT_PERCENT);
      }

      const premium = premiumBeforeFee + PROCESSING_FEE;
      const insuranceSum = step.items.reduce((sum, item) => sum + getItemValue(item.type), 0);
      policies.push({ items: step.items, insuranceSum, remainingCap: insuranceSum * 2 });
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      let reimbursable = 0;
      for (const damage of step.incident.damages) {
        const item = policy.items.find((i) => i.type === damage.itemType);
        if (item && item.enchantment >= 8 && item.material !== "dragon") {
          reimbursable += Math.floor(damage.amount / 2);
        } else {
          reimbursable += damage.amount;
        }
      }
      const uncappedPayout = Math.max(0, reimbursable - DEDUCTIBLE);
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
};
