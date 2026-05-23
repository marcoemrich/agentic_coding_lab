const PROCESSING_FEE = 5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUM_BY_TYPE));

const countByType = <T extends { type?: string }>(
  values: T[],
  typeOf: (value: T) => string,
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = typeOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const itemBase = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const itemSurcharges = (item: Item): number => {
  const base = itemBase(item);
  let s = 0;
  if (item.cursed) s += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    s += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  s += base * FIRST_INSURANCE_RATE;
  return s;
};

const componentBlockBase = (items: Item[]): number => {
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const counts = countByType(components, (item) => item.type);
  let total = 0;
  for (const [type, count] of counts.entries()) {
    if (count === BLOCK_SIZE) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * itemBase({ type });
    }
  }
  return total;
};

const mainItemsOf = (items: Item[]): Item[] =>
  items.filter((item) => !COMPONENT_TYPES.has(item.type));

const policyBase = (items: Item[]): number => {
  const mainBase = mainItemsOf(items).reduce((sum, item) => sum + itemBase(item), 0);
  return mainBase + componentBlockBase(items);
};

const itemSurchargeTotal = (items: Item[]): number =>
  mainItemsOf(items).reduce((sum, item) => sum + itemSurcharges(item), 0);

const quotePremium = (items: Item[], customer: Customer, priorQuotes: number): number => {
  const policyBaseAmount = policyBase(items);
  const surcharges = itemSurchargeTotal(items);
  let policyAdjustment = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    policyAdjustment -= policyBaseAmount * LOYALTY_DISCOUNT_RATE;
  }
  if (priorQuotes >= 1) {
    policyAdjustment -= policyBaseAmount * FOLLOWUP_DISCOUNT_RATE;
  }
  const total = policyBaseAmount + surcharges + policyAdjustment + PROCESSING_FEE;
  return Math.ceil(total);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUE_BY_TYPE[item.type] ?? 0), 0);

type Policy = { items: Item[]; capRemaining: number };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damageAmount;
};

const findInsuredItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType)!;

const damagePayout = (policy: Policy, damage: Damage): number => {
  const item = findInsuredItem(policy, damage.itemType);
  return Math.max(0, reimbursableAmount(item, damage.amount) - DEDUCTIBLE);
};

const validateDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative: ${damage.amount}`);
    }
  }
};

const validateDamagesAgainstPolicy = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items, (item) => item.type);
  const damageCounts = countByType(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts.entries()) {
    const insured = insuredCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(
        `claim references ${count} ${type}(s) but policy only insures ${insured}`,
      );
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamages(incident.damages);
  validateDamagesAgainstPolicy(policy, incident.damages);
  const claimedAmount = incident.damages
    .map((damage) => damagePayout(policy, damage))
    .reduce((sum, amount) => sum + amount, 0);
  const payout = Math.floor(Math.min(claimedAmount, policy.capRemaining));
  policy.capRemaining -= payout;
  return { payout, remainingCap: policy.capRemaining };
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  capRemaining: insuranceSum(items) * CAP_MULTIPLIER,
});

export const runScenario = (input: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  let quoteCount = 0;
  const handleStep = (step: Step): StepResult => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const premium = quotePremium(step.items, input.customer, quoteCount);
      quoteCount++;
      policies.push(openPolicy(step.items));
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident);
  };
  return { results: input.steps.map(handleStep) };
};
