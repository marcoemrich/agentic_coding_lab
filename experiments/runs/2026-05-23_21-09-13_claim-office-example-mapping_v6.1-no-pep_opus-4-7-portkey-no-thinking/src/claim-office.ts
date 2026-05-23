const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

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

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

// MHPCO rounds premiums up in its own favor. A float-precision guard avoids
// surprises like 197.5 + 0 rendering as 197.5000000001 and rounding to 198
// when the true mathematical value was already on an integer boundary.
const roundUpInMHPCOFavor = (amount: number): number =>
  Math.ceil(Math.round(amount * 1e6) / 1e6);

const roundDownInMHPCOFavor = (amount: number): number =>
  Math.floor(Math.round(amount * 1e6) / 1e6);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const componentGroupPremium = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUM[type];

type PremiumLine = { base: number; itemSurchargeRate: number };

const mainItemSurchargeRate = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
};

const mainItemLine = (item: Item): PremiumLine => {
  const base = BASE_PREMIUM[item.type];
  if (base === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return { base, itemSurchargeRate: mainItemSurchargeRate(item) };
};

const tallyBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const itemPremiumLines = (items: Item[]): PremiumLine[] => {
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const mainLines = mainItems.map(mainItemLine);
  const componentLines = [...tallyBy(components, (c) => c.type)].map(([type, count]) => ({
    base: componentGroupPremium(type, count),
    itemSurchargeRate: 0,
  }));
  return [...mainLines, ...componentLines];
};

const linePremium = (line: PremiumLine): number =>
  line.base * (1 + FIRST_INSURANCE_SURCHARGE + line.itemSurchargeRate);

const policyWideRate = (customer: Customer, quoteIndex: number): number => {
  let rate = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) rate -= LOYALTY_DISCOUNT;
  if (quoteIndex > 0) rate -= FOLLOW_UP_DISCOUNT;
  return rate;
};

const sum = (values: number[]): number => values.reduce((acc, v) => acc + v, 0);

const computePremium = (step: QuoteStep, customer: Customer, quoteIndex: number): number => {
  const lines = itemPremiumLines(step.items);
  const linesTotal = sum(lines.map(linePremium));
  const policyBase = sum(lines.map((l) => l.base));
  const policyWideAdjustment = policyBase * policyWideRate(customer, quoteIndex);
  return roundUpInMHPCOFavor(linesTotal + policyWideAdjustment + PROCESSING_FEE);
};

type Policy = { items: Item[]; cap: number };

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = sum(items.map((item) => INSURANCE_VALUE[item.type]));
  return { items, cap: insuranceSum * CAP_MULTIPLIER };
};

const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursementRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : 1;
  return Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${d.amount}`);
    }
  }
};

const validateDamagesCoveredByPolicy = (damages: Damage[], policy: Policy): void => {
  const policyCounts = tallyBy(policy.items, (i) => i.type);
  const damageCounts = tallyBy(damages, (d) => d.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`Claim has more ${type} damages than insured`);
    }
  }
};

const totalDamagePayout = (damages: Damage[], policy: Policy): number =>
  sum(damages.map((d) => {
    const item = policy.items.find((i) => i.type === d.itemType)!;
    return damagePayout(d, item);
  }));

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  const { damages } = step.incident;
  validateDamageAmounts(damages);
  validateDamagesCoveredByPolicy(damages, policy);
  const payout = Math.min(roundDownInMHPCOFavor(totalDamagePayout(damages, policy)), policy.cap);
  policy.cap -= payout;
  return { payout, remainingCap: policy.cap };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = computePremium(step, scenario.customer, policies.length);
      policies.push(createPolicy(step.items));
      return { premium };
    }
    return processClaim(step, policies);
  });
  return { results };
};
