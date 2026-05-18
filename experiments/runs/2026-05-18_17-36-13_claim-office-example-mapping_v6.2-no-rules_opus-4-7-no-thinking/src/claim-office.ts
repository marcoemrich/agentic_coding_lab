export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const CURSE_SURCHARGE = 0.5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const basePremiumFor = (item: Item): number => BASE_PREMIUM[item.type] ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeFactor = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);

const itemSurchargeAmount = (item: Item): number =>
  basePremiumFor(item) * itemSurchargeFactor(item);

const groupBaseCost = (type: string, group: Item[]): number => {
  if (COMPONENT_TYPES.has(type) && group.length === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PRICE;
  }
  return group.reduce((sum, item) => sum + basePremiumFor(item), 0);
};

const policyBase = (items: Item[]): number =>
  Array.from(groupByType(items)).reduce(
    (sum, [type, group]) => sum + groupBaseCost(type, group),
    0,
  );

const itemSurchargesTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeAmount(item), 0);

const policyModifierFactor = (
  customer: { yearsWithMHPCO: number },
  isFollowUp: boolean,
): number =>
  FIRST_INSURANCE_SURCHARGE -
  (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 0) -
  (isFollowUp ? FOLLOW_UP_CONTRACT_DISCOUNT : 0);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const quote = (
  items: Item[],
  customer: { yearsWithMHPCO: number },
  isFollowUp: boolean,
): QuoteResult => {
  validateItems(items);
  const base = policyBase(items);
  const itemSurcharges = itemSurchargesTotal(items);
  const policyModifiers = base * policyModifierFactor(customer, isFollowUp);
  return {
    premium: Math.ceil(base + itemSurcharges + policyModifiers + PROCESSING_FEE),
  };
};

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = policyInsuranceSum(items);
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  };
};

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_FACTOR = 0.5;

const isHighlyEnchantedForClaim = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (item: Item | undefined, amount: number): number =>
  isHighlyEnchantedForClaim(item) ? amount * HIGH_ENCHANTMENT_CLAIM_FACTOR : amount;

const damagePayout = (item: Item | undefined, amount: number): number =>
  Math.max(0, reimbursableAmount(item, amount) - DEDUCTIBLE);

const findItemForDamage = (items: Item[], damage: Damage): Item | undefined =>
  items.find((item) => item.type === damage.itemType);

const desiredPayout = (policy: Policy, damages: Damage[]): number =>
  damages.reduce(
    (sum, damage) =>
      sum + damagePayout(findItemForDamage(policy.items, damage), damage.amount),
    0,
  );

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countBy(policy.items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const damage of damages) {
    if (!insuredCounts.has(damage.itemType)) {
      throw new Error(`Damage references uninsured item: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
  for (const [type, count] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(`Too many damages for item type: ${type}`);
    }
  }
};

const processClaim = (policy: Policy, step: ClaimStep): ClaimResult => {
  validateDamages(policy, step.incident.damages);
  const desired = desiredPayout(policy, step.incident.damages);
  const payout = Math.min(desired, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};

interface ScenarioState {
  policies: Policy[];
  results: StepResult[];
}

const applyStep = (
  state: ScenarioState,
  step: Step,
  customer: { yearsWithMHPCO: number },
): ScenarioState => {
  if (step.op === "quote") {
    const isFollowUp = state.policies.length > 0;
    return {
      policies: [...state.policies, createPolicy(step.items)],
      results: [...state.results, quote(step.items, customer, isFollowUp)],
    };
  }
  const claimResult = processClaim(state.policies[step.policy], step);
  const updatedPolicy: Policy = {
    ...state.policies[step.policy],
    remainingCap: claimResult.remainingCap,
  };
  return {
    policies: state.policies.map((p, i) =>
      i === step.policy ? updatedPolicy : p,
    ),
    results: [...state.results, claimResult],
  };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const finalState = scenario.steps.reduce<ScenarioState>(
    (state, step) => applyStep(state, step, scenario.customer),
    { policies: [], results: [] },
  );
  return { results: finalState.results };
};
