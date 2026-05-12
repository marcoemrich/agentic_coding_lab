interface Item {
  type: string;
  material: string;
  cursed: boolean;
  enchantment: number;
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{
    op: string;
    items?: Item[];
    policy?: number;
    incident?: {
      cause: string;
      damages: Array<{ itemType: string; amount: number }>;
    };
  }>;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function computeTotalBasePremium(items: Item[]): number {
  let total = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const surchargePercent = 100
        + (item.cursed ? 50 : 0)
        + (item.enchantment >= 5 ? 30 : 0);
      total += BASE_PREMIUMS[item.type] * surchargePercent / 100;
    }
  }

  for (const type of Object.keys(componentCounts)) {
    const count = componentCounts[type];
    const blocks = Math.floor(count / BLOCK_SIZE);
    const remaining = count % BLOCK_SIZE;
    total += blocks * BLOCK_PREMIUM + remaining * BASE_PREMIUMS[type];
  }

  return total;
}

function computeInsuranceSum(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += INSURANCE_VALUES[item.type];
  }
  return total;
}

export function processScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  const FIRST_INSURANCE_SURCHARGE = 10;
  const SUBSEQUENT_DISCOUNT = -15;
  const LOYALTY_DISCOUNT = -20;
  const policies: Array<{ items: Item[]; remainingCap: number }> = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const basePremium = computeTotalBasePremium(step.items!);
      const contractModifier = policies.length === 0 ? FIRST_INSURANCE_SURCHARGE : SUBSEQUENT_DISCOUNT;
      policies.push({ items: step.items!, remainingCap: computeInsuranceSum(step.items!) * 2 });
      const customerModifier = 100
        + contractModifier
        + (scenario.customer.yearsWithMHPCO >= 2 ? LOYALTY_DISCOUNT : 0);
      const premium = Math.ceil(basePremium * customerModifier / 100) + 5;
      return { premium };
    } else {
      const policy = policies[step.policy!];
      let reimbursable = 0;
      for (const damage of step.incident!.damages) {
        const item = policy.items.find(i => i.type === damage.itemType);
        const rate = (item && item.enchantment >= 8 && item.material !== "dragon") ? 0.5 : 1;
        reimbursable += damage.amount * rate;
      }
      const uncappedPayout = Math.max(0, reimbursable - DEDUCTIBLE);
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      return { payout, remainingCap: policy.remainingCap };
    }
  });
  return { results };
}
