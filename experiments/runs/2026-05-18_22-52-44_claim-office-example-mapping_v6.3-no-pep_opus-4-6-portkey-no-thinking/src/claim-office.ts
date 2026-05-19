const PROCESSING_FEE = 5;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const MAIN_ITEMS: Record<string, { premium: number; insuranceValue: number }> = {
  sword: { premium: 100, insuranceValue: 1000 },
  amulet: { premium: 60, insuranceValue: 600 },
  staff: { premium: 80, insuranceValue: 800 },
  potion: { premium: 40, insuranceValue: 400 },
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isValidItemType(type: string): boolean {
  return type in MAIN_ITEMS || COMPONENT_TYPES.has(type);
}

function computeComponentPremium(items: any[]): number {
  const components = items.filter((item: any) => isComponent(item.type));
  const componentCounts = countBy(components, (item: any) => item.type);

  let premium = 0;
  for (const count of Object.values(componentCounts)) {
    premium += count === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM
      : count * COMPONENT_PREMIUM;
  }
  return premium;
}

function computeItemSurcharges(item: any, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += basePremium * CURSED_SURCHARGE_RATE;
  }
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function computeMainItemPremiums(items: any[]): { baseWithoutSurcharges: number; totalWithSurcharges: number } {
  let baseWithoutSurcharges = 0;
  let totalWithSurcharges = 0;
  for (const item of items) {
    if (!isComponent(item.type)) {
      const basePremium = MAIN_ITEMS[item.type].premium;
      baseWithoutSurcharges += basePremium;
      totalWithSurcharges += basePremium + computeItemSurcharges(item, basePremium);
    }
  }
  return { baseWithoutSurcharges, totalWithSurcharges };
}

const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function computeInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      sum += COMPONENT_INSURANCE_VALUE;
    } else {
      sum += MAIN_ITEMS[item.type].insuranceValue;
    }
  }
  return sum;
}

function processQuote(
  items: any[],
  customer: any,
  quoteCount: number,
  stepIndex: number,
  policies: Map<number, { items: any[]; remainingCap: number }>,
): { premium: number } {
  for (const item of items) {
    if (!isValidItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const componentPremium = computeComponentPremium(items);
  const mainItemPremiums = computeMainItemPremiums(items);
  const totalItemPremium = mainItemPremiums.totalWithSurcharges + componentPremium;
  const policyBase = mainItemPremiums.baseWithoutSurcharges + componentPremium;

  let policyModifiers = policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyModifiers -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (quoteCount > 1) {
    policyModifiers -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }

  const premium = Math.ceil(totalItemPremium + policyModifiers + PROCESSING_FEE);
  const insuranceSum = computeInsuranceSum(items);
  policies.set(stepIndex, { items, remainingCap: insuranceSum * 2 });

  return { premium };
}

function computeDamageItemPayout(damage: any, policyItems: any[]): number {
  const item = policyItems.find((i: any) => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Item type ${damage.itemType} not found in policy`);
  }
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const reimbursableAmount = item.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
    ? damage.amount * CLAIM_HIGH_ENCHANTMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
}

function processClaim(
  step: any,
  policies: Map<number, { items: any[]; remainingCap: number }>,
): { payout: number; remainingCap: number } {
  const policy = policies.get(step.policy)!;

  const damageCounts = countBy(step.incident.damages, (d: any) => d.itemType);
  const policyCounts = countBy(policy.items, (i: any) => i.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than insured items`);
    }
  }

  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    totalPayout += computeDamageItemPayout(damage, policy.items);
  }

  totalPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= totalPayout;

  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: any): any {
  const results: any[] = [];
  let quoteCount = 0;
  const policies: Map<number, { items: any[]; remainingCap: number }> = new Map();

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      quoteCount++;
      results.push(processQuote(step.items, scenario.customer, quoteCount, i, policies));
    } else if (step.op === "claim") {
      results.push(processClaim(step, policies));
    }
  }

  return { results };
}
