const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
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

const DEDUCTIBLE = 100;

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
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

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export function processScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  let quoteCount = 0;
  const policies: Array<{ items: Item[]; insuranceSum: number; remainingCap: number }> = [];
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      quoteCount++;
      let policyBasePremium = 0;
      let itemSurcharges = 0;
      let insuranceSum = 0;
      const componentCounts: Record<string, number> = {};
      for (const item of step.items) {
        if (COMPONENT_TYPES.has(item.type)) {
          componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
          insuranceSum += 250;
        } else if (item.type in BASE_PREMIUMS) {
          const itemBase = BASE_PREMIUMS[item.type];
          policyBasePremium += itemBase;
          insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
          if (item.cursed) {
            itemSurcharges += itemBase * 0.5;
          }
          if ((item.enchantment ?? 0) >= 5) {
            itemSurcharges += itemBase * 0.3;
          }
        } else {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      for (const [, count] of Object.entries(componentCounts)) {
        if (count === 3) {
          policyBasePremium += COMPONENT_BLOCK_PREMIUM;
        } else {
          policyBasePremium += count * COMPONENT_PREMIUM;
        }
      }
      const firstInsurance = policyBasePremium * 0.1;
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
      const followUpDiscount = quoteCount > 1 ? policyBasePremium * 0.15 : 0;
      const premium = policyBasePremium + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
      policies[stepIndex] = { items: step.items, insuranceSum, remainingCap: insuranceSum * 2 };
      return { premium: Math.ceil(premium) };
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const damageCounts: Record<string, number> = {};
      for (const damage of step.incident.damages) {
        damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
      }
      for (const [itemType, count] of Object.entries(damageCounts)) {
        const insuredCount = policy.items.filter((i) => i.type === itemType).length;
        if (count > insuredCount) {
          throw new Error(`More damages of type ${itemType} than policy covers`);
        }
      }
      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
        const item = policy.items.find((i) => i.type === damage.itemType);
        if (!item) {
          throw new Error(`Item type not in policy: ${damage.itemType}`);
        }
        const highEnchantment = (item.enchantment ?? 0) >= 8;
        const reimbursement = highEnchantment ? damage.amount * 0.5 : damage.amount;
        const payout = reimbursement - DEDUCTIBLE;
        totalPayout += Math.max(0, payout);
      }
      totalPayout = Math.min(totalPayout, policy.remainingCap);
      policy.remainingCap -= totalPayout;
      return { payout: Math.floor(totalPayout), remainingCap: policy.remainingCap };
    }
    return {};
  });
  return { results };
}
