interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface Policy {
  items: Item[];
  cap: number;
  remainingCap: number;
}

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE = 60;

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const componentGroupBase = (count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_BASE;
  return count * COMPONENT_BASE;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const mainItems = (items: Item[]): Item[] => items.filter((item) => !isComponent(item));

const sumMainItems = (items: Item[]): number =>
  mainItems(items).reduce((total, item) => total + MAIN_ITEM_BASE[item.type], 0);

const countByKey = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const countByType = (items: Item[]): Record<string, number> =>
  countByKey(items, (item) => item.type);

const sumComponentGroups = (items: Item[]): number => {
  const counts = countByType(items.filter(isComponent));
  return Object.values(counts).reduce((total, count) => total + componentGroupBase(count), 0);
};

const policyBasePremium = (items: Item[]): number =>
  sumMainItems(items) + sumComponentGroups(items);

const cursedSurcharge = (item: Item): number => {
  const base = MAIN_ITEM_BASE[item.type];
  return item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
};

const highEnchantmentSurcharge = (item: Item): number => {
  const base = MAIN_ITEM_BASE[item.type];
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
};

const itemSurcharges = (items: Item[]): number =>
  mainItems(items).reduce(
    (total, item) => total + cursedSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );

const loyaltyDiscount = (base: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  isFollowUp ? base * FOLLOWUP_DISCOUNT_RATE : 0;

const adjustedPremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const base = policyBasePremium(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE_RATE;
  return (
    base +
    firstInsuranceSurcharge -
    loyaltyDiscount(base, customer) -
    followUpDiscount(base, isFollowUp) +
    itemSurcharges(items)
  );
};

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number =>
  Math.ceil(adjustedPremium(step.items, customer, isFollowUp)) + PROCESSING_FEE;

const itemInsuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEM_INSURANCE_VALUE[item.type];

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + itemInsuranceValue(item), 0);

const reimbursedAmount = (amount: number, item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : amount;

const damagePayout = (damage: Damage, item: Item | undefined): number =>
  Math.max(0, reimbursedAmount(damage.amount, item) - DEDUCTIBLE);

const insuredItemFor = (policy: Policy, damage: Damage): Item | undefined =>
  policy.items.find((item) => item.type === damage.itemType);

const requestedPayout = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce(
    (total, damage) => total + damagePayout(damage, insuredItemFor(policy, damage)),
    0,
  );

const rejectFirstInvalid = <T>(
  items: T[],
  isValid: (item: T) => boolean,
  messageFor: (item: T) => string,
): void => {
  const invalid = items.find((item) => !isValid(item));
  if (invalid) {
    throw new Error(messageFor(invalid));
  }
};

const damageCountByType = (damages: Damage[]): Record<string, number> =>
  countByKey(damages, (damage) => damage.itemType);

const validateDamages = (incident: Incident, policy: Policy): void => {
  rejectFirstInvalid(
    incident.damages,
    (damage) => damage.amount >= 0,
    (damage) => `Damage amount cannot be negative: ${damage.amount}`,
  );
  rejectFirstInvalid(
    incident.damages,
    (damage) => insuredItemFor(policy, damage) !== undefined,
    (damage) => `Claim references item not in policy: ${damage.itemType}`,
  );
  const insuredCounts = countByType(policy.items);
  const damageCounts = damageCountByType(incident.damages);
  rejectFirstInvalid(
    incident.damages,
    (damage) => damageCounts[damage.itemType] <= (insuredCounts[damage.itemType] ?? 0),
    (damage) => `More damages than insured items of type: ${damage.itemType}`,
  );
};

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateDamages(step.incident, policy);
  const requested = requestedPayout(step.incident, policy);
  const payout = Math.floor(Math.min(requested, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const isKnownItemType = (item: Item): boolean =>
  item.type in MAIN_ITEM_BASE || isComponent(item);

const validateItems = (items: Item[]): void =>
  rejectFirstInvalid(
    items,
    isKnownItemType,
    (item) => `Unknown item type: ${item.type}`,
  );

const openPolicy = (step: QuoteStep): Policy => {
  validateItems(step.items);
  const cap = insuranceSum(step.items) * CAP_MULTIPLIER;
  return { items: step.items, cap, remainingCap: cap };
};

const processQuote = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => ({ premium: quotePremium(step, customer, isFollowUp) });

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "claim") {
      return processClaim(step, policies[step.policy]);
    }
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    policies[index] = openPolicy(step);
    return processQuote(step, scenario.customer, isFollowUp);
  });
  return { results };
};
