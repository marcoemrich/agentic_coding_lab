type Item = {
  type: string;
  subtype?: string;
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

const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

// Items' insurance values for claim handling.
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  component: 250,
};

const COMPONENT_BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

const roundUp = (amount: number): number => Math.ceil(amount);

// Apply a percentage as an integer fraction to avoid float rounding errors.
const scale = (amount: number, num: number, denom: number): number =>
  (amount * num) / denom;

const itemBasePremium = (item: Item): number => {
  let base = BASE_PREMIUM[item.type];
  // Cursed items add a 50% risk surcharge.
  if (item.cursed) base = scale(base, 3, 2);
  // Highly enchanted items (>= 5) add a 30% risk surcharge.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    base = scale(base, 13, 10);
  }
  return base;
};

const itemsBaseTotal = (items: Item[]): number => {
  // 3 alike components form a special block at 60 G.
  if (
    items.length === 3 &&
    items.every((i) => i.type === "component" && i.subtype === items[0].subtype)
  ) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return items.reduce((sum, i) => sum + itemBasePremium(i), 0);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, i) => sum + INSURANCE_VALUE[i.type], 0);

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFirstContract: boolean,
): number => {
  let amount = itemsBaseTotal(step.items);
  if (isFirstContract) {
    // First insurance: +10% initial assessment surcharge.
    amount = scale(amount, 11, 10);
  } else {
    // Subsequent contracts: -15% multi-contract discount.
    amount = scale(amount, 85, 100);
  }
  // Loyalty: -20% for customers with >= 2 years.
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    amount = scale(amount, 8, 10);
  }
  return roundUp(amount) + PROCESSING_FEE;
};

type Policy = { items: Item[]; remainingCap: number };

const reimbursableAmount = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find((i) => i.type === damage.itemType);
  // Dragon material: fully reimbursed (overrides enchantment haircut).
  if (item?.material === "dragon") return damage.amount;
  // Highly enchanted items (>= 8): reimbursed at 50%.
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount / 2;
  }
  return damage.amount;
};

const damagePayout = (damage: Damage, policy: Policy): number =>
  Math.max(0, reimbursableAmount(damage, policy) - DEDUCTIBLE);

const processClaim = (
  step: ClaimStep,
  policies: Record<number, Policy>,
): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  const rawPayout = step.incident.damages.reduce(
    (sum, d) => sum + damagePayout(d, policy),
    0,
  );
  const payout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (input: unknown): unknown => {
  const { steps, customer } = input as Scenario;
  const policies: Record<number, Policy> = {};
  let contractCount = 0;
  const results = steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step, customer, contractCount === 0);
      contractCount += 1;
      policies[index] = {
        items: step.items,
        remainingCap: insuranceSum(step.items) * 2,
      };
      return { premium };
    }
    return processClaim(step, policies);
  });
  return { results };
};
