type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Customer = { yearsWithMHPCO: number };
type PolicyContext = { customer: Customer; previousContracts: number };
type QuoteInput = PolicyContext & { items: Item[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = -0.2;
const FOLLOW_UP_DISCOUNT_RATE = -0.15;
const LOYALTY_THRESHOLD_YEARS = 2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const basePremiumForItem = (item: Item): number =>
  BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const isLongStandingCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const isCursed = (item: Item): boolean => item.cursed === true;

const surcharge = (base: number, applies: boolean, rate: number): number =>
  applies ? base * rate : 0;

const applyPolicyModifiers = (base: number, ctx: PolicyContext): number =>
  base +
  surcharge(base, true, FIRST_INSURANCE_SURCHARGE_RATE) +
  surcharge(base, isLongStandingCustomer(ctx.customer), LOYALTY_DISCOUNT_RATE) +
  surcharge(base, ctx.previousContracts >= 1, FOLLOW_UP_DISCOUNT_RATE);

const itemSpecificSurcharges = (item: Item, base: number): number =>
  surcharge(base, isCursed(item), CURSED_SURCHARGE_RATE) +
  surcharge(base, isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE_RATE);

const premiumForItem = (item: Item, ctx: PolicyContext): number => {
  const base = basePremiumForItem(item);
  return applyPolicyModifiers(base, ctx) + itemSpecificSurcharges(item, base);
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentGroupBase = (items: Item[]): number => {
  const itemBase = basePremiumForItem(items[0]);
  if (items.length === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_BASE;
  return items.length * itemBase;
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

const componentsTotal = (items: Item[], ctx: PolicyContext): number =>
  [...groupByType(items).values()].reduce(
    (sum, groupItems) =>
      sum + applyPolicyModifiers(componentGroupBase(groupItems), ctx),
    0,
  );

const nonComponentsTotal = (items: Item[], ctx: PolicyContext): number =>
  items.reduce((sum, item) => sum + premiumForItem(item, ctx), 0);

export const quote = (input: QuoteInput): { premium: number } => {
  const components = input.items.filter(isComponent);
  const nonComponents = input.items.filter((item) => !isComponent(item));
  const itemsTotal =
    nonComponentsTotal(nonComponents, input) +
    componentsTotal(components, input);
  return { premium: Math.ceil(itemsTotal + PROCESSING_FEE) };
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Damage = { itemType: string; amount: number };
type ClaimInput = { items: Item[]; damages: Damage[]; remainingCap?: number };

const insuranceValueForItem = (item: Item): number =>
  INSURANCE_VALUE_BY_TYPE[item.type] ?? 0;

const defaultCap = (items: Item[]): number =>
  CAP_MULTIPLIER * items.reduce((sum, item) => sum + insuranceValueForItem(item), 0);

const isHighEnchantmentClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  isHighEnchantmentClaim(item)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  reimbursableAmount(damage, item) - DEDUCTIBLE;

const findItemByType = (items: Item[], itemType: string): Item =>
  items.find((item) => item.type === itemType)!;

const totalDamagePayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + damagePayout(damage, findItemByType(items, damage.itemType)),
    0,
  );

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; damages: Damage[]; policyStepIndex?: number };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type StepResult = { premium: number } | { payout: number; remainingCap: number };
type ScenarioResult = { results: StepResult[] };

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

const executeQuoteStep = (step: QuoteStep, customer: Customer): StepResult =>
  quote({ customer, items: step.items, previousContracts: 0 });

export const runScenario = (scenario: Scenario): ScenarioResult => ({
  results: scenario.steps
    .filter(isQuoteStep)
    .map((step) => executeQuoteStep(step, scenario.customer)),
});

export const claim = (input: ClaimInput): { payout: number; remainingCap: number } => {
  const rawPayout = totalDamagePayout(input.damages, input.items);
  const cap = input.remainingCap ?? defaultCap(input.items);
  const payout = Math.floor(Math.min(rawPayout, cap));
  return { payout, remainingCap: cap - payout };
};
