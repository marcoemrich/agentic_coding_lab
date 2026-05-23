const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const MAIN_ITEM_INFO: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Array<Item> };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Array<Damage> };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

type Customer = { yearsWithMHPCO: number };

type Scenario = {
  customer: Customer;
  steps: Array<Step>;
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type Policy = {
  items: Array<Item>;
  insuranceSum: number;
  remainingCap: number;
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownItemType = (type: string): boolean =>
  type in MAIN_ITEM_INFO || COMPONENT_TYPES.has(type);

const validateItems = (items: Array<Item>): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const componentsBasePremium = (components: Array<Item>): number => {
  const countsByType = countByType(components, (c) => c.type);
  let total = 0;
  for (const count of countsByType.values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

const policyBasePremium = (items: Array<Item>): number => {
  const mains = items.filter((i) => !isComponent(i));
  const components = items.filter(isComponent);
  const mainsTotal = mains.reduce((sum, item) => sum + MAIN_ITEM_INFO[item.type].basePremium, 0);
  return mainsTotal + componentsBasePremium(components);
};

const itemSurcharges = (items: Array<Item>): number => {
  let total = 0;
  for (const item of items) {
    if (isComponent(item)) continue;
    const base = MAIN_ITEM_INFO[item.type].basePremium;
    if (item.cursed) total += base * CURSE_SURCHARGE_RATE;
    const enchantment = item.enchantment ?? 0;
    if (enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return total;
};

const insuranceValueOf = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEM_INFO[item.type].insuranceValue;

const insuranceSum = (items: Array<Item>): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const quoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean,
): { result: QuoteResult; policy: Policy } => {
  validateItems(step.items);
  const policyBase = policyBasePremium(step.items);
  const surcharges = itemSurcharges(step.items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUpContract ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  const premium = Math.ceil(
    policyBase +
      surcharges +
      firstInsurance -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
  const sum = insuranceSum(step.items);
  return {
    result: { premium },
    policy: { items: step.items, insuranceSum: sum, remainingCap: sum * CAP_MULTIPLIER },
  };
};

const reimbursementFor = (item: Item, damageAmount: number): number => {
  const enchantment = item.enchantment ?? 0;
  if (enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damageAmount;
};

const countByType = <T>(entries: Array<T>, key: (e: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const type = key(entry);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const validateDamagesAgainstPolicy = (damages: Array<Damage>, policy: Policy): void => {
  const policyCounts = countByType(policy.items, (i) => i.type);
  const damageCounts = countByType(damages, (d) => d.itemType);
  for (const [itemType, count] of damageCounts) {
    const available = policyCounts.get(itemType) ?? 0;
    if (count > available) {
      throw new Error(
        `Claim damages exceed policy coverage for itemType: ${itemType} (claimed ${count}, covered ${available})`,
      );
    }
  }
};

const validateDamages = (damages: Array<Damage>): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

const claimStep = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateDamages(step.incident.damages);
  validateDamagesAgainstPolicy(step.incident.damages, policy);
  let payout = 0;
  for (const damage of step.incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (!item) throw new Error(`Claim references item not in policy: ${damage.itemType}`);
    const reimbursement = reimbursementFor(item, damage.amount);
    const afterDeductible = Math.max(0, reimbursement - DEDUCTIBLE);
    payout += afterDeductible;
  }
  payout = Math.min(payout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Array<StepResult> } => {
  let quoteCount = 0;
  const policies: Array<Policy> = [];
  const results: Array<StepResult> = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const { result, policy } = quoteStep(step, scenario.customer, quoteCount > 0);
      quoteCount++;
      policies[index] = policy;
      return result;
    }
    const policy = policies[step.policy];
    return claimStep(step, policy);
  });
  return { results };
};
