const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_PREMIUM = 60;

function calculateQuotePremium(items: any[], customer: any, isFollowUp: boolean): number {
  let policyBasePremium = 0;
  let itemSurcharges = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const basePremium = BASE_PREMIUMS[item.type];
      policyBasePremium += basePremium;
      if (item.cursed) {
        itemSurcharges += basePremium * 0.5;
      }
      if (item.enchantment >= 5) {
        itemSurcharges += basePremium * 0.3;
      }
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === 3) {
      policyBasePremium += BLOCK_PREMIUM;
    } else {
      policyBasePremium += count * BASE_PREMIUMS[type];
    }
  }
  let premium = policyBasePremium + itemSurcharges;
  if (customer.yearsWithMHPCO >= 2) {
    premium -= policyBasePremium * 0.2;
  }
  premium += policyBasePremium * 0.1;
  if (isFollowUp) {
    premium -= policyBasePremium * 0.15;
  }
  premium += PROCESSING_FEE;
  return Math.ceil(premium);
}

function processClaim(policy: any, incident: any): { payout: number; remainingCap: number } {
  const insuredCounts: Record<string, number> = {};
  for (const item of policy.items) {
    insuredCounts[item.type] = (insuredCounts[item.type] ?? 0) + 1;
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than insured`);
    }
  }
  let insuranceSum = 0;
  for (const item of policy.items) {
    insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
  }
  const cap = 2 * insuranceSum;
  const remainingCap = cap - policy.totalPaidOut;
  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    let reimbursement = damage.amount;
    const insuredItem = policy.items.find((i: any) => i.type === damage.itemType);
    if (!insuredItem) {
      throw new Error(`Uninsured item type: ${damage.itemType}`);
    }
    if (insuredItem.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    }
    const damagePayout = reimbursement - DEDUCTIBLE;
    totalPayout += Math.max(0, damagePayout);
  }
  totalPayout = Math.min(totalPayout, remainingCap);
  policy.totalPaidOut += totalPayout;
  return { payout: totalPayout, remainingCap: remainingCap - totalPayout };
}

export function processScenario(scenario: any): any {
  let quoteCount = 0;
  const policies: any[] = [];
  const results = scenario.steps.map((step: any) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      policies.push({ items: step.items, totalPaidOut: 0 });
      return { premium: calculateQuotePremium(step.items, scenario.customer, isFollowUp) };
    }
    if (step.op === "claim") {
      const policy = policies[step.policy];
      return processClaim(policy, step.incident);
    }
  });
  return { results };
}
