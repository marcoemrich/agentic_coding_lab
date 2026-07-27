export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResult {
  results: unknown[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

const tally = (keys: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const key of keys) {
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  tally(items.map((item) => item.type));

const componentBlockPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const typePremium = (type: string, count: number): number =>
  isComponent(type) ? componentBlockPremium(count) : count * BASE_PREMIUM[type];

const sumTypePremiums = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + typePremium(type, count),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  isLoyal(customer) ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const itemBasePremium = (item: Item): number => BASE_PREMIUM[item.type];

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

interface SurchargeRule {
  applies: (item: Item) => boolean;
  rate: number;
}

const SURCHARGE_RULES: SurchargeRule[] = [
  { applies: isCursed, rate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_RATE },
];

const itemSurcharge = (item: Item): number =>
  SURCHARGE_RULES.filter((rule) => rule.applies(item)).reduce(
    (sum, rule) => sum + itemBasePremium(item) * rule.rate,
    0,
  );

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const isKnownType = (type: string): boolean => type in BASE_PREMIUM;

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type '${unknown.type}'`);
  }
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  validateItemTypes(step.items);
  const policyBase = sumTypePremiums(step.items);
  const surcharges = sumItemSurcharges(step.items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty = loyaltyDiscount(policyBase, customer);
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return (
    policyBase + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE
  );
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

interface Policy {
  items: Item[];
  cap: number;
}

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const createPolicy = (step: QuoteStep): Policy => ({
  items: step.items,
  cap: insuranceSum(step.items) * CAP_MULTIPLIER,
});

const FULL_REIMBURSEMENT_RATE = 1;

const qualifiesForReducedPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const reimbursementRate = (item: Item): number =>
  qualifiesForReducedPayout(item)
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : FULL_REIMBURSEMENT_RATE;

const findInsuredItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType)!;

const damageReimbursement = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRate(item) - DEDUCTIBLE;

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = tally(damages.map((damage) => damage.itemType));
  for (const [type, damageCount] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `Claim has ${damageCount} '${type}' damages but only ${insuredCount} insured`,
      );
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) {
    throw new Error(`Damage amount cannot be negative: ${negative.amount}`);
  }
};

const processClaim = (
  step: ClaimStep,
  policies: Map<number, Policy>,
): { payout: number; remainingCap: number } => {
  const policy = policies.get(step.policy)!;
  validateDamageAmounts(step.incident.damages);
  validateDamageCounts(policy, step.incident.damages);
  const rawPayout = step.incident.damages.reduce(
    (sum, damage) =>
      sum +
      damageReimbursement(damage, findInsuredItem(policy, damage.itemType)),
    0,
  );
  const payout = Math.min(Math.floor(rawPayout), policy.cap);
  policy.cap -= payout;
  return { payout, remainingCap: policy.cap };
};

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (isQuoteStep(step)) {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies.set(index, createPolicy(step));
      return {
        premium: Math.ceil(quotePremium(step, scenario.customer, isFollowUp)),
      };
    }
    return processClaim(step, policies);
  });
  return { results };
};
