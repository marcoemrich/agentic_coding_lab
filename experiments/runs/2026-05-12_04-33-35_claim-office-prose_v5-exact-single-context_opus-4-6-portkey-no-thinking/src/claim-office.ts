const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const computeItemPremium = (item: any): number => {
  let premium = BASE_PREMIUMS[item.type];
  if (item.cursed) premium = premium * 3 / 2;
  if (item.enchantment >= 5) premium = premium * 13 / 10;
  return premium;
};

const computeBasePremium = (items: any[]): number => {
  let total = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      total += computeItemPremium(item);
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    const blocks = Math.floor(count / 3);
    const remainder = count % 3;
    total += blocks * 60 + remainder * BASE_PREMIUMS[type];
  }
  return total;
};

const processClaim = (step: any, policy: { remainingCap: number }): any => {
  const reimbursable = step.incident.damages.reduce((sum: number, d: any) => {
    const reimbursementRate = d.enchantment >= 8 ? 1 / 2 : 1;
    return sum + d.amount * reimbursementRate;
  }, 0);
  const payout = Math.min(Math.max(0, reimbursable - 100), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: any): any => {
  const policies: Array<{ insuranceSum: number; remainingCap: number }> = [];
  const results = scenario.steps.map((step: any, index: number) => {
    if (step.op === "claim") {
      return processClaim(step, policies[step.policy]);
    }
    const insuranceSum = step.items.reduce((sum: number, item: any) => sum + INSURANCE_VALUES[item.type], 0);
    policies[index] = { insuranceSum, remainingCap: insuranceSum * 2 };
    const isFirstContract = index === 0;
    let premium = computeBasePremium(step.items);
    if (isFirstContract) premium = premium * 11 / 10;
    if (!isFirstContract) premium = premium * 17 / 20;
    if (scenario.customer.yearsWithMHPCO >= 2) premium = premium * 4 / 5;
    return { premium: Math.ceil(premium + 5) };
  });
  return { results };
};
