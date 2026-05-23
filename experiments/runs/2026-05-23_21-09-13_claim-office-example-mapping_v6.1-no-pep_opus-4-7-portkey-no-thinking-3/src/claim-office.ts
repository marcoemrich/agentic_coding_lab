const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Customer = { yearsWithMHPCO: number };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: Customer; steps: Step[] };

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const itemSurchargeRate = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
};

const itemBasePremium = (item: Item): number => {
  const premium = BASE_PREMIUM_BY_TYPE[item.type];
  if (premium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return premium;
};

const itemInsuranceValue = (item: Item): number => {
  const value = INSURANCE_VALUE_BY_TYPE[item.type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return value;
};

const policyBasePremium = (items: Item[]): number => {
  const componentsByType = new Map<string, Item[]>();
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      const list = componentsByType.get(item.type) ?? [];
      list.push(item);
      componentsByType.set(item.type, list);
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const components of componentsByType.values()) {
    total += components.length === BLOCK_SIZE
      ? BLOCK_PREMIUM
      : components.reduce((sum, c) => sum + itemBasePremium(c), 0);
  }
  return total;
};

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item) * itemSurchargeRate(item), 0);

const policyModifierRate = (customer: Customer, quoteIndex: number): number => {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (quoteIndex > 0) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }
  return rate;
};

const quotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  const policyBase = policyBasePremium(items);
  const itemSurcharges = totalItemSurcharges(items);
  const policyModifiers = policyBase * policyModifierRate(customer, quoteIndex);
  return Math.ceil(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
};

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const reimbursementFor = (item: Item, amount: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return amount;
};

const processClaim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  const remainingByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = remainingByType.get(item.type) ?? [];
    list.push(item);
    remainingByType.set(item.type, list);
  }
  let rawPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const available = remainingByType.get(damage.itemType);
    if (!available || available.length === 0) {
      throw new Error(`Damaged item not in policy: ${damage.itemType}`);
    }
    const item = available.shift() as Item;
    const reimbursed = reimbursementFor(item, damage.amount);
    rawPayout += Math.max(0, reimbursed - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): unknown => {
  const policies: Record<number, Policy> = {};
  let quoteIndex = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, quoteIndex);
      quoteIndex += 1;
      policies[index] = buildPolicy(step.items);
      return { premium };
    }
    const policy = policies[step.policy];
    if (!policy) {
      throw new Error(`Unknown policy index: ${step.policy}`);
    }
    return processClaim(policy, step.incident);
  });
  return { results };
};
