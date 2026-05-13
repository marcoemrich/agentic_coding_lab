export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type Step = QuoteStep | ClaimStep;

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number; enchantment?: number; material?: string }[];
  };
};

export type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

export type Result = { premium: number } | { payout: number; remainingCap: number };

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
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BUILDING_BLOCK_BASE = 60;
const BUILDING_BLOCK_SIZE = 3;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const AFTER_FIRST_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

const roundUp = (value: number): number => Math.ceil(value - 1e-9);

const baseFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemRiskMultiplier = (item: Item): number => {
  const cursed = item.cursed ? CURSED_SURCHARGE : 0;
  const enchanted = item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return 1 + cursed + enchanted;
};

const computeItemsBase = (items: Item[]): number => {
  const componentsByType = new Map<string, number>();
  let nonComponentBase = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentsByType.set(item.type, (componentsByType.get(item.type) ?? 0) + 1);
    } else {
      nonComponentBase += baseFor(item) * itemRiskMultiplier(item);
    }
  }
  let componentBase = 0;
  for (const [type, count] of componentsByType) {
    const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
    const remainder = count % BUILDING_BLOCK_SIZE;
    componentBase += blocks * BUILDING_BLOCK_BASE + remainder * (BASE_PREMIUMS[type] ?? 0);
  }
  return nonComponentBase + componentBase;
};

const computePremium = (
  items: Item[],
  customer: Customer,
  isFirstContract: boolean,
): number => {
  const base = computeItemsBase(items);
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? 1 - LOYALTY_DISCOUNT : 1;
  const contractAdjustment = isFirstContract
    ? 1 + FIRST_INSURANCE_SURCHARGE
    : 1 - AFTER_FIRST_DISCOUNT;
  const adjusted = base * loyalty * contractAdjustment;
  return roundUp(adjusted) + PROCESSING_FEE;
};

type PolicyState = {
  remainingCap: number;
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

const HIGH_ENCHANT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANT_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (damage: { amount: number; enchantment?: number }): number =>
  (damage.enchantment ?? 0) >= HIGH_ENCHANT_REIMBURSEMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANT_REIMBURSEMENT_RATE
    : damage.amount;

const DRAGON_MATERIAL = "dragon";

type Damage = ClaimStep["incident"]["damages"][number];

const isFullyReimbursed = (d: Damage): boolean => d.material === DRAGON_MATERIAL;

const processClaim = (
  policy: PolicyState,
  incident: ClaimStep["incident"],
): { payout: number; remainingCap: number } => {
  const { dragonTotal, standardTotal } = incident.damages.reduce(
    (acc, d) =>
      isFullyReimbursed(d)
        ? { ...acc, dragonTotal: acc.dragonTotal + d.amount }
        : { ...acc, standardTotal: acc.standardTotal + reimbursableAmount(d) },
    { dragonTotal: 0, standardTotal: 0 },
  );
  const payableAmount = dragonTotal + Math.max(0, standardTotal - DEDUCTIBLE);
  const payout = Math.min(payableAmount, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies: Record<number, PolicyState> = {};
  const results: Result[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFirst = quoteCount === 0;
      quoteCount += 1;
      policies[index] = {
        remainingCap: CAP_MULTIPLIER * insuranceSumFor(step.items),
      };
      return { premium: computePremium(step.items, scenario.customer, isFirst) };
    }
    const policy = policies[step.policy];
    return processClaim(policy, step.incident);
  });
  return { results };
};
