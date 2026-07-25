const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HALF_REIMBURSEMENT = 0.5;
const FULL_REIMBURSEMENT = 1;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
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

interface ScenarioResult {
  results: StepResult[];
}

const componentGroupBase = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;

const countBy = <T>(elements: T[], keyOf: (element: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const element of elements) {
    const key = keyOf(element);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const isMainItemType = (type: string): boolean => type in BASE_PREMIUMS;

const isComponentType = (type: string): boolean => COMPONENT_TYPES.has(type);

const isComponent = (item: Item): boolean => isComponentType(item.type);

const isKnownItemType = (type: string): boolean =>
  isMainItemType(type) || isComponentType(type);

// Throws with `messageFor(element)` for the first element that fails `isValid`.
// Shared by the per-element validators below (item types, damage amounts).
const validateEach = <T>(
  elements: T[],
  isValid: (element: T) => boolean,
  messageFor: (element: T) => string,
): void => {
  for (const element of elements) {
    if (!isValid(element)) {
      throw new Error(messageFor(element));
    }
  }
};

const validateItemTypes = (items: Item[]): void =>
  validateEach(
    items,
    (item) => isKnownItemType(item.type),
    (item) => `unknown item type: ${item.type}`,
  );

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

interface PricedUnit {
  base: number;
  surcharges: number[];
}

// Per-item surcharge rules on a main item, each a fraction of the item base
// applied when its condition holds. New surcharges are added as list entries.
const mainItemSurchargeRules: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  { applies: isHighEnchantment, rate: HIGH_ENCHANTMENT_SURCHARGE },
];

const mainItemUnit = (item: Item): PricedUnit => {
  const base = BASE_PREMIUMS[item.type];
  const surcharges = mainItemSurchargeRules
    .filter((rule) => rule.applies(item))
    .map((rule) => base * rule.rate);
  return { base, surcharges };
};

const componentUnit = (count: number): PricedUnit => ({
  base: componentGroupBase(count),
  surcharges: [],
});

const pricedUnits = (items: Item[]): PricedUnit[] => {
  const mainUnits = items.filter((item) => !isComponent(item)).map(mainItemUnit);

  const components = items.filter(isComponent);
  const componentUnits = [...countByType(components).values()].map(componentUnit);

  return [...mainUnits, ...componentUnits];
};

const unitTotal = (unit: PricedUnit): number =>
  unit.base +
  unit.base * FIRST_INSURANCE_SURCHARGE +
  unit.surcharges.reduce((sum, surcharge) => sum + surcharge, 0);

// Policy-level discount fractions applied to the policy base (sum of unit bases).
// Each entry that applies contributes its fraction; new modifiers (e.g. follow-up
// contract discount) can be added here without touching per-item pricing.
const policyBaseDiscountFractions = (customer: Customer, isFollowUp: boolean): number[] => {
  const fractions: number[] = [];
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) fractions.push(LOYALTY_DISCOUNT);
  if (isFollowUp) fractions.push(FOLLOWUP_CONTRACT_DISCOUNT);
  return fractions;
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const units = pricedUnits(items);
  const itemsTotal = units.reduce((sum, unit) => sum + unitTotal(unit), 0);
  const policyBase = units.reduce((sum, unit) => sum + unit.base, 0);
  const policyDiscount = policyBaseDiscountFractions(customer, isFollowUp).reduce(
    (sum, fraction) => sum + policyBase * fraction,
    0,
  );
  return Math.ceil(itemsTotal - policyDiscount + PROCESSING_FEE);
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

// Fraction of a damage amount the policy reimburses, before the deductible.
// Coverage clauses (e.g. dragon-material full reimbursement) will add branches here.
const reimbursementRate = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HALF_REIMBURSEMENT
    : FULL_REIMBURSEMENT;

const reimbursedAmount = (item: Item | undefined, amount: number): number =>
  amount * reimbursementRate(item);

const damagePayout = (policy: Policy, damage: Damage): number => {
  const item = policy.items.find((candidate) => candidate.type === damage.itemType);
  return reimbursedAmount(item, damage.amount) - DEDUCTIBLE;
};

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insured = countByType(policy.items);
  const damaged = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, count] of damaged) {
    if (count > (insured.get(itemType) ?? 0)) {
      throw new Error(`claim damages more ${itemType} than insured`);
    }
  }
};

const desiredPayout = (policy: Policy, damages: Damage[]): number =>
  damages.reduce((sum, damage) => sum + damagePayout(policy, damage), 0);

const validateDamageAmounts = (damages: Damage[]): void =>
  validateEach(
    damages,
    (damage) => damage.amount >= 0,
    (damage) => `negative damage amount: ${damage.amount}`,
  );

const processClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  validateDamageAmounts(damages);
  validateDamageCounts(policy, damages);
  const settledPayout = Math.floor(desiredPayout(policy, damages));
  const payout = Math.min(settledPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  let quoteCount = 0;

  const handleQuote = (step: QuoteStep): QuoteResult => {
    validateItemTypes(step.items);
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    policies.push(createPolicy(step.items));
    return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
  };

  const handleClaim = (step: ClaimStep): ClaimResult =>
    processClaim(policies[step.policy], step.incident.damages);

  const results = scenario.steps.map((step): StepResult =>
    step.op === "quote" ? handleQuote(step) : handleClaim(step),
  );
  return { results };
};
