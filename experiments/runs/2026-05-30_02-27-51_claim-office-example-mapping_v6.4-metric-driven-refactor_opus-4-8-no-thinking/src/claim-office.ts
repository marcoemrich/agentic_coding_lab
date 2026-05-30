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

export type Result = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: Result[];
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const COMPONENT_PRICE = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const REIMBURSEMENT_HALF_RATE = 0.5;

const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const FLOAT_PRECISION_DIGITS = 6;

const isKnownItemType = (type: string): boolean => {
  return COMPONENT_TYPES.has(type) || type in BASE_PREMIUM;
};

const assertKnownItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const itemOwnBase = (item: Item): number => {
  return COMPONENT_TYPES.has(item.type)
    ? COMPONENT_PRICE
    : BASE_PREMIUM[item.type];
};

const itemSurcharge = (item: Item): number => {
  const own = itemOwnBase(item);
  const curse = item.cursed ? CURSE_SURCHARGE_RATE * own : 0;
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_RATE * own
      : 0;
  return curse + highEnchantment;
};

const componentBase = (count: number): number => {
  return count === BLOCK_SIZE ? BLOCK_PRICE : count * COMPONENT_PRICE;
};

const countBy = <T>(
  list: T[],
  keyOf: (element: T) => string,
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const element of list) {
    const key = keyOf(element);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const itemBaseTotal = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countBy(items, (item) => item.type)) {
    total += COMPONENT_TYPES.has(type)
      ? componentBase(count)
      : BASE_PREMIUM[type] * count;
  }
  return total;
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  assertKnownItems(step.items);
  const policyBase = itemBaseTotal(step.items);
  const surcharges = step.items.reduce(
    (sum, item) => sum + itemSurcharge(item),
    0,
  );
  const initialAssessment = INITIAL_ASSESSMENT_RATE * policyBase;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
      ? LOYALTY_DISCOUNT_RATE * policyBase
      : 0;
  const followUpDiscount = isFollowUp ? FOLLOWUP_DISCOUNT_RATE * policyBase : 0;
  const premium =
    policyBase +
    surcharges +
    initialAssessment -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;
  return Math.ceil(Number(premium.toFixed(FLOAT_PRECISION_DIGITS)));
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const itemInsuranceValue = (item: Item): number => {
  return COMPONENT_TYPES.has(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : INSURANCE_VALUE[item.type];
};

const insuranceSum = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
};

const reimbursableAmount = (amount: number, item: Item): number => {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? REIMBURSEMENT_HALF_RATE * amount
    : amount;
};

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = items.find((candidate) => candidate.type === damage.itemType);
  return Math.max(0, reimbursableAmount(damage.amount, item!) - DEDUCTIBLE);
};

const assertDamagesCovered = (damages: Damage[], items: Item[]): void => {
  const insured = countBy(items, (item) => item.type);
  for (const [type, count] of countBy(damages, (damage) => damage.itemType)) {
    if (count > (insured.get(type) ?? 0)) {
      throw new Error(`claim references more ${type} damages than insured`);
    }
  }
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
};

const claimResult = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  assertNonNegativeDamages(step.incident.damages);
  assertDamagesCovered(step.incident.damages, policy.items);
  const requested = step.incident.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, policy.items),
    0,
  );
  const payout = Math.min(requested, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  let quotesSeen = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") {
      return claimResult(step, policies);
    }
    const isFollowUp = quotesSeen >= 1;
    quotesSeen += 1;
    const premium = quotePremium(step, scenario.customer, isFollowUp);
    policies[index] = {
      items: step.items,
      remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
    };
    return { premium };
  });
  return { results };
};
