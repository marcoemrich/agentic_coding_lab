function ceilPercent(amount: number, percent: number): number {
  return Math.ceil(amount * percent / 100);
}

function floorPercent(amount: number, percent: number): number {
  return Math.floor(amount * percent / 100);
}

const ITEM_CATALOG: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword:  { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600,  basePremium: 60 },
  staff:  { insuranceValue: 800,  basePremium: 80 },
  potion: { insuranceValue: 400,  basePremium: 40 },
};

const COMPONENT_INSURANCE_VALUE = 250;

const COMPONENT_TYPES = ["rune", "moonstone"];

function calculateQuotePremium(step: any, customer: any, isFirstQuote: boolean): number {
  let premium = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of step.items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      let itemPremium = ITEM_CATALOG[item.type]?.basePremium ?? 0;
      if (item.cursed) {
        itemPremium += ceilPercent(itemPremium, 50);
      }
      if (item.enchantment >= 5) {
        itemPremium += ceilPercent(itemPremium, 30);
      }
      premium += itemPremium;
    }
  }
  for (const count of Object.values(componentCounts)) {
    const blocks = Math.floor(count / 3);
    const remainder = count % 3;
    premium += blocks * 60 + remainder * 25;
  }
  if (isFirstQuote) {
    premium += ceilPercent(premium, 10);
  } else {
    premium -= floorPercent(premium, 15);
  }
  if (customer.yearsWithMHPCO >= 2) {
    premium -= floorPercent(premium, 20);
  }
  premium += 5;
  return premium;
}

function calculateInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      sum += COMPONENT_INSURANCE_VALUE;
    } else {
      sum += ITEM_CATALOG[item.type]?.insuranceValue ?? 0;
    }
  }
  return sum;
}

function processClaim(step: any, policy: { insuranceSum: number; remainingCap: number; items: any[] }): { payout: number; remainingCap: number } {
  let reimbursable = 0;
  for (const damage of step.incident.damages) {
    const insuredItem = policy.items.find((it: any) => it.type === damage.itemType);
    if (insuredItem && insuredItem.enchantment >= 8 && insuredItem.material !== "dragon") {
      reimbursable += floorPercent(damage.amount, 50);
    } else {
      reimbursable += damage.amount;
    }
  }
  const payout = Math.min(Math.max(0, reimbursable - 100), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  const results: any[] = [];
  let quoteCount = 0;
  const policies: Map<number, { insuranceSum: number; remainingCap: number; items: any[] }> = new Map();
  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      const isFirstQuote = quoteCount === 0;
      quoteCount++;
      const insuranceSum = calculateInsuranceSum(step.items);
      policies.set(i, { insuranceSum, remainingCap: insuranceSum * 2, items: step.items });
      results.push({ premium: calculateQuotePremium(step, scenario.customer, isFirstQuote) });
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  }
  return { results };
}
