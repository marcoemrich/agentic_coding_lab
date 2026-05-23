type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type DamageEntry = { itemType: string; amount: number };
type Incident = { cause: string; damages: DamageEntry[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
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
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const assertKnownItemType = (type: string): void => {
  if (!isKnownItemType(type)) throw new Error(`Unknown item type: ${type}`);
};

const unitBasePremium = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const unitInsuranceValue = (type: string): number => INSURANCE_VALUES[type] ?? 0;

const isComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const groupBasePremium = (type: string, count: number): number =>
  isComponentBlock(type, count) ? BLOCK_BASE_PREMIUM : count * unitBasePremium(type);

const countBy = <T>(values: T[], key: (value: T) => string): Map<string, number> =>
  values.reduce(
    (counts, value) => counts.set(key(value), (counts.get(key(value)) ?? 0) + 1),
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const itemsBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + groupBasePremium(type, count),
    0,
  );

const enchantmentLevel = (item: Item | undefined): number => item?.enchantment ?? 0;

const itemModifierSurcharge = (item: Item): number => {
  const base = unitBasePremium(item.type);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge =
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseSurcharge + highEnchantmentSurcharge;
};

const itemsModifierSurcharge = (items: Item[]): number =>
  items.reduce((total, item) => total + itemModifierSurcharge(item), 0);

const loyaltyDiscount = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const base = itemsBasePremium(items);
  const modifierSurcharge = itemsModifierSurcharge(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  const discount = loyaltyDiscount(base, customer) + followUpDiscount(base, isFollowUp);
  return Math.ceil(base + modifierSurcharge + firstInsuranceSurcharge - discount + PROCESSING_FEE);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + unitInsuranceValue(item.type), 0);

type Policy = { items: Item[]; capRemaining: number };

const createPolicy = (items: Item[]): Policy => ({
  items,
  capRemaining: 2 * insuranceSum(items),
});

const findDamagedItem = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const reimbursableAmount = (item: Item | undefined, damage: DamageEntry): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

const damagePayout = (policy: Policy, damage: DamageEntry): number => {
  const item = findDamagedItem(policy, damage.itemType);
  return Math.max(0, reimbursableAmount(item, damage) - DEDUCTIBLE);
};

const validateDamageCounts = (policy: Policy, damages: DamageEntry[]): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damage entries for ${type} than insured`);
    }
  }
};

const validateDamageAmounts = (damages: DamageEntry[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Negative damage amount for ${negative.itemType}`);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamageAmounts(incident.damages);
  validateDamageCounts(policy, incident.damages);
  const rawPayout = incident.damages.reduce(
    (total, damage) => total + damagePayout(policy, damage),
    0,
  );
  const payout = Math.min(rawPayout, policy.capRemaining);
  policy.capRemaining -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.capRemaining };
};

const hasPriorQuote = (steps: Step[], upTo: number): boolean =>
  steps.slice(0, upTo).some((s) => s.op === "quote");

const handleQuote = (
  step: QuoteStep,
  index: number,
  scenario: Scenario,
  policies: Map<number, Policy>,
): QuoteResult => {
  step.items.forEach((item) => assertKnownItemType(item.type));
  const isFollowUp = hasPriorQuote(scenario.steps, index);
  policies.set(index, createPolicy(step.items));
  return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
};

const handleClaim = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`No policy at index ${step.policy}`);
  return processClaim(policy, step.incident);
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, Policy>();
  const results: StepResult[] = scenario.steps.map((step, index) =>
    step.op === "quote"
      ? handleQuote(step, index, scenario, policies)
      : handleClaim(step, policies),
  );
  return { results };
};
