export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteInput {
  customer: Customer;
  items: Item[];
}

export interface QuoteContext {
  isFollowUp?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const DAMAGE_REIMBURSEMENT_RATE = 0.5;

const CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;

const COMPONENT_TYPES = ["rune", "moonstone"];

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_UNIT_PREMIUM,
  moonstone: COMPONENT_UNIT_PREMIUM,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const lookupByType = (table: Record<string, number>, item: Item): number =>
  table[item.type] ?? 0;

const insuranceValueFor = (item: Item): number =>
  lookupByType(INSURANCE_VALUES, item);

const insuranceSum = (items: Item[]): number =>
  sumOver(items, insuranceValueFor);

const policyCap = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);

export const buildPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: policyCap(items),
});

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const isMainItem = (item: Item): boolean => !isComponent(item);

const unitPriceFor = (item: Item): number =>
  lookupByType(BASE_PREMIUMS, item);

const sumOver = (items: Item[], valueOf: (item: Item) => number): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0);

const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_UNIT_PREMIUM;

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce((counts, value) => {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const componentsBasePremium = (items: Item[]): number =>
  [...countByType(items.filter(isComponent)).values()].reduce(
    (sum, count) => sum + componentGroupPremium(count),
    0
  );

const mainItemsBasePremium = (items: Item[]): number =>
  sumOver(items.filter(isMainItem), unitPriceFor);

const totalBasePremium = (items: Item[]): number =>
  mainItemsBasePremium(items) + componentsBasePremium(items);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0);

const itemSurcharges = (item: Item): number =>
  unitPriceFor(item) * itemSurchargeRate(item);

const totalSurcharges = (items: Item[]): number =>
  sumOver(items, itemSurcharges);

const firstInsuranceSurcharge = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_RATE;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS;

const policyBaseShareWhen = (
  policyBase: number,
  applies: boolean,
  rate: number
): number => (applies ? policyBase * rate : 0);

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  policyBaseShareWhen(policyBase, isLoyal(customer), LOYALTY_RATE);

const followUpDiscount = (policyBase: number, isFollowUp: boolean): number =>
  policyBaseShareWhen(policyBase, isFollowUp, FOLLOW_UP_RATE);

const policyWideAdjustment = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean
): number =>
  firstInsuranceSurcharge(policyBase) -
  loyaltyDiscount(policyBase, customer) -
  followUpDiscount(policyBase, isFollowUp);

const roundPremiumInMHPCOsFavor = (premium: number): number =>
  Math.ceil(premium);

const isKnownType = (item: Item): boolean => item.type in BASE_PREMIUMS;

const firstUnknownItem = (items: Item[]): Item | undefined =>
  items.find((item) => !isKnownType(item));

const assertKnownItems = (items: Item[]): void => {
  const unknown = firstUnknownItem(items);
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

export const quote = (input: QuoteInput, context: QuoteContext = {}): number => {
  assertKnownItems(input.items);
  const policyBase = totalBasePremium(input.items);
  const premiumBeforeFee =
    policyBase +
    totalSurcharges(input.items) +
    policyWideAdjustment(policyBase, input.customer, context.isFollowUp ?? false);
  return roundPremiumInMHPCOsFavor(premiumBeforeFee + PROCESSING_FEE);
};

const qualifiesForReducedReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const reimbursedAmount = (item: Item, amount: number): number =>
  qualifiesForReducedReimbursement(item)
    ? amount * DAMAGE_REIMBURSEMENT_RATE
    : amount;

const damagePayout = (item: Item, damage: Damage): number =>
  Math.max(0, reimbursedAmount(item, damage.amount) - DEDUCTIBLE);

const damagedItem = (items: Item[], damage: Damage): Item | undefined =>
  items.find((item) => item.type === damage.itemType);

const totalPayout = (policy: Policy, damages: Damage[]): number =>
  damages.reduce((sum, damage) => {
    const item = damagedItem(policy.items, damage);
    return sum + (item ? damagePayout(item, damage) : 0);
  }, 0);

const roundPayoutInMHPCOsFavor = (payout: number): number => Math.floor(payout);

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const assertValidIncident = (policy: Policy, incident: Incident): void => {
  if (incident.damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
  const insuredCounts = countByType(policy.items);
  for (const [itemType, damageCount] of countDamagesByType(incident.damages)) {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`Damage exceeds insured ${itemType} items`);
    }
  }
};

export const claim = (policy: Policy, incident: Incident): ClaimResult => {
  assertValidIncident(policy, incident);
  const desiredPayout = totalPayout(policy, incident.damages);
  const payout = roundPayoutInMHPCOsFavor(
    Math.min(desiredPayout, policy.remainingCap)
  );
  return { payout, remainingCap: policy.remainingCap - payout };
};

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export type StepResult = { premium: number } | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

export const processScenario = (scenario: Scenario): ScenarioOutput => {
  const policies: Record<number, Policy> = {};
  const results: StepResult[] = [];
  let quoteCount = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const premium = quote(
        { customer: scenario.customer, items: step.items },
        { isFollowUp }
      );
      policies[index] = buildPolicy(step.items);
      results.push({ premium });
      return;
    }

    const policy = policies[step.policy];
    if (!policy) {
      throw new Error(`No policy at step index ${step.policy}`);
    }
    const result = claim(policy, step.incident);
    policies[step.policy] = { ...policy, remainingCap: result.remainingCap };
    results.push(result);
  });

  return { results };
};
