export type Customer = { yearsWithMHPCO: number };
export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: Customer; steps: Step[] };

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;
export type ScenarioResult = { results: StepResult[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INSURANCE_VALUE_PER_PREMIUM = 10;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const ENCHANTED_CLAIM_THRESHOLD = 8;
const ENCHANTED_REIMBURSEMENT_PERCENT = 50;

const itemBasePremium = (item: Item): number => {
  const premium = BASE_PREMIUM_BY_TYPE[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
};

const itemInsuranceValue = (item: Item): number =>
  itemBasePremium(item) * INSURANCE_VALUE_PER_PREMIUM;

const itemSurchargePercent = (item: Item): number => {
  let pct = 0;
  if (item.cursed) pct += CURSE_SURCHARGE_PERCENT;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) pct += HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
  return pct;
};

const itemSurcharge = (item: Item): number =>
  (itemBasePremium(item) * itemSurchargePercent(item)) / 100;

const groupByType = <T extends { type: string }>(items: T[]): Map<string, T[]> => {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const list = grouped.get(item.type) ?? [];
    list.push(item);
    grouped.set(item.type, list);
  }
  return grouped;
};

const componentsBaseTotal = (components: Item[]): number => {
  let total = 0;
  for (const sameTypeComponents of groupByType(components).values()) {
    if (sameTypeComponents.length === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += sameTypeComponents.reduce((sum, item) => sum + itemBasePremium(item), 0);
    }
  }
  return total;
};

const policyModifierPercent = (customer: Customer, isFollowUp: boolean): number => {
  let pct = FIRST_INSURANCE_SURCHARGE_PERCENT;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) pct -= LOYALTY_DISCOUNT_PERCENT;
  if (isFollowUp) pct -= FOLLOW_UP_DISCOUNT_PERCENT;
  return pct;
};

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  const components = step.items.filter(isComponent);
  const mainItems = step.items.filter((i) => !isComponent(i));
  const policyBase =
    mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0) +
    componentsBaseTotal(components);
  const itemSurcharges = mainItems.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const policyModifiers = (policyBase * policyModifierPercent(customer, isFollowUp)) / 100;
  const total = policyBase + itemSurcharges + policyModifiers;
  return Math.ceil(total) + PROCESSING_FEE;
};

type Policy = { items: Item[]; remainingCap: number };

const damagePayout = (damageAmount: number, item: Item): number => {
  const ench = item.enchantment ?? 0;
  const reimbursed =
    ench >= ENCHANTED_CLAIM_THRESHOLD
      ? (damageAmount * ENCHANTED_REIMBURSEMENT_PERCENT) / 100
      : damageAmount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const processClaim = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`No policy at step ${step.policy}`);
  const availableByType = groupByType(policy.items);
  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const item = availableByType.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    totalPayout += damagePayout(damage.amount, item);
  }
  const payout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const sum = insuranceSum(step.items);
      policies.set(index, { items: step.items, remainingCap: sum * CAP_MULTIPLIER });
      return { premium: quotePremium(step, scenario.customer, isFollowUp) };
    }
    return processClaim(step, policies);
  });
  return { results };
};
