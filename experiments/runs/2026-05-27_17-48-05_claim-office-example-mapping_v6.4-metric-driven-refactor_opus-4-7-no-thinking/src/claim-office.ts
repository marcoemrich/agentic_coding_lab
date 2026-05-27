interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const CURSED_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FOLLOW_UP_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isBuildingBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const groupBasePremium = (type: string, count: number): number =>
  isBuildingBlock(type, count) ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUM[type];

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const policyBase = (items: Item[]): number =>
  Array.from(countByType(items)).reduce(
    (total, [type, count]) => total + groupBasePremium(type, count),
    0,
  );

const SURCHARGE_RATES: ReadonlyArray<(item: Item) => number> = [
  (item) => (item.cursed ? CURSED_RATE : 0),
  (item) => ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE : 0),
];

const itemSurcharges = (item: Item): number => {
  const itemBase = BASE_PREMIUM[item.type];
  const totalRate = SURCHARGE_RATES.reduce((sum, rate) => sum + rate(item), 0);
  return itemBase * totalRate;
};

const policySurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const firstInsuranceSurcharge = (base: number): number => base * FIRST_INSURANCE_RATE;

const loyaltyDiscount = (customer: Customer, base: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_RATE : 0;

const followUpDiscount = (quoteIndex: number, base: number): number =>
  quoteIndex > 0 ? base * FOLLOW_UP_RATE : 0;

const computePremium = (customer: Customer, quoteIndex: number, items: Item[]): number => {
  const base = policyBase(items);
  const surcharges = policySurcharges(items) + firstInsuranceSurcharge(base);
  const discounts = loyaltyDiscount(customer, base) + followUpDiscount(quoteIndex, base);
  return Math.ceil(base + surcharges - discounts + PROCESSING_FEE);
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const assertKnownType = (type: string): void => {
  if (!(type in BASE_PREMIUM)) {
    throw new Error(`Unknown item type: ${type}`);
  }
};

const createPolicy = (items: Item[]): Policy => {
  items.forEach((item) => assertKnownType(item.type));
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items: [...items], remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const damagePayout = (damage: Damage, item: Item): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const reimbursementRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : 1;
  const reimbursed = damage.amount * reimbursementRate;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const matchDamagesToItems = (policy: Policy, damages: Damage[]): Item[] => {
  const available = [...policy.items];
  return damages.map((d) => {
    const idx = available.findIndex((it) => it.type === d.itemType);
    if (idx === -1) {
      throw new Error(`Damaged item ${d.itemType} is not part of the policy`);
    }
    const [item] = available.splice(idx, 1);
    return item;
  });
};

const processClaim = (policy: Policy, step: ClaimStep): ClaimResult => {
  const items = matchDamagesToItems(policy, step.incident.damages);
  const grossPayout = step.incident.damages.reduce(
    (sum, d, i) => sum + damagePayout(d, items[i]),
    0,
  );
  const finalPayout = Math.min(Math.floor(grossPayout), policy.remainingCap);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  const results: StepResult[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const policy = createPolicy(step.items);
      const premium = computePremium(scenario.customer, quoteIndex, step.items);
      quoteIndex += 1;
      policies.set(stepIndex, policy);
      return { premium };
    }
    return processClaim(policies.get(step.policy)!, step);
  });
  return { results };
};
