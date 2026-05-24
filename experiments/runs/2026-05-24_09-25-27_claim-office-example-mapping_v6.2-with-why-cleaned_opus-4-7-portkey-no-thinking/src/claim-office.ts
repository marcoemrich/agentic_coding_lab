type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// MHPCO always rounds in its own favor: premiums (customer pays) round UP,
// payouts (MHPCO pays) round DOWN.
const roundPremiumInMHPCOFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOFavor = (amount: number): number => Math.floor(amount);

const countBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) counts[keyOf(item)] = (counts[keyOf(item)] ?? 0) + 1;
  return counts;
};

const countByType = (items: Item[]): Record<string, number> =>
  countBy(items, (item) => item.type);

const qualifiesForComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

const lineItemPrice = (type: string, count: number): number =>
  qualifiesForComponentBlock(type, count)
    ? COMPONENT_BLOCK_PRICE
    : BASE_PREMIUM[type] * count;

const sumBasePremiums = (items: Item[]): number =>
  Object.entries(countByType(items))
    .reduce((total, [type, count]) => total + lineItemPrice(type, count), 0);

const rateOf = (amount: number, rate: number, applies: boolean): number =>
  applies ? amount * rate : 0;

const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD);

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => {
    const base = BASE_PREMIUM[item.type];
    return sum
      + rateOf(base, CURSE_SURCHARGE_RATE, isCursed(item))
      + rateOf(base, HIGH_ENCHANTMENT_RATE, isHighlyEnchanted(item));
  }, 0);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const isFollowupContract = (stepIndex: number): boolean => stepIndex > 0;

const quotePremium = (items: Item[], customer: Customer, stepIndex: number): number => {
  const basePremium = sumBasePremiums(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = rateOf(basePremium, LOYALTY_DISCOUNT_RATE, isLoyalCustomer(customer));
  const followupDiscount = rateOf(basePremium, FOLLOWUP_DISCOUNT_RATE, isFollowupContract(stepIndex));
  return roundPremiumInMHPCOFavor(basePremium + surcharges + firstInsurance - loyaltyDiscount - followupDiscount + PROCESSING_FEE);
};

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const reimbursableAmount = (item: Item, amount: number): number =>
  enchantmentAtLeast(item, CLAIM_HIGH_ENCHANTMENT_THRESHOLD)
    ? amount * CLAIM_HIGH_ENCHANTMENT_RATE
    : amount;

const damagePayout = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find((i) => i.type === damage.itemType)!;
  return reimbursableAmount(item, damage.amount) - DEDUCTIBLE;
};

const uncappedPayout = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce((sum, dmg) => sum + damagePayout(dmg, policy), 0);

const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const dmg of damages) {
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount: ${dmg.amount}`);
    }
  }
};

const rejectDamagesAgainstPolicy = (policy: Policy, damages: Damage[]): void => {
  const policyCounts = countByType(policy.items);
  const damageCounts = countBy(damages, (dmg) => dmg.itemType);
  for (const [type, count] of Object.entries(damageCounts)) {
    const insuredCount = policyCounts[type] ?? 0;
    if (insuredCount === 0) {
      throw new Error(`Item type not insured by this policy: ${type}`);
    }
    if (count > insuredCount) {
      throw new Error(`Too many damages for item type: ${type}`);
    }
  }
};

const validateDamages = (policy: Policy, incident: Incident): void => {
  rejectNegativeAmounts(incident.damages);
  rejectDamagesAgainstPolicy(policy, incident.damages);
};

const processClaim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  validateDamages(policy, incident);
  const payout = Math.min(roundPayoutInMHPCOFavor(uncappedPayout(incident, policy)), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const processQuote = (step: QuoteStep, customer: Customer, stepIndex: number): { policy: Policy; premium: number } => {
  validateItems(step.items);
  const policy: Policy = { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER };
  return { policy, premium: quotePremium(step.items, customer, stepIndex) };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const { policy, premium } = processQuote(step, scenario.customer, index);
      policies[index] = policy;
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
