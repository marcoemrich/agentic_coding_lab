type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

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
};

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isKnownItemType = (type: string): boolean =>
  BASE_PREMIUMS[type] !== undefined || KNOWN_COMPONENT_TYPES.has(type);

const isComponent = (item: Item): boolean => BASE_PREMIUMS[item.type] === undefined;

const componentGroupBase = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;

const countBy = <T>(items: T[], key: (item: T) => string): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(key(item), (counts.get(key(item)) ?? 0) + 1),
    new Map<string, number>(),
  );

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];
const itemInsuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : INSURANCE_VALUES[item.type];

const componentsBaseTotal = (components: Item[]): number =>
  [...countByType(components).values()].reduce(
    (sum, count) => sum + componentGroupBase(count),
    0,
  );

const partitionByComponent = (items: Item[]): { mainItems: Item[]; components: Item[] } =>
  items.reduce<{ mainItems: Item[]; components: Item[] }>(
    (acc, item) => {
      (isComponent(item) ? acc.components : acc.mainItems).push(item);
      return acc;
    },
    { mainItems: [], components: [] },
  );

const mainItemsBaseTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const policyBase = (items: Item[]): number => {
  const { mainItems, components } = partitionByComponent(items);
  return mainItemsBaseTotal(mainItems) + componentsBaseTotal(components);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharge = (item: Item): number => {
  if (isComponent(item)) return 0;
  const base = itemBasePremium(item);
  const rate = (isCursed(item) ? CURSE_RATE : 0) + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0);
  return base * rate;
};

const itemSurchargesTotal = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const isLoyal = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD;

const loyaltyDiscount = (base: number, customer: Customer): number =>
  isLoyal(customer) ? base * LOYALTY_RATE : 0;

type Policy = {
  items: Item[];
  remainingCap: number;
};

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Damage amount cannot be negative: ${negative.amount}`);
};

const validateDamageCounts = (damages: Damage[], policy: Policy): void => {
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  const policyCounts = countByType(policy.items);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`Too many damage entries for type: ${type}`);
    }
  }
};

const computeQuote = (step: QuoteStep, customer: Customer, quoteIndex: number): QuoteResult => {
  validateItemTypes(step.items);
  const base = policyBase(step.items);
  const surcharges = itemSurchargesTotal(step.items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty = loyaltyDiscount(base, customer);
  const followup = quoteIndex > 0 ? base * FOLLOWUP_RATE : 0;
  const premium = Math.ceil(base + surcharges + firstInsurance - loyalty - followup) + PROCESSING_FEE;
  return { premium };
};

const hasHighEnchantmentPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  hasHighEnchantmentPayout(item) ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE : damage.amount;

const computeDamagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const findPolicyItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType)!;

const computeClaim = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  validateDamageAmounts(step.incident.damages);
  const policy = policies.get(step.policy)!;
  validateDamageCounts(step.incident.damages, policy);
  const grossPayout = step.incident.damages.reduce(
    (sum, damage) => sum + computeDamagePayout(damage, findPolicyItem(policy, damage.itemType)),
    0,
  );
  const payout = Math.min(grossPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const result = computeQuote(step, scenario.customer, quoteIndex);
      policies.set(stepIndex, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
      });
      quoteIndex += 1;
      return result;
    }
    return computeClaim(step, policies);
  });
  return { results };
};
