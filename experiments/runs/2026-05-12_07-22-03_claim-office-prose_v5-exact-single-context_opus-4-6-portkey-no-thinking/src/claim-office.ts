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

const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

const ceilGold = (amount: number): number =>
  Math.ceil(parseFloat(amount.toFixed(2)));

const COMPONENT_TYPES = ["rune", "moonstone"];
const BUNDLE_SIZE = 3;
const BUNDLE_PREMIUM = 60;

const isComponent = (type: string): boolean =>
  COMPONENT_TYPES.includes(type);

const computeComponentPremium = (count: number, unitPremium: number): number => {
  const bundles = Math.floor(count / BUNDLE_SIZE);
  const remainder = count % BUNDLE_SIZE;
  return bundles * BUNDLE_PREMIUM + remainder * unitPremium;
};

const computeMainItemPremium = (item: any): number => {
  let premium = BASE_PREMIUMS[item.type];
  if (item.cursed) premium *= 1.50;
  if (item.enchantment >= 5) premium *= 1.30;
  return premium;
};

const computeCustomerModifier = (customer: any): number => {
  let modifier = 1;
  if (customer.yearsWithMHPCO === 0) {
    modifier *= 1.10;
  } else {
    if (customer.yearsWithMHPCO >= 2) modifier *= 0.80;
    modifier *= 0.85;
  }
  return modifier;
};

const computeQuotePremium = (items: any[], customer: any): number => {
  let totalItemPremium = 0;

  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      totalItemPremium += computeMainItemPremium(item);
    }
  }

  for (const type of Object.keys(componentCounts)) {
    totalItemPremium += computeComponentPremium(componentCounts[type], BASE_PREMIUMS[type]);
  }

  return ceilGold(totalItemPremium * computeCustomerModifier(customer) + PROCESSING_FEE);
};

const computeInsuranceSum = (items: any[]): number =>
  items.reduce((sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] || 0), 0);

const reimbursementRate = (policy: any, damage: any): number => {
  const item = policy.items.find((i: any) => i.type === damage.itemType);
  if (item && item.enchantment >= 8) return 0.50;
  return 1;
};

const processClaim = (policy: any, incident: any): { payout: number; remainingCap: number } => {
  const reimbursableAmount = incident.damages.reduce((sum: number, d: any) => sum + d.amount * reimbursementRate(policy, d), 0);
  const uncapped = Math.max(0, reimbursableAmount - DEDUCTIBLE);
  const payout = Math.min(uncapped, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: any): any => {
  const policies: any[] = [];
  const results: any[] = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = computeQuotePremium(step.items, scenario.customer);
      const cap = 2 * computeInsuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: cap });
      results.push({ premium });
    } else if (step.op === "claim") {
      results.push(processClaim(policies[step.policy], step.incident));
    }
  }

  return { results };
};
