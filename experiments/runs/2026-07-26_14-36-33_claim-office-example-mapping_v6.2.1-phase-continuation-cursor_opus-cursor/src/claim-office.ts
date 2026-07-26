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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResult {
  results: unknown[];
}

const PROCESSING_FEE = 5;

const EPSILON = 1e-9;

const roundUpFavor = (amount: number): number => Math.ceil(amount - EPSILON);
const roundDownFavor = (amount: number): number => Math.floor(amount + EPSILON);

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_MIN = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;

const itemInsuranceValue = (item: Item): number => {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEM_INSURANCE_VALUE[item.type];
};

const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const componentGroupBasePremium = (count: number): number => {
  if (count === 3) return 60;
  return count * 25;
};

const itemBasePremiums = (items: Item[]): number[] => {
  const premiums: number[] = [];
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      premiums.push(MAIN_ITEM_BASE_PREMIUM[item.type]);
    }
  }
  for (const count of componentCounts.values()) {
    premiums.push(componentGroupBasePremium(count));
  }
  return premiums;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_MIN = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const isKnownType = (type: string): boolean =>
  COMPONENT_TYPES.has(type) || type in MAIN_ITEM_BASE_PREMIUM;

const singleItemBasePremium = (item: Item): number => {
  if (COMPONENT_TYPES.has(item.type)) return 25;
  return MAIN_ITEM_BASE_PREMIUM[item.type];
};

const itemSurcharge = (item: Item): number => {
  const base = singleItemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN)
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return surcharge;
};

const quote = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): { premium: number } => {
  for (const item of step.items) {
    if (!isKnownType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const policyBase = itemBasePremiums(step.items).reduce((a, b) => a + b, 0);
  const surcharges = step.items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUp ? policyBase * FOLLOWUP_DISCOUNT_RATE : 0;
  const total = policyBase + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE;
  return { premium: roundUpFavor(total) };
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const claimPayout = (damage: Damage, item: Item): number => {
  let reimbursed = damage.amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_MIN)
    reimbursed = damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return roundDownFavor(reimbursed - DEDUCTIBLE);
};

const claim = (step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } => {
  const remainingItems = [...policy.items];
  const payout = step.incident.damages.reduce((sum, d) => {
    if (d.amount < 0) throw new Error(`Negative damage amount: ${d.amount}`);
    const index = remainingItems.findIndex((i) => i.type === d.itemType);
    if (index === -1) throw new Error(`Damaged item not covered by policy: ${d.itemType}`);
    const [item] = remainingItems.splice(index, 1);
    return sum + claimPayout(d, item);
  }, 0);
  const cappedPayout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const insuranceSum = step.items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
      policies[index] = { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER };
      return quote(step, scenario.customer, isFollowUp);
    }
    const policy = policies[step.policy];
    return claim(step, policy);
  });
  return { results };
};
