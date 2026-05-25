type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEAR_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

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

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

const itemInsuranceValue = (type: string): number => {
  if (isComponent(type)) return COMPONENT_INSURANCE_VALUE;
  if (!(type in INSURANCE_VALUES)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return INSURANCE_VALUES[type];
};

const componentBlockPrice = (count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_BASE;
  return count * COMPONENT_BASE;
};

const itemBasePremium = (item: Item): number => {
  if (isComponent(item.type)) return COMPONENT_BASE;
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type];
};

const itemSurcharges = (item: Item, base: number): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  surcharge += base * FIRST_INSURANCE_SURCHARGE_RATE;
  return surcharge;
};

type PricedItem = { item: Item; base: number; surcharges: number };

const priceItems = (items: Item[]): PricedItem[] => {
  // Group components by type to apply block pricing to BASE only.
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    }
  }

  // Distribute block-discounted base across each component item proportionally:
  // for a block of exactly 3 of one type, the total component base for those is 60 (not 75).
  // We'll attribute base 20G (60/3) to each item in a block; otherwise 25G each.
  const perTypeAdjustedBase = new Map<string, number>();
  for (const [type, count] of componentCounts) {
    const totalBase = componentBlockPrice(count);
    perTypeAdjustedBase.set(type, totalBase / count);
  }

  return items.map((item) => {
    let base: number;
    if (isComponent(item.type)) {
      base = perTypeAdjustedBase.get(item.type) ?? COMPONENT_BASE;
    } else {
      base = itemBasePremium(item);
    }
    const surcharges = itemSurcharges(item, base);
    return { item, base, surcharges };
  });
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const priced = priceItems(items);
  const itemsTotal = priced.reduce((sum, p) => sum + p.base + p.surcharges, 0);
  let policyTotal = itemsTotal;
  if (customer.yearsWithMHPCO >= LOYALTY_YEAR_THRESHOLD) {
    const baseTotal = priced.reduce((sum, p) => sum + p.base, 0);
    policyTotal -= baseTotal * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUp) {
    const baseTotal = priced.reduce((sum, p) => sum + p.base, 0);
    policyTotal -= baseTotal * FOLLOWUP_DISCOUNT_RATE;
  }
  return Math.ceil(policyTotal + PROCESSING_FEE);
};

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isComponent(item.type) && !(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const damagePayout = (item: Item, amount: number): number => {
  let reimbursable = amount;
  if (item.material === DRAGON_MATERIAL && (item.enchantment ?? 0) < HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursable = amount;
  } else if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursable = amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  } else if (item.material === DRAGON_MATERIAL) {
    reimbursable = amount;
  }
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

type PolicyState = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const buildPolicy = (items: Item[]): PolicyState => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item.type), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const processClaim = (policy: PolicyState, incident: Incident): ClaimResult => {
  // Match damage entries to policy items. Each damage entry must correspond to a distinct policy item.
  const availableItems = [...policy.items];
  const matchedItems: Item[] = [];
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const idx = availableItems.findIndex((it) => it.type === damage.itemType);
    if (idx === -1) {
      throw new Error(`Damaged item ${damage.itemType} not covered by policy`);
    }
    matchedItems.push(availableItems[idx]);
    availableItems.splice(idx, 1);
  }

  let totalPayout = 0;
  for (let i = 0; i < incident.damages.length; i += 1) {
    const damage = incident.damages[i];
    const item = matchedItems[i];
    const rawPayout = damagePayout(item, damage.amount);
    const allowed = Math.min(rawPayout, policy.remainingCap - totalPayout);
    totalPayout += Math.max(0, allowed);
  }
  const finalPayout = Math.floor(totalPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, PolicyState>();
  let quoteCount = 0;
  const results: StepResult[] = input.steps.map((step, index) => {
    if (step.op === "quote") {
      validateItems(step.items);
      const isFollowUp = quoteCount > 0;
      const premium = quotePremium(step.items, input.customer, isFollowUp);
      policies.set(index, buildPolicy(step.items));
      quoteCount += 1;
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
    return processClaim(policy, step.incident);
  });
  return { results };
};
