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

const COMPONENT_BASE_PREMIUM = 25;
const BUILDING_BLOCK_PREMIUM = 60;

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

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

function applyContractModifier(base: number, isFirst: boolean): number {
  if (isFirst) return base + base / 10;
  return base * 0.85;
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  const results: (QuoteResult | ClaimResult)[] = [];
  let quoteCount = 0;
  const policyRemainingCaps: Record<number, number> = {};

  for (let stepIndex = 0; stepIndex < scenario.steps.length; stepIndex++) {
    const step = scenario.steps[stepIndex];

    if (step.op === "quote") {
      const items = step.items;
      const isFirstQuote = quoteCount === 0;
      quoteCount++;

      let itemPremiumTotal = 0;
      let insuranceSum = 0;

      const componentCounts: Record<string, number> = {};
      for (const item of items) {
        if (BASE_PREMIUMS[item.type] !== undefined) {
          const basePremium = BASE_PREMIUMS[item.type];
          const cursedMultiplier = item.cursed ? 1.5 : 1;
          const enchantmentMultiplier = item.enchantment >= 5 ? 1.3 : 1;
          itemPremiumTotal += applyContractModifier(basePremium * cursedMultiplier * enchantmentMultiplier, isFirstQuote);
          insuranceSum += INSURANCE_VALUES[item.type];
        } else {
          componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
        }
      }

      for (const type in componentCounts) {
        const count = componentCounts[type];
        const blocks = Math.floor(count / 3);
        const remainder = count % 3;
        itemPremiumTotal += blocks * applyContractModifier(BUILDING_BLOCK_PREMIUM, isFirstQuote);
        itemPremiumTotal += remainder * applyContractModifier(COMPONENT_BASE_PREMIUM, isFirstQuote);
        insuranceSum += count * COMPONENT_INSURANCE_VALUE;
      }

      const loyaltyMultiplier = scenario.customer.yearsWithMHPCO >= 2 ? 0.8 : 1;
      itemPremiumTotal *= loyaltyMultiplier;

      const premium = Math.ceil(itemPremiumTotal + 5);
      policyRemainingCaps[stepIndex] = insuranceSum * 2;
      results.push({ premium });
    } else if (step.op === "claim") {
      const totalDamage = step.incident.damages.reduce((sum, d) => sum + d.amount, 0);
      const afterDeductible = Math.max(0, totalDamage - DEDUCTIBLE);
      const cap = policyRemainingCaps[step.policy];
      const payout = Math.min(afterDeductible, cap);
      policyRemainingCaps[step.policy] = cap - payout;
      results.push({ payout, remainingCap: policyRemainingCaps[step.policy] });
    }
  }

  return { results };
}
