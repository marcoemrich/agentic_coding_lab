export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type QuoteStep = { op: "quote"; items: Item[] };
export type Customer = { yearsWithMHPCO: number };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Step = QuoteStep | ClaimStep;
export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResult = { results: (QuoteResult | ClaimResult)[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

// Amounts are rounded to whole G in the MHPCO's favor.
const roundPremium = (amount: number): number => Math.ceil(amount);
const roundPayout = (amount: number): number => Math.floor(amount);

const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

type PriceListEntry = { insuranceValue: number; basePremium: number };

const COMPONENT_PRICE: PriceListEntry = { insuranceValue: 250, basePremium: 25 };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  ...Object.fromEntries(COMPONENT_TYPES.map((type) => [type, COMPONENT_PRICE])),
};

const isComponent = (type: string): boolean => COMPONENT_TYPES.includes(type);

const isKnownItemType = (type: string): boolean => type in PRICE_LIST;

const assertKnownItem = (item: Item): void => {
  if (!isKnownItemType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
};

const countOccurrences = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) counts.set(type, (counts.get(type) ?? 0) + 1);
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countOccurrences(items.map((item) => item.type));

const basePremiumForType = (type: string, count: number): number =>
  isComponent(type) && count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * PRICE_LIST[type].basePremium;

export const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce((sum, [type, count]) => sum + basePremiumForType(type, count), 0);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharge = (item: Item): number => {
  const itemBase = PRICE_LIST[item.type].basePremium;
  const curse = item.cursed ? percentOf(itemBase, CURSE_SURCHARGE_PERCENT) : 0;
  const enchantment = isHighlyEnchanted(item)
    ? percentOf(itemBase, HIGH_ENCHANTMENT_SURCHARGE_PERCENT)
    : 0;
  return curse + enchantment;
};

const isLongStanding = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

const policyModifierPercent = (customer: Customer, isFollowUp: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT -
  (isLongStanding(customer) ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  step.items.forEach(assertKnownItem);
  const policyBase = policyBasePremium(step.items);
  const itemSurcharges = step.items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const policyModifiers = percentOf(policyBase, policyModifierPercent(customer, isFollowUp));
  return roundPremium(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);

const policyCap = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);
const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;

const reimbursableAmount = (item: Item | undefined, damage: Damage): number =>
  (item?.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
    ? percentOf(damage.amount, REDUCED_REIMBURSEMENT_PERCENT)
    : damage.amount;

type Policy = { items: Item[]; remainingCap: number };

const assertValidDamages = (damages: Damage[], items: Item[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const insured = countByType(items);
  const damaged = countOccurrences(damages.map((damage) => damage.itemType));
  for (const [type, count] of damaged) {
    if (count > (insured.get(type) ?? 0)) {
      throw new Error(`Claim references ${count} ${type} damage(s) but policy covers ${insured.get(type) ?? 0}`);
    }
  }
};

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  assertValidDamages(step.incident.damages, policy.items);
  const desired = step.incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    return sum + reimbursableAmount(item, damage) - DEDUCTIBLE;
  }, 0);
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const findPolicy = (policies: Map<number, Policy>, index: number): Policy => {
  const policy = policies.get(index);
  if (!policy) throw new Error(`No policy was created by step ${index}`);
  return policy;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(step, findPolicy(policies, step.policy));
    const isFollowUp = policies.size > 0;
    const premium = quotePremium(step, scenario.customer, isFollowUp);
    policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
    return { premium };
  });
  return { results };
};
