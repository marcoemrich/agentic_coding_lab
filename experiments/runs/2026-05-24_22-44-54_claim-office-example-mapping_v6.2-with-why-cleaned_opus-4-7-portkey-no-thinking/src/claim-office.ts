type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = {
  customer: Customer;
  steps: Step[];
};

const PROCESSING_FEE = 5;
const FIRST_CONTRACT_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const groupCountsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const baseForGroup = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE;
  }
  return count * ITEM_BASE[type];
};

const calculatePolicyBase = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of groupCountsByType(items)) {
    total += baseForGroup(type, count);
  }
  return total;
};

const roundUpInMHPCOsFavor = (amount: number): number => Math.ceil(amount);

type ItemSurcharge = { applies: (item: Item) => boolean; rate: number };

const ITEM_SURCHARGES: ItemSurcharge[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const surchargesForItem = (item: Item): number => {
  const itemBase = ITEM_BASE[item.type];
  return ITEM_SURCHARGES.reduce(
    (sum, { applies, rate }) => sum + (applies(item) ? itemBase * rate : 0),
    0,
  );
};

const itemSpecificSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargesForItem(item), 0);

type PolicyContext = { customer: Customer; quoteIndex: number };

type PolicyModifier = {
  applies: (context: PolicyContext) => boolean;
  signedRate: number;
};

const POLICY_MODIFIERS: PolicyModifier[] = [
  { applies: () => true, signedRate: +FIRST_CONTRACT_SURCHARGE_RATE },
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    signedRate: -LOYALTY_DISCOUNT_RATE,
  },
  {
    applies: ({ quoteIndex }) => quoteIndex > 0,
    signedRate: -FOLLOW_UP_DISCOUNT_RATE,
  },
];

const policyWideAdjustment = (policyBase: number, context: PolicyContext): number =>
  POLICY_MODIFIERS.reduce(
    (sum, { applies, signedRate }) => sum + (applies(context) ? policyBase * signedRate : 0),
    0,
  );

const quotePremium = ({ items }: QuoteStep, context: PolicyContext): number => {
  const policyBase = calculatePolicyBase(items);
  return roundUpInMHPCOsFavor(
    policyBase +
      itemSpecificSurcharges(items) +
      policyWideAdjustment(policyBase, context) +
      PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUE[item.type], 0);

const roundDownInMHPCOsFavor = (amount: number): number => Math.floor(amount);

type Policy = { items: Item[]; remainingCap: number };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };

const reimbursableDamage = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(reimbursableDamage(damage, item) - DEDUCTIBLE, 0);

const findInsuredItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType) as Item;

const sumPayouts = (policy: Policy, damages: Damage[]): number =>
  damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, findInsuredItem(policy, damage.itemType)),
    0,
  );

const processClaim = (policy: Policy, step: ClaimStep): ClaimResult => {
  const claimedAmount = sumPayouts(policy, step.incident.damages);
  const payout = roundDownInMHPCOsFavor(Math.min(claimedAmount, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

const handleQuote = (
  step: QuoteStep,
  customer: Customer,
  policies: Policy[],
): QuoteResult => {
  const quoteIndex = policies.length;
  policies.push(openPolicy(step.items));
  return { premium: quotePremium(step, { customer, quoteIndex }) };
};

const handleClaim = (step: ClaimStep, policies: Policy[]): ClaimResult =>
  processClaim(policies[step.policy], step);

export const runScenario = ({ customer, steps }: Scenario): {
  results: (QuoteResult | ClaimResult)[];
} => {
  const policies: Policy[] = [];
  const results = steps.map((step): QuoteResult | ClaimResult =>
    step.op === "quote"
      ? handleQuote(step, customer, policies)
      : handleClaim(step, policies),
  );
  return { results };
};
