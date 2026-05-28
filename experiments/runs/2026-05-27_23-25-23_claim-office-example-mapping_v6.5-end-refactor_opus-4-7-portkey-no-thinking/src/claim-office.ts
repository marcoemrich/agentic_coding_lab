type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;

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

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REIMBURSEMENT_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const groupPremium = (type: string, count: number): number =>
  isBlock(type, count) ? BLOCK_PREMIUM : BASE_PREMIUM[type] * count;

const tally = <T>(values: Iterable<T>, key: (v: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const v of values) {
    const k = key(v);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  tally(items, (i) => i.type);

const sumBasePremiumsByGroup = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + groupPremium(type, count),
    0,
  );

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const rateIf = (condition: boolean, rate: number): number =>
  condition ? rate : 0;

const surchargeRateFor = (item: Item): number =>
  rateIf(isCursed(item), CURSE_SURCHARGE)
  + rateIf(isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE);

const perItemSurcharges = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + BASE_PREMIUM[item.type] * surchargeRateFor(item),
    0,
  );

const policyWideAdjustments = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const netRate =
    FIRST_INSURANCE_SURCHARGE
    - rateIf(isLoyalCustomer(customer), LOYALTY_DISCOUNT)
    - rateIf(isFollowUp, FOLLOWUP_CONTRACT_DISCOUNT);
  return policyBase * netRate;
};

const quotePremiumFor = (
  customer: Customer,
  { items }: QuoteStep,
  isFollowUp: boolean,
): QuoteResult => {
  const policyBase = sumBasePremiumsByGroup(items);
  const total =
    policyBase
    + perItemSurcharges(items)
    + policyWideAdjustments(policyBase, customer, isFollowUp)
    + PROCESSING_FEE;
  return { premium: Math.ceil(total) };
};

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find(({ type }) => !(type in BASE_PREMIUM));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const createPolicy = ({ items }: QuoteStep): Policy => {
  assertKnownItemTypes(items);
  return { items, remainingCap: insuranceSumFor(items) * CAP_MULTIPLIER };
};

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= REIMBURSEMENT_HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT
    : 1;

const findItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (item === undefined) throw new Error(`Item not in policy: ${itemType}`);
  return item;
};

const payoutForDamage = (policy: Policy, damage: Damage): number => {
  const item = findItem(policy, damage.itemType);
  const reimbursed = damage.amount * reimbursementRateFor(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const totalPayout = (policy: Policy, damages: Damage[]): number =>
  damages.reduce((sum, d) => sum + payoutForDamage(policy, d), 0);

const capAndRoundDown = (amount: number, cap: number): number =>
  Math.floor(Math.min(amount, cap));

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) throw new Error(`Negative damage amount: ${negative.amount}`);
};

const assertDamagesFitPolicy = (policy: Policy, damages: Damage[]): void => {
  const policyCounts = countByType(policy.items);
  const exceeds = [...tally(damages, (d) => d.itemType)]
    .find(([type, count]) => count > (policyCounts.get(type) ?? 0));
  if (exceeds) throw new Error(`More damage entries for ${exceeds[0]} than policy covers`);
};

const settleClaim = (policy: Policy, { incident: { damages } }: ClaimStep): ClaimResult => {
  assertNonNegativeDamages(damages);
  assertDamagesFitPolicy(policy, damages);
  const payout = capAndRoundDown(totalPayout(policy, damages), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = ({ customer, steps }: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const handle = (step: Step): StepResult => {
    if (step.op === "quote") {
      const isFollowUp = policies.length > 0;
      policies.push(createPolicy(step));
      return quotePremiumFor(customer, step, isFollowUp);
    }
    return settleClaim(policies[step.policy], step);
  };
  return { results: steps.map(handle) };
};
