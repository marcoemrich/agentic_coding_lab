interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANT_SURCHARGE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;

const itemSurcharge = (base: number, item: Item): number => {
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANT_SURCHARGE;
  }
  return surcharge;
};

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const PROCESSING_FEE = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANT_THRESHOLD = 8;
const HIGH_ENCHANT_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = "dragon";

const componentGroupPremium = (count: number): number => {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
};

interface PolicyBase {
  base: number;
  surcharges: number;
}

const policyBase = (items: Item[]): PolicyBase => {
  const componentCounts: Record<string, number> = {};
  let base = 0;
  let surcharges = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else if (item.type in BASE_PREMIUMS) {
      const itemBase = BASE_PREMIUMS[item.type];
      base += itemBase;
      surcharges += itemSurcharge(itemBase, item);
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  for (const count of Object.values(componentCounts)) {
    base += componentGroupPremium(count);
  }
  return { base, surcharges };
};

const roundUp = (amount: number): number => Math.ceil(amount);
const roundDown = (amount: number): number => Math.floor(amount);

interface Policy {
  items: Item[];
  remainingCap: number;
}

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce(
    (sum, item) => sum + INSURANCE_VALUES[item.type],
    0,
  );
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const reimbursedAmount = (amount: number, item: Item): number => {
  if ((item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANT_THRESHOLD) {
    return amount * HIGH_ENCHANT_REIMBURSEMENT;
  }
  if (item.material === DRAGON_MATERIAL) {
    return amount;
  }
  return amount;
};

const damagePayout = (damage: Damage, item: Item): number => {
  return reimbursedAmount(damage.amount, item) - DEDUCTIBLE;
};

const countByType = (items: { type: string }[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const insured = countByType(policy.items);
  const damaged = countByType(
    damages.map((damage) => ({ type: damage.itemType })),
  );
  for (const [type, count] of Object.entries(damaged)) {
    if ((insured[type] ?? 0) < count) {
      throw new Error(
        `Damage count for ${type} exceeds insured items or item not in policy`,
      );
    }
  }
};

const processClaim = (
  policy: Policy,
  step: ClaimStep,
): { payout: number; remainingCap: number } => {
  validateDamages(policy, step.incident.damages);
  const rawPayout = step.incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((i) => i.type === damage.itemType)!;
    return sum + damagePayout(damage, item);
  }, 0);
  const payout = Math.min(roundDown(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const { base, surcharges } = policyBase(items);
  let modifiers = base * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    modifiers -= base * LOYALTY_DISCOUNT;
  }
  if (isFollowUp) {
    modifiers -= base * FOLLOWUP_DISCOUNT;
  }
  return roundUp(base + surcharges + modifiers + PROCESSING_FEE);
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies[stepIndex] = createPolicy(step.items);
      return {
        premium: quotePremium(step.items, scenario.customer, isFollowUp),
      };
    }
    return processClaim(policies[step.policy], step);
  });
  return { results };
};
