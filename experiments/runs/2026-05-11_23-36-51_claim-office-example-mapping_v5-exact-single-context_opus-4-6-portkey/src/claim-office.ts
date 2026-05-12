const ITEM_CATALOG: Record<string, { premium: number; insuranceValue: number }> = {
  sword: { premium: 100, insuranceValue: 1000 },
  amulet: { premium: 60, insuranceValue: 600 },
  staff: { premium: 80, insuranceValue: 800 },
  potion: { premium: 40, insuranceValue: 400 },
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function componentPremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let total = 0;
  for (const [, count] of counts) {
    total += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return total;
}

function itemBasePremium(item: Item): number {
  if (isComponent(item)) return COMPONENT_PREMIUM;
  return ITEM_CATALOG[item.type].premium;
}

function computeBasePremium(items: Item[]): number {
  const mainItemTotal = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
  return mainItemTotal + componentPremium(items);
}

function computeItemSurcharges(items: Item[]): number {
  let surcharges = 0;
  for (const item of items) {
    const base = itemBasePremium(item);
    if (item.cursed) {
      surcharges += base * CURSED_SURCHARGE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharges += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return surcharges;
}

function computePolicyModifiers(basePremium: number, yearsWithMHPCO: number, isFollowUp: boolean): number {
  let modifiers = basePremium * FIRST_INSURANCE_RATE;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    modifiers -= basePremium * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUp) {
    modifiers -= basePremium * FOLLOW_UP_DISCOUNT_RATE;
  }
  return modifiers;
}

function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return ITEM_CATALOG[item.type].insuranceValue;
}

function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function processQuote(step: Step, yearsWithMHPCO: number, isFollowUp: boolean): { result: { premium: number }; policy: Policy } {
  const items = step.items ?? [];
  const basePremium = computeBasePremium(items);
  const itemSurcharges = computeItemSurcharges(items);
  const policyModifiers = computePolicyModifiers(basePremium, yearsWithMHPCO, isFollowUp);

  const premium = Math.ceil(basePremium + itemSurcharges + policyModifiers) + PROCESSING_FEE;
  const insuranceSum = computeInsuranceSum(items);
  return {
    result: { premium },
    policy: { items, remainingCap: insuranceSum * CAP_MULTIPLIER },
  };
}

function computeReimbursement(damage: Damage, item: Item): number {
  let amount = damage.amount;
  if ((item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD) {
    amount = damage.amount * CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function processClaim(step: Step, policy: Policy): { payout: number; remainingCap: number } {
  const damageCounts = new Map<string, number>();
  for (const damage of step.incident!.damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [itemType, count] of damageCounts) {
    const policyCount = policy.items.filter((it) => it.type === itemType).length;
    if (count > policyCount) {
      throw new Error(`Excess damage entries for "${itemType}": ${count} damages but only ${policyCount} insured`);
    }
  }

  let totalPayout = 0;

  for (const damage of step.incident!.damages) {
    const item = policy.items.find((it) => it.type === damage.itemType);
    if (!item) {
      throw new Error(`Item type "${damage.itemType}" is not covered by this policy`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    totalPayout += computeReimbursement(damage, item) - DEDUCTIBLE;
  }

  totalPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: unknown[] } {
  const results: unknown[] = [];
  let quoteCount = 0;
  const policies = new Map<number, Policy>();

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      quoteCount++;
      const { result, policy } = processQuote(step, scenario.customer.yearsWithMHPCO, quoteCount > 1);
      policies.set(i, policy);
      results.push(result);
    } else if (step.op === "claim") {
      const policy = policies.get(step.policy!)!;
      results.push(processClaim(step, policy));
    }
  }

  return { results };
}
