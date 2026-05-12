interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; [key: string]: any }>;
}

interface ScenarioOutput {
  results: Array<{ premium?: number; payout?: number; remainingCap?: number }>;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function validateItemTypes(items: any[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS) && !KNOWN_COMPONENT_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
}

function calculateBasePremium(items: any[]): number {
  let premium = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (item.type in BASE_PREMIUMS) {
      premium += BASE_PREMIUMS[item.type];
    } else {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    }
  }
  for (const count of Object.values(componentCounts)) {
    if (count === COMPONENT_BLOCK_SIZE) {
      premium += COMPONENT_BLOCK_PREMIUM;
    } else {
      premium += count * COMPONENT_PREMIUM;
    }
  }
  return premium;
}

function calculateItemSurcharges(items: any[]): number {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = BASE_PREMIUMS[item.type] ?? COMPONENT_PREMIUM;
    if (item.cursed) {
      surcharges += itemBase * CURSED_SURCHARGE;
    }
    if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return surcharges;
}

interface Policy {
  items: any[];
  insuranceSum: number;
  remainingCap: number;
}

function calculateInsuranceSum(items: any[]): number {
  let sum = 0;
  for (const item of items) {
    sum += INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE;
  }
  return sum;
}

function processQuote(
  items: any[],
  customer: Scenario["customer"],
  quoteCount: number
): { premium: number; policy: Policy } {
  validateItemTypes(items);
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = calculateItemSurcharges(items);
  let policyModifier = FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyModifier -= LOYALTY_DISCOUNT;
  }
  if (quoteCount > 0) {
    policyModifier -= FOLLOW_UP_DISCOUNT;
  }
  const premium =
    Math.ceil(basePremium + itemSurcharges + basePremium * policyModifier) +
    PROCESSING_FEE;
  const insuranceSum = calculateInsuranceSum(items);
  return { premium, policy: { items, insuranceSum, remainingCap: insuranceSum * 2 } };
}

function processClaim(
  policy: Policy,
  damages: Array<{ itemType: string; amount: number }>
): { payout: number; remainingCap: number } {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }
  const policyCounts: Record<string, number> = {};
  for (const item of policy.items) {
    policyCounts[item.type] = (policyCounts[item.type] || 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] || 0)) {
      throw new Error(`Damages for "${type}" exceed insured count`);
    }
  }

  let totalPayout = 0;
  for (const damage of damages) {
    const item = policy.items.find((i: any) => i.type === damage.itemType);
    if (!item) {
      throw new Error(`Item type "${damage.itemType}" is not covered by this policy`);
    }
    const reimbursement =
      item.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
        ? damage.amount * CLAIM_HIGH_ENCHANTMENT_RATE
        : damage.amount;
    const payout = reimbursement - DEDUCTIBLE;
    totalPayout += Math.max(0, payout);
  }
  totalPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioOutput {
  const results: ScenarioOutput["results"] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const { premium, policy } = processQuote(step.items || [], scenario.customer, quoteCount);
      policies.push(policy);
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const result = processClaim(policies[step.policy], step.incident.damages);
      results.push(result);
    }
  }
  return { results };
}
