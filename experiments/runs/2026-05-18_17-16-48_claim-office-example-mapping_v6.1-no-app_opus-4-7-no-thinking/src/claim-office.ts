const PROCESSING_FEE = 5;
const COMPONENT_UNIT_PRICE = 25;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_BLOCK_SIZE = 3;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;

const CLAIM_DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_ITEM_TYPE || COMPONENT_TYPES.has(type);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const basePremiumForRegularItem = (item: Item): number =>
  BASE_PREMIUM_BY_ITEM_TYPE[item.type] ?? 0;

const insuranceValueForItem = (item: Item): number =>
  isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : INSURANCE_VALUE_BY_ITEM_TYPE[item.type] ?? 0;

const itemSurcharges = (item: Item): number => {
  const base = basePremiumForRegularItem(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
};

const partition = <T,>(items: T[], predicate: (item: T) => boolean): [T[], T[]] =>
  items.reduce<[T[], T[]]>(
    ([yes, no], item) => (predicate(item) ? [[...yes, item], no] : [yes, [...no, item]]),
    [[], []],
  );

const countBy = <T,>(values: T[], key: (value: T) => string): Record<string, number> =>
  values.reduce<Record<string, number>>((acc, value) => {
    const k = key(value);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

const countItemsByType = (items: Item[]): Record<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByItemType = (damages: Damage[]): Record<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * COMPONENT_UNIT_PRICE;

const sumRegularItemBasePremiums = (items: Item[]): number =>
  items.reduce((total, item) => total + basePremiumForRegularItem(item), 0);

const sumComponentPremiums = (components: Item[]): number =>
  Object.values(countItemsByType(components)).reduce(
    (sum, count) => sum + componentGroupPremium(count),
    0,
  );

const policyBasePremium = (items: Item[]): number => {
  const [components, regularItems] = partition(items, isComponent);
  return sumRegularItemBasePremiums(regularItems) + sumComponentPremiums(components);
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharges(item), 0);

type QuoteContext = {
  customer: Customer;
  contractIndex: number;
};

const policyModifierRate = (ctx: QuoteContext): number => {
  let rate = FIRST_INSURANCE_RATE;
  if (ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) rate -= LOYALTY_DISCOUNT_RATE;
  if (ctx.contractIndex >= 1) rate -= FOLLOWUP_CONTRACT_DISCOUNT_RATE;
  return rate;
};

const premiumForItems = (items: Item[], ctx: QuoteContext): number => {
  const policyBase = policyBasePremium(items);
  const surcharges = sumItemSurcharges(items);
  const policyModifiers = policyBase * policyModifierRate(ctx);
  return Math.ceil(policyBase + surcharges + policyModifiers + PROCESSING_FEE);
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

const buildPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: items.reduce((sum, item) => sum + insuranceValueForItem(item), 0) * CAP_MULTIPLIER,
});

const processQuote = (step: QuoteStep, ctx: QuoteContext): QuoteResult => {
  validateItems(step.items);
  return { premium: premiumForItems(step.items, ctx) };
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

const reimbursementForDamage = (item: Item, amount: number): number =>
  isHighlyEnchanted(item) ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : amount;

const payoutForDamage = (item: Item, amount: number): number => {
  const reimbursement = reimbursementForDamage(item, amount);
  return Math.max(0, reimbursement - CLAIM_DEDUCTIBLE);
};

const findItemForDamage = (policy: Policy, damage: Damage): Item | undefined =>
  policy.items.find((item) => item.type === damage.itemType);

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const damageCounts = countDamagesByItemType(damages);
  const itemCounts = countItemsByType(policy.items);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[type] ?? 0)) {
      throw new Error(`More damages of type ${type} than insured items`);
    }
  }
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  validateDamageCounts(policy, damages);
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
    if (!findItemForDamage(policy, damage)) {
      throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    }
  }
};

const applyDamageToPolicy = (policy: Policy, damage: Damage): number => {
  const item = findItemForDamage(policy, damage)!;
  const wanted = Math.floor(payoutForDamage(item, damage.amount));
  const actualPayout = Math.min(wanted, policy.remainingCap);
  policy.remainingCap -= actualPayout;
  return actualPayout;
};

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateDamages(policy, step.incident.damages);
  const totalPayout = step.incident.damages.reduce(
    (sum, damage) => sum + applyDamageToPolicy(policy, damage),
    0,
  );
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (input: Scenario): { results: StepResult[] } => {
  let contractIndex = 0;
  const policies: Record<number, Policy> = {};
  const results: StepResult[] = input.steps.map((step, idx) => {
    if (step.op === "quote") {
      const ctx: QuoteContext = { customer: input.customer, contractIndex };
      contractIndex += 1;
      policies[idx] = buildPolicy(step.items);
      return processQuote(step, ctx);
    }
    return processClaim(step, policies[step.policy]);
  });
  return { results };
};
