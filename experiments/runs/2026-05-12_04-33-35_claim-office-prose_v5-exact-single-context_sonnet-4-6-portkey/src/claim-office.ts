type QuoteItem = { type: string; enchantment: number; cursed: boolean };

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
};

type ScenarioOutput = {
  results: Array<Record<string, unknown>>;
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const INSURANCE_SUMS: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};

const BUNDLE_SIZE = 3;
const BUNDLE_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  const { yearsWithMHPCO } = scenario.customer;
  const results: Array<Record<string, unknown>> = [];
  const policies: Array<{ insuranceSum: number; remainingCap: number }> = [];

  for (const step of scenario.steps) {
    if ((step as { op: string }).op === "claim") {
      const claimStep = step as {
        op: string;
        policy: number;
        incident: { damages: Array<{ itemType: string; amount: number }> };
      };
      const policy = policies[claimStep.policy];
      const totalDamage = claimStep.incident.damages.reduce((sum, d) => sum + d.amount, 0);
      const uncappedPayout = Math.max(0, totalDamage - DEDUCTIBLE);
      const payout = Math.min(uncappedPayout, policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    } else {
      const quoteStep = step as { op: string; items: QuoteItem[] };
      const item = quoteStep.items[0];
      const base = quoteStep.items.length === BUNDLE_SIZE ? BUNDLE_BASE_PREMIUM : BASE_PREMIUMS[item.type];
      let customerSurcharge = yearsWithMHPCO === 0 ? 10 : -15;
      if (yearsWithMHPCO >= 2) customerSurcharge -= 20;
      let itemSurcharge = 0;
      if (item.cursed) itemSurcharge += 50;
      if (item.enchantment >= 5) itemSurcharge += 30;
      const surchargePercent = customerSurcharge + itemSurcharge;
      const modifiedBase = Math.ceil(base * (100 + surchargePercent) / 100);
      const premium = modifiedBase + 5;
      const insuranceSum = INSURANCE_SUMS[item.type];
      policies.push({ insuranceSum, remainingCap: insuranceSum * 2 });
      results.push({ premium });
    }
  }

  return { results };
};
