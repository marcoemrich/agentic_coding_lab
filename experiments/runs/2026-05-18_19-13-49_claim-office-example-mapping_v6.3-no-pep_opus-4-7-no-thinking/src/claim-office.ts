const PROCESSING_FEE = 5;
const COMPONENT_BASE = 25;
const BLOCK_OF_THREE_BASE = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

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
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };
type Policy = { items: Item[]; cap: number; remainingCap: number };

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownType = (item: Item): boolean =>
  item.type in BASE_PREMIUMS || COMPONENT_TYPES.has(item.type);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const componentTypeBase = (count: number): number =>
  count === 3 ? BLOCK_OF_THREE_BASE : count * COMPONENT_BASE;

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

// Items are pre-validated by validateItems, so the type lookup always hits.
const mainItemBase = (item: Item): number => BASE_PREMIUMS[item.type];

const mainItemSurcharge = (item: Item): number => {
  const base = mainItemBase(item);
  const cursed = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const highEnch =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_RATE : 0;
  return cursed + highEnch;
};

const mainItemsBase = (mainItems: Item[]): number => sum(mainItems.map(mainItemBase));

const componentsBase = (components: Item[]): number => {
  const counts = countByType(components);
  return sum([...counts.values()].map(componentTypeBase));
};

const itemSurcharges = (mainItems: Item[]): number => sum(mainItems.map(mainItemSurcharge));

const policyBase = (mainItems: Item[], components: Item[]): number =>
  mainItemsBase(mainItems) + componentsBase(components);

const loyaltyDiscount = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;

const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

const quote = (step: QuoteStep, customer: Customer, isFollowUp: boolean): { result: QuoteResult; policy: Policy } => {
  validateItems(step.items);
  const mainItems = step.items.filter((item) => !isComponent(item));
  const components = step.items.filter(isComponent);
  const base = policyBase(mainItems, components);
  const surcharges = itemSurcharges(mainItems);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty = loyaltyDiscount(base, customer);
  const followUp = isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = Math.ceil(base + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
  const cap = insuranceSum(step.items) * CAP_MULTIPLIER;
  return { result: { premium }, policy: { items: step.items, cap, remainingCap: cap } };
};

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

// validateDamagedCountsWithinInsured guarantees every damaged type has an insured item.
const damagePayout = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find((i) => i.type === damage.itemType)!;
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
};

const totalDamagePayout = (damages: Damage[], policy: Policy): number =>
  sum(damages.map((d) => damagePayout(d, policy)));

const validateNonNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) {
    throw new Error(`Negative damage amount: ${negative.amount}`);
  }
};

const validateDamagedCountsWithinInsured = (damages: Damage[], policy: Policy): void => {
  const insuredCounts = countByType(policy.items);
  const damagedCounts = countBy(damages, (d) => d.itemType);
  for (const [type, count] of damagedCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Damage entries exceed insured count for type: ${type}`);
    }
  }
};

const validateDamages = (damages: Damage[], policy: Policy): void => {
  validateNonNegativeAmounts(damages);
  validateDamagedCountsWithinInsured(damages, policy);
};

const claim = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateDamages(step.incident.damages, policy);
  const rawPayout = totalDamagePayout(step.incident.damages, policy);
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowUp = policies.length > 0;
      const { result, policy } = quote(step, scenario.customer, isFollowUp);
      policies.push(policy);
      results.push(result);
    } else {
      results.push(claim(step, policies[step.policy]));
    }
  }
  return { results };
};
