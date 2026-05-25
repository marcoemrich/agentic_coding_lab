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

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

interface ItemPricing {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_PRICING: Record<string, ItemPricing> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const pricingFor = (type: string): ItemPricing =>
  ITEM_PRICING[type] ?? { basePremium: 0, insuranceValue: 0 };

export const isKnownItemType = (type: string): boolean => type in ITEM_PRICING;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRate = (item: Item): number =>
  (isCursed(item) ? CURSED_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemBaseValue = (item: Item): number => pricingFor(item.type).basePremium;

const itemSurcharge = (item: Item): number =>
  itemBaseValue(item) * surchargeRate(item);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const sumBy = <T>(values: T[], measure: (value: T) => number): number =>
  values.reduce((sum, value) => sum + measure(value), 0);

const groupByType = (items: Item[]): Item[][] => {
  const byType = new Map<string, Item[]>();
  for (const item of items) {
    const group = byType.get(item.type) ?? [];
    group.push(item);
    byType.set(item.type, group);
  }
  return [...byType.values()];
};

const groupPremium = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_PREMIUM : sumBy(group, itemBaseValue);

const partition = <T>(values: T[], predicate: (value: T) => boolean): [T[], T[]] => {
  const matches: T[] = [];
  const rest: T[] = [];
  for (const value of values) {
    (predicate(value) ? matches : rest).push(value);
  }
  return [matches, rest];
};

const policyBasePremium = (items: Item[]): number => {
  const [components, mainItems] = partition(items, isComponent);
  return sumBy(groupByType(components), groupPremium) + sumBy(mainItems, itemBaseValue);
};

const totalSurcharges = (items: Item[]): number => sumBy(items, itemSurcharge);

const loyaltyRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;

const followUpRate = (isFollowUp: boolean): number =>
  isFollowUp ? FOLLOW_UP_DISCOUNT_RATE : 0;

const netPolicyRate = (customer: Customer, isFollowUp: boolean): number =>
  FIRST_INSURANCE_RATE - loyaltyRate(customer) - followUpRate(isFollowUp);

const quotePremium = (customer: Customer, items: Item[], isFollowUp: boolean): number => {
  const base = policyBasePremium(items);
  const surcharges = totalSurcharges(items);
  const policyAdjustment = base * netPolicyRate(customer, isFollowUp);
  return Math.ceil(base + surcharges + policyAdjustment + PROCESSING_FEE);
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceSum = (items: Item[]): number =>
  sumBy(items, (item) => pricingFor(item.type).insuranceValue);

const newPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const triggersHalfReimbursement = (item: Item | undefined): boolean =>
  item !== undefined && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD;

const reimbursementAmount = (item: Item | undefined, damageAmount: number): number =>
  triggersHalfReimbursement(item)
    ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damageAmount;

const insuredItemFor = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const damagePayout = (policy: Policy, damage: Damage): number => {
  const insuredItem = insuredItemFor(policy, damage.itemType);
  return reimbursementAmount(insuredItem, damage.amount) - DEDUCTIBLE;
};

const countByKey = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const validateDamagesCoveredByPolicy = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByKey(policy.items, (item) => item.type);
  const damageCounts = countByKey(damages, (damage) => damage.itemType);
  for (const [type, damagedCount] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (insuredCount === 0) {
      throw new Error(`claim references item type '${type}' which is not in the policy`);
    }
    if (damagedCount > insuredCount) {
      throw new Error(`damages for type '${type}' exceed insured count (${damagedCount} > ${insuredCount})`);
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateDamagesCoveredByPolicy(policy, incident.damages);
  const totalDamagePayout = sumBy(incident.damages, (damage) => damagePayout(policy, damage));
  const payout = Math.min(Math.floor(totalDamagePayout), policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};

const handleQuote = (
  customer: Customer,
  step: QuoteStep,
  index: number,
  policies: Map<number, Policy>,
): QuoteResult => {
  const isFollowUp = policies.size > 0;
  policies.set(index, newPolicy(step.items));
  return { premium: quotePremium(customer, step.items, isFollowUp) };
};

const handleClaim = (step: ClaimStep, policies: Map<number, Policy>): ClaimResult => {
  const policy = policies.get(step.policy)!;
  const result = processClaim(policy, step.incident);
  policies.set(step.policy, { ...policy, remainingCap: result.remainingCap });
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult =>
    step.op === "quote"
      ? handleQuote(scenario.customer, step, index, policies)
      : handleClaim(step, policies),
  );
  return { results };
};
