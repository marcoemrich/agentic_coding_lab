type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type ItemDef = { base: number; insurance: number };
const MAIN_ITEMS: Record<string, ItemDef> = {
  sword: { base: 100, insurance: 1000 },
  amulet: { base: 60, insurance: 600 },
  staff: { base: 80, insurance: 800 },
  potion: { base: 40, insurance: 400 },
};
const COMPONENT_ITEM: ItemDef = { base: 25, insurance: 250 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_BASE = 60;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const isKnownType = (type: string): boolean =>
  type in MAIN_ITEMS || COMPONENT_TYPES.has(type);

const itemDef = (type: string): ItemDef => {
  if (!isKnownType(type)) throw new Error(`Unknown item type: ${type}`);
  return MAIN_ITEMS[type] ?? COMPONENT_ITEM;
};
const itemUnitBase = (item: Item): number => itemDef(item.type).base;
const itemInsuranceValue = (item: Item): number => itemDef(item.type).insurance;

const itemSurcharges = (item: Item): number => {
  const base = itemUnitBase(item);
  const curse = item.cursed ? base * CURSE_RATE : 0;
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_RATE
      : 0;
  return curse + highEnchantment;
};

const isComponent = (type: string): boolean => !(type in MAIN_ITEMS);

const groupBasePremium = (type: string, count: number): number => {
  if (isComponent(type)) {
    if (count === 3) return COMPONENT_BLOCK_BASE;
    return count * COMPONENT_ITEM.base;
  }
  return count * MAIN_ITEMS[type].base;
};

const policyBasePremium = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    total += groupBasePremium(type, count);
  }
  return total;
};

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const loyaltyDiscountRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_RATE : 0;

const followUpDiscountRate = (stepIndex: number): number =>
  stepIndex > 0 ? FOLLOW_UP_RATE : 0;

const policyWideModifierRate = (customer: Customer, stepIndex: number): number =>
  FIRST_INSURANCE_RATE - loyaltyDiscountRate(customer) - followUpDiscountRate(stepIndex);

const quotePremium = (step: QuoteStep, customer: Customer, index: number): number => {
  const base = policyBasePremium(step.items);
  const surcharges = totalItemSurcharges(step.items);
  const policyModifiers = base * policyWideModifierRate(customer, index);
  return Math.ceil(base + surcharges + policyModifiers + PROCESSING_FEE);
};

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const reimbursableAmount = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const matchDamagesToItems = (damages: Damage[], items: Item[]): Array<[Damage, Item]> => {
  const remaining = [...items];
  return damages.map((d) => {
    if (d.amount < 0) throw new Error(`Damage amount must be non-negative: ${d.amount}`);
    const idx = remaining.findIndex((i) => i.type === d.itemType);
    if (idx < 0) throw new Error(`Damage references item not in policy: ${d.itemType}`);
    const [item] = remaining.splice(idx, 1);
    return [d, item];
  });
};

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  const damaged = matchDamagesToItems(step.incident.damages, policy.items);
  const desired = damaged.reduce((sum, [d, item]) => sum + damagePayout(d, item), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      policies[index] = buildPolicy(step.items);
      return { premium: quotePremium(step, scenario.customer, index) };
    }
    return processClaim(step, policies);
  });
  return { results };
};
