export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

export interface StepResult {
  premium?: number;
  payout?: number;
  remainingCap?: number;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "claim") {
      results.push(processClaim(step, policies));
      continue;
    }
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    const items = step.items ?? [];
    validateItems(items);
    results.push(quotePremiumForStep(step, scenario.customer, isFollowUp));
    policies[results.length - 1] = createPolicy(items);
  }
  return { results };
};

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = sumBy(items, insuranceValueForItem);
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  };
};

const processClaim = (step: Step, policies: Policy[]): StepResult => {
  const policy = policies[step.policy!];
  const damages = step.incident!.damages;
  validateDamages(damages, policy);
  const rawPayout = sumBy(damages, (damage) =>
    payoutForDamage(damage, findInsuredItem(damage, policy))
  );
  const payout = Math.min(
    Math.floor(roundCents(rawPayout)),
    policy.remainingCap
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const validateDamages = (damages: Damage[], policy: Policy): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
  const insuredCounts = countByType(policy.items.map((item) => item.type));
  const damageCounts = countByType(damages.map((damage) => damage.itemType));
  for (const [type, count] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (count > insuredCount) {
      throw new Error(
        `Claim rejected: ${count} ${type} damages but only ${insuredCount} insured`
      );
    }
  }
};

const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const findInsuredItem = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const reimbursementRateForItem = (item: Item): number =>
  (item.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, item: Item): number => {
  const reimbursed = damage.amount * reimbursementRateForItem(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;

const insuranceValueForItem = (item: Item): number =>
  isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : INSURANCE_VALUE_BY_TYPE[item.type];

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const quotePremiumForStep = (
  step: Step,
  customer: Customer,
  isFollowUp: boolean
): StepResult => {
  const items = step.items ?? [];
  const basePremium = basePremiumForItems(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = isLoyalCustomer(customer)
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const itemSurcharges = sumBy(items, itemSurcharge);
  const modifiedPremium =
    basePremium +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    itemSurcharges;
  const premium = Math.ceil(roundCents(modifiedPremium)) + PROCESSING_FEE;
  return { premium };
};

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const sumBy = <T>(items: T[], value: (item: T) => number): number =>
  items.reduce((sum, item) => sum + value(item), 0);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharge = (item: Item): number => {
  const surchargeRate =
    (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RATE : 0);
  return itemInsuredBasePremium(item) * surchargeRate;
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemInsuredBasePremium = (item: Item): number =>
  isComponent(item) ? COMPONENT_UNIT_PREMIUM : basePremiumForItem(item);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_UNIT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const basePremiumForItems = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  const mainTotal = sumBy(mainItems, basePremiumForItem);
  return mainTotal + componentsBasePremium(components);
};

const componentsBasePremium = (components: Item[]): number => {
  const countByType = countComponentsByType(components);
  return sumBy([...countByType.values()], componentGroupPremium);
};

const countComponentsByType = (components: Item[]): Map<string, number> =>
  countByType(components.map((component) => component.type));

const componentGroupPremium = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_UNIT_PREMIUM;
};

const roundCents = (n: number): number => Math.round(n * 100) / 100;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const basePremiumForItem = (item: Item): number =>
  BASE_PREMIUM_BY_TYPE[item.type];
