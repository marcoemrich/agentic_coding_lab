const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_COVERAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_COVERAGE_RATE = 0.5;

const reimbursableAmount = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_COVERAGE_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_COVERAGE_RATE;
  }
  return damageAmount;
};

const countByType = <T extends { itemType: string }>(items: T[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const { itemType } of items) {
    counts.set(itemType, (counts.get(itemType) ?? 0) + 1);
  }
  return counts;
};

const findPolicyItem = (policyItems: Item[], itemType: string): Item => {
  const item = policyItems.find((i) => i.type === itemType);
  if (item === undefined) {
    throw new Error(`Claim references item type not in policy: ${itemType}`);
  }
  return item;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${d.amount}`);
    }
  }
};

const validateDamageCounts = (damages: Damage[], policyItems: Item[]): void => {
  const damageCounts = countByType(damages);
  for (const [itemType, count] of damageCounts) {
    const insuredCount = policyItems.filter((i) => i.type === itemType).length;
    if (count > insuredCount) {
      throw new Error(`Claim has more ${itemType} damages (${count}) than insured (${insuredCount})`);
    }
  }
};

const damagePayout = (damage: Damage, policyItems: Item[]): number => {
  const item = findPolicyItem(policyItems, damage.itemType);
  return reimbursableAmount(item, damage.amount) - DEDUCTIBLE_PER_DAMAGE;
};

const claimStep = (step: ClaimStep, policyItems: Item[]): { payout: number } => {
  const { damages } = step.incident;
  validateDamageAmounts(damages);
  validateDamageCounts(damages, policyItems);
  const payout = damages.reduce((sum, d) => sum + damagePayout(d, policyItems), 0);
  return { payout: Math.floor(payout) };
};

const itemBasePremium = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return base;
};

const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const sumItemBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const groupByType = (items: Item[]): Map<string, Item[]> => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
};

const priceComponentGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : sumItemBasePremiums(group);

const computeBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const nonComponents = items.filter((item) => !isComponent(item));
  const componentGroups = [...groupByType(components).values()];
  const componentTotal = componentGroups.reduce(
    (sum, group) => sum + priceComponentGroup(group),
    0,
  );
  return sumItemBasePremiums(nonComponents) + componentTotal;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curse + enchantment;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

type Customer = { yearsWithMHPCO: number };
type PolicyContext = { customer: Customer; contractIndex: number };

const loyaltyDiscount = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscount = (base: number, contractIndex: number): number =>
  contractIndex > 0 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;

const sumPolicyDiscounts = (base: number, ctx: PolicyContext): number =>
  loyaltyDiscount(base, ctx.customer) + followUpDiscount(base, ctx.contractIndex);

const sumPolicySurcharges = (base: number): number => base * FIRST_INSURANCE_RATE;

const quoteStep = (step: QuoteStep, ctx: PolicyContext): { premium: number } => {
  const base = computeBasePremium(step.items);
  const surcharges = sumItemSurcharges(step.items) + sumPolicySurcharges(base);
  const discounts = sumPolicyDiscounts(base, ctx);
  return {
    premium: Math.ceil(base + surcharges - discounts + PROCESSING_FEE),
  };
};

export const runScenario = (scenario: unknown): unknown => {
  const { customer, steps } = scenario as Scenario;
  let contractIndex = 0;
  const policies = new Map<number, Item[]>();
  const results = steps.map((step, index) => {
    if (step.op === "claim") {
      const policyItems = policies.get(step.policy) ?? [];
      return claimStep(step, policyItems);
    }
    policies.set(index, step.items);
    const result = quoteStep(step, { customer, contractIndex });
    contractIndex += 1;
    return result;
  });
  return { results };
};
