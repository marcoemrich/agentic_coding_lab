const PROCESSING_FEE = 5;
const BLOCK_OF_THREE_SIZE = 3;
const BLOCK_OF_THREE_PREMIUM = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = -0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = -0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO?: number; firstInsurance?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type Policy = { items: Item[]; cap: number };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const basePremiumFor = (type: string): number => {
  const value = BASE_PREMIUM[type];
  if (value === undefined) throw new Error(`unknown item type: ${type}`);
  return value;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isMainItem = (item: Item): boolean => !isComponent(item);

const countBy = <T>(xs: T[], keyOf: (x: T) => string): Map<string, number> =>
  xs.reduce((m, x) => m.set(keyOf(x), (m.get(keyOf(x)) ?? 0) + 1), new Map<string, number>());

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_OF_THREE_SIZE ? BLOCK_OF_THREE_PREMIUM : count * basePremiumFor(type);

const componentsPremium = (items: Item[]): number =>
  Array.from(countBy(items.filter(isComponent), (i) => i.type))
    .reduce((sum, [type, count]) => sum + componentGroupPremium(type, count), 0);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const rateWhen = (applies: boolean, rate: number): number => (applies ? rate : 0);

const itemRateAdjustment = (item: Item): number =>
  rateWhen(item.cursed === true, CURSED_SURCHARGE) +
  rateWhen(isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE);

const itemPremium = (item: Item): number =>
  basePremiumFor(item.type) * (1 + itemRateAdjustment(item));

type PremiumBreakdown = { base: number; withSurcharges: number };

const addBreakdowns = (a: PremiumBreakdown, b: PremiumBreakdown): PremiumBreakdown => ({
  base: a.base + b.base,
  withSurcharges: a.withSurcharges + b.withSurcharges,
});

const mainItemBreakdown = (item: Item): PremiumBreakdown => ({
  base: basePremiumFor(item.type),
  withSurcharges: itemPremium(item),
});

const componentsBreakdown = (items: Item[]): PremiumBreakdown => {
  const total = componentsPremium(items);
  return { base: total, withSurcharges: total };
};

const itemsBreakdown = (items: Item[]): PremiumBreakdown =>
  items
    .filter(isMainItem)
    .map(mainItemBreakdown)
    .reduce(addBreakdowns, componentsBreakdown(items));

const isLongStanding = (customer: Customer): boolean =>
  (customer.yearsWithMHPCO ?? 0) >= LOYALTY_YEARS_THRESHOLD;

const policyRateAdjustment = (customer: Customer, isFollowUp: boolean): number =>
  rateWhen(customer.firstInsurance === true, FIRST_INSURANCE_SURCHARGE) +
  rateWhen(isLongStanding(customer), LOYALTY_DISCOUNT) +
  rateWhen(isFollowUp, FOLLOW_UP_DISCOUNT);

const FLOATING_POINT_EPSILON = 1e-9;

const roundUpInOurFavor = (amount: number): number =>
  Math.ceil(amount - FLOATING_POINT_EPSILON);

const roundDownInOurFavor = (amount: number): number =>
  Math.floor(amount + FLOATING_POINT_EPSILON);

const policyPremium = (customer: Customer, items: Item[], isFollowUp: boolean): number => {
  const { base, withSurcharges } = itemsBreakdown(items);
  return withSurcharges + base * policyRateAdjustment(customer, isFollowUp) + PROCESSING_FEE;
};

const quoteResult = (customer: Customer, items: Item[], isFollowUp: boolean): QuoteResult => ({
  premium: roundUpInOurFavor(policyPremium(customer, items, isFollowUp)),
});

const insuranceValueFor = (type: string): number => basePremiumFor(type) * INSURANCE_VALUE_MULTIPLIER;

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

const reimbursementRate = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const findInsuredItem = (items: Item[], type: string): Item | undefined =>
  items.find((i) => i.type === type);

const damagePayout = (damage: Damage, items: Item[]): number =>
  Math.max(0, damage.amount * reimbursementRate(findInsuredItem(items, damage.itemType)) - DEDUCTIBLE);

const totalRawPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, d) => sum + damagePayout(d, items), 0);

const openPolicy = (items: Item[]): Policy => ({
  items,
  cap: insuranceSumFor(items) * CAP_MULTIPLIER,
});

const countOf = (counts: Map<string, number>, key: string): number =>
  counts.get(key) ?? 0;

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countBy(policy.items, (i) => i.type);
  const damageCounts = countBy(damages, (d) => d.itemType);
  damageCounts.forEach((damageCount, type) => {
    if (damageCount > countOf(insuredCounts, type))
      throw new Error(`damage references more ${type} items than insured`);
  });
};

const validateDamageAmounts = (damages: Damage[]): void => {
  damages.forEach((d) => {
    if (d.amount < 0) throw new Error(`negative damage amount: ${d.amount}`);
  });
};

const validateClaim = (policy: Policy, damages: Damage[]): void => {
  validateDamageAmounts(damages);
  validateDamageCounts(policy, damages);
};

const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident.damages);
  const payout = roundDownInOurFavor(Math.min(totalRawPayout(incident.damages, policy.items), policy.cap));
  policy.cap -= payout;
  return { payout, remainingCap: policy.cap };
};

const processStep = (customer: Customer, policies: Policy[]) =>
  (step: Step, stepIndex: number): StepResult => {
    if (step.op === "quote") {
      policies[stepIndex] = openPolicy(step.items);
      return quoteResult(customer, step.items, stepIndex > 0);
    }
    return settleClaim(policies[step.policy], step.incident);
  };

export const runScenario = (input: unknown): { results: StepResult[] } => {
  const { customer, steps } = input as Scenario;
  const policies: Policy[] = [];
  return { results: steps.map(processStep(customer, policies)) };
};
