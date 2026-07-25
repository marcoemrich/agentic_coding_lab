export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ScenarioResult {
  results: StepResult[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const DAMAGE_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const insuranceValueFor = (type: string): number =>
  INSURANCE_VALUE[type] ?? COMPONENT_INSURANCE_VALUE;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM || isComponent(type);

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
};

const countByType = <T>(items: T[], typeOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const type = typeOf(item);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const basePremiumFor = (type: string): number => BASE_PREMIUM[type];

interface SurchargeRule {
  applies: (item: Item) => boolean;
  rate: number;
}

const SURCHARGE_RULES: SurchargeRule[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemSurcharge = (item: Item, base: number): number =>
  SURCHARGE_RULES.filter((rule) => rule.applies(item)).reduce(
    (total, rule) => total + base * rule.rate,
    0
  );

const componentGroupBasePremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

interface ItemPremiums {
  base: number;
  surcharges: number;
}

const sumItemPremiums = (items: Item[]): ItemPremiums => {
  const components = items.filter((item) => isComponent(item.type));
  const mainItems = items.filter((item) => !isComponent(item.type));
  let base = 0;
  let surcharges = 0;
  for (const item of mainItems) {
    const itemBase = basePremiumFor(item.type);
    base += itemBase;
    surcharges += itemSurcharge(item, itemBase);
  }
  const componentCounts = countByType(components, (item) => item.type);
  for (const count of componentCounts.values()) {
    base += componentGroupBasePremium(count);
  }
  return { base, surcharges };
};

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

interface QuoteContext {
  customer: Customer;
  isFollowUp: boolean;
}

interface DiscountRule {
  applies: (context: QuoteContext) => boolean;
  rate: number;
}

const DISCOUNT_RULES: DiscountRule[] = [
  { applies: (context) => isLoyalCustomer(context.customer), rate: LOYALTY_DISCOUNT_RATE },
  { applies: (context) => context.isFollowUp, rate: FOLLOWUP_DISCOUNT_RATE },
];

const totalDiscount = (base: number, context: QuoteContext): number =>
  DISCOUNT_RULES.filter((rule) => rule.applies(context)).reduce(
    (total, rule) => total + base * rule.rate,
    0
  );

// Premiums round up so any fractional Gold falls in MHPCO's favor.
const roundPremiumInMHPCOFavor = (premium: number): number => Math.ceil(premium);

const quotePremium = (items: Item[], context: QuoteContext): number => {
  const { base, surcharges } = sumItemPremiums(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const premium =
    PROCESSING_FEE + base + surcharges + firstInsuranceSurcharge - totalDiscount(base, context);
  return roundPremiumInMHPCOFavor(premium);
};

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= DAMAGE_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);

const reimbursementForDamage = (policy: Policy, damage: Damage): number => {
  const insuredItem = policy.items.find((item) => item.type === damage.itemType)!;
  return reimbursableAmount(damage, insuredItem);
};

const rejectNegativeDamages = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Claim rejected: negative damage amount ${damage.amount}`);
    }
  }
};

const rejectExcessiveDamageCounts = (policy: Policy, incident: Incident): void => {
  const damageCounts = countByType(incident.damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    const insuredCount = policy.items.filter((item) => item.type === type).length;
    if (count > insuredCount) {
      throw new Error(
        `Claim rejected: ${count} damages of type "${type}" but only ${insuredCount} insured`
      );
    }
  }
};

const validateClaim = (policy: Policy, incident: Incident): void => {
  rejectNegativeDamages(incident);
  rejectExcessiveDamageCounts(policy, incident);
};

const processClaim = (policy: Policy, incident: Incident): StepResult => {
  validateClaim(policy, incident);
  const totalReimbursable = incident.damages.reduce(
    (sum, damage) => sum + reimbursementForDamage(policy, damage),
    0
  );
  const payout = Math.floor(Math.min(totalReimbursable, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      policies[index] = createPolicy(step.items);
      return { premium: quotePremium(step.items, { customer: scenario.customer, isFollowUp }) };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
