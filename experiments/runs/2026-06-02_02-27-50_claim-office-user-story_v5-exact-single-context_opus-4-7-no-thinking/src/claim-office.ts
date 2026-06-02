export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = { itemType: string; amount: number };

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_MATERIAL = "dragon";

const riskMultiplier = (item: Item): number => {
  let multiplier = 1;
  if (item.cursed) multiplier += CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) multiplier += HIGH_ENCHANTMENT_SURCHARGE;
  return multiplier;
};

const componentGroupBase = (count: number, perItem: number): number => {
  const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
  const remainder = count - blocks * COMPONENT_BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_PREMIUM + remainder * perItem;
};

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const list = groups.get(item.type) ?? [];
    list.push(item);
    groups.set(item.type, list);
  }
  return groups;
};

const perItemBase = (type: string, count: number): number => {
  const tableBase = BASE_PREMIUMS[type];
  if (COMPONENT_TYPES.has(type)) {
    return componentGroupBase(count, tableBase) / count;
  }
  return tableBase;
};

const groupBase = (type: string, items: Item[]): number => {
  const itemBase = perItemBase(type, items.length);
  return items.reduce((sum, item) => sum + itemBase * riskMultiplier(item), 0);
};

const basePremium = (items: Item[]): number => {
  let total = 0;
  for (const [type, group] of groupByType(items)) {
    total += groupBase(type, group);
  }
  return total;
};

const adjustForContract = (amount: number, isFirstContract: boolean): number =>
  isFirstContract
    ? amount + amount * FIRST_INSURANCE_SURCHARGE
    : amount - amount * SUBSEQUENT_CONTRACT_DISCOUNT;

const computeQuotePremium = (items: Item[], isLoyal: boolean, isFirstContract: boolean): number => {
  const base = basePremium(items);
  const afterContract = adjustForContract(base, isFirstContract);
  const afterLoyalty = isLoyal ? afterContract - afterContract * LOYALTY_DISCOUNT : afterContract;
  return Math.ceil(afterLoyalty) + PROCESSING_FEE;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

type Policy = {
  items: Item[];
  cap: number;
  remainingCap: number;
};

const newPolicy = (items: Item[]): Policy => {
  const cap = PAYOUT_CAP_MULTIPLIER * insuranceSum(items);
  return { items, cap, remainingCap: cap };
};

const reimbursementRate = (item: Item | undefined): number => {
  if (!item) return 1;
  if (item.material === FULL_REIMBURSEMENT_MATERIAL) return 1;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return 1;
};

const reimbursableDamage = (policy: Policy, damages: Damage[]): number =>
  damages.reduce((sum, d) => {
    const item = policy.items.find((i) => i.type === d.itemType);
    return sum + d.amount * reimbursementRate(item);
  }, 0);

const computeClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const reimbursable = reimbursableDamage(policy, incident.damages);
  const rawPayout = Math.max(0, reimbursable - DEDUCTIBLE);
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const isLoyal = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFirstContract = quoteCount === 0;
      quoteCount += 1;
      policies.push(newPolicy(step.items));
      return { premium: computeQuotePremium(step.items, isLoyal, isFirstContract) };
    }
    return computeClaim(policies[step.policy], step.incident);
  });
  return { results };
};
