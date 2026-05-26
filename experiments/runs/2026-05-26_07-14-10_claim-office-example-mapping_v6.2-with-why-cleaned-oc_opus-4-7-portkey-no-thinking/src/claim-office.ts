// ===== Policy rule configuration =====

// Quote: per-policy
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Quote: per-item modifiers
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// Claim
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

// Base premiums by item type
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

// Insurance value (used for cap = value * CAP_MULTIPLIER)
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// Components (alchemical/material parts) and their block discount
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const BLOCK_OF_THREE_BASE_PREMIUM = 60;

// ===== Domain types =====

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

// ===== Helpers =====

const sumBy = <T>(items: Iterable<T>, valueOf: (item: T) => number): number => {
  let total = 0;
  for (const item of items) total += valueOf(item);
  return total;
};

const componentBlockBasePremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? BLOCK_OF_THREE_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const partitionByComponent = (items: Item[]): { mainItems: Item[]; components: Item[] } => {
  const mainItems: Item[] = [];
  const components: Item[] = [];
  for (const item of items) (isComponent(item) ? components : mainItems).push(item);
  return { mainItems, components };
};

const countBy = <T>(items: Iterable<T>, keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> => countBy(items, (item) => item.type);

type PolicyLine = { base: number; surcharges: number };

const modifierSurchargesFor = (item: Item, base: number): number => {
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnch =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curse + highEnch;
};

const policyLinesFor = (items: Item[]): PolicyLine[] => {
  const { mainItems, components } = partitionByComponent(items);
  const mainLines: PolicyLine[] = mainItems.map((item) => {
    const base = BASE_PREMIUM_BY_TYPE[item.type];
    return { base, surcharges: modifierSurchargesFor(item, base) };
  });
  const componentLines: PolicyLine[] = [...countByType(components).values()].map((count) => ({
    base: componentBlockBasePremium(count),
    surcharges: 0,
  }));
  return [...mainLines, ...componentLines];
};

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const policyWideAdjustments = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const loyaltyDiscount = isLoyalCustomer(customer) ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const lines = policyLinesFor(items);
  const policyBase = sumBy(lines, (line) => line.base);
  const totalSurcharges = sumBy(lines, (line) => line.surcharges);
  const policyAdjustments = policyWideAdjustments(policyBase, customer, isFollowUp);
  return Math.ceil(policyBase + totalSurcharges + policyAdjustments + PROCESSING_FEE);
};

// --- Policy & claim handling ---

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const KNOWN_ITEM_TYPES = new Set([
  ...Object.keys(BASE_PREMIUM_BY_TYPE),
  ...Object.keys(INSURANCE_VALUE_BY_TYPE),
]);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const insuranceValueFor = (item: Item): number => INSURANCE_VALUE_BY_TYPE[item.type] ?? 0;

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = sumBy(items, insuranceValueFor);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const findItemForDamage = (policy: Policy, damage: Damage): Item => {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  if (item === undefined) {
    // validateDamagesAgainstPolicy guarantees a matching item exists.
    throw new Error(`No insured item of type "${damage.itemType}" found in policy`);
  }
  return item;
};

const damagePayout = (item: Item, amount: number): number => {
  const reimbursable =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE
      : amount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const desiredPayoutFor = (policy: Policy, damage: Damage): number =>
  damagePayout(findItemForDamage(policy, damage), damage.amount);

const validateDamagesAgainstPolicy = (policy: Policy, damages: Damage[]): void => {
  const policyCounts = countByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, count] of damageCounts) {
    const policyCount = policyCounts.get(itemType) ?? 0;
    if (count > policyCount) {
      throw new Error(`Damage entries for "${itemType}" (${count}) exceed insured items (${policyCount})`);
    }
  }
};

const validateIncident = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: got ${damage.amount}`);
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateIncident(incident);
  validateDamagesAgainstPolicy(policy, incident.damages);
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const actualPayout = Math.min(desiredPayoutFor(policy, damage), policy.remainingCap);
    totalPayout += actualPayout;
    policy.remainingCap -= actualPayout;
  }
  return { payout: Math.floor(totalPayout), remainingCap: Math.floor(policy.remainingCap) };
};

type ScenarioState = {
  customer: Customer;
  policiesByStep: Map<number, Policy>;
  previousQuoteIssued: boolean;
};

const handleQuoteStep = (
  step: QuoteStep,
  index: number,
  state: ScenarioState,
): QuoteResult => {
  validateItems(step.items);
  const isFollowUp = state.previousQuoteIssued;
  state.previousQuoteIssued = true;
  state.policiesByStep.set(index, createPolicy(step.items));
  return { premium: quotePremium(step.items, state.customer, isFollowUp) };
};

const handleClaimStep = (step: ClaimStep, state: ScenarioState): ClaimResult => {
  const policy = state.policiesByStep.get(step.policy);
  if (policy === undefined) throw new Error(`Unknown policy index ${step.policy}`);
  return processClaim(policy, step.incident);
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const state: ScenarioState = {
    customer: scenario.customer,
    policiesByStep: new Map<number, Policy>(),
    previousQuoteIssued: false,
  };
  const results: StepResult[] = scenario.steps.map((step, index) =>
    step.op === "quote" ? handleQuoteStep(step, index, state) : handleClaimStep(step, state),
  );
  return { results };
};
