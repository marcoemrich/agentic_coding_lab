const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

const isComponent = (item: any): boolean => COMPONENT_TYPES.includes(item.type);

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

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

const computeItemSurcharges = (item: any, base: number): number => {
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const computeComponentPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const computeItemsPremium = (items: any[]): { itemsTotal: number; policyBase: number } => {
  const componentCounts: Record<string, number> = {};
  let itemsTotal = 0;
  let policyBase = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      if (!(item.type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
      const base = BASE_PREMIUMS[item.type];
      policyBase += base;
      itemsTotal += base + computeItemSurcharges(item, base);
    }
  }
  for (const count of Object.values(componentCounts)) {
    const premium = computeComponentPremium(count);
    policyBase += premium;
    itemsTotal += premium;
  }
  return { itemsTotal, policyBase };
};

const computeInsuranceSum = (items: any[]): number =>
  items.reduce((sum: number, item: any) =>
    sum + (isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type]), 0);

const computePolicyModifiers = (policyBase: number, yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const processQuote = (step: any, yearsWithMHPCO: number, isFollowUp: boolean, policies: any[]): any => {
  const { itemsTotal, policyBase } = computeItemsPremium(step.items);
  const policyModifiers = computePolicyModifiers(policyBase, yearsWithMHPCO, isFollowUp);
  const insuranceSum = computeInsuranceSum(step.items);
  policies.push({ items: step.items, insuranceSum, remainingCap: insuranceSum * 2 });
  return { premium: Math.ceil(itemsTotal + policyModifiers + PROCESSING_FEE) };
};

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const processClaim = (step: any, policies: any[]): any => {
  const policy = policies[step.policy];
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error("Negative damage amount");
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    const insuredCount = policy.items.filter((i: any) => i.type === type).length;
    if (count > insuredCount) throw new Error(`More damages of type ${type} than insured`);
  }
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    if (!item) throw new Error(`Item type ${damage.itemType} not in policy`);
    let reimbursement = damage.amount;
    if (item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursement = damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE;
    }
    const payout = reimbursement - DEDUCTIBLE;
    totalPayout += Math.max(0, payout);
  }
  totalPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: any): any => {
  let quoteCount = 0;
  const policies: any[] = [];
  const results = scenario.steps.map((step: any) => {
    if (step.op === "quote") {
      const result = processQuote(step, scenario.customer.yearsWithMHPCO, quoteCount > 0, policies);
      quoteCount++;
      return result;
    }
    return processClaim(step, policies);
  });
  return { results };
};
