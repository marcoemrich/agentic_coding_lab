const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

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

const lookupByItemType = (table: Record<string, number>, type: string): number => {
  const value = table[type];
  if (value === undefined) throw new Error(`Unknown item type: ${type}`);
  return value;
};

const lookupBasePremium = (type: string): number => lookupByItemType(BASE_PREMIUMS, type);

const itemBasePremium = (item: Item): number => lookupBasePremium(item.type);

const groupBasePremium = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return count * lookupBasePremium(type);
};

const countBy = <T>(values: T[], keyOf: (value: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = keyOf(value);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const itemsBasePremium = (items: Item[]): number =>
  Object.entries(countBy(items, (item) => item.type)).reduce(
    (sum, [type, count]) => sum + groupBasePremium(type, count),
    0,
  );

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const triggersHighEnchantmentSurcharge = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;

const triggersHighEnchantmentPayoutReduction = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = triggersHighEnchantmentSurcharge(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const itemsSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const withFirstInsurance = (basePremium: number): number =>
  basePremium + basePremium * FIRST_INSURANCE_RATE;

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const isFollowUpQuote = (quoteIndex: number): boolean => quoteIndex > 0;

const policyDiscounts = (basePremium: number, customer: Customer, quoteIndex: number): number => {
  const loyalty = isLoyalCustomer(customer) ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUpQuote(quoteIndex) ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return loyalty + followUp;
};

const itemInsuranceValue = (item: Item): number =>
  lookupByItemType(INSURANCE_VALUES, item.type);

const itemsInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = itemsInsuranceSum(items);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const quotePremium = (step: QuoteStep, customer: Customer, quoteIndex: number): number => {
  const basePremium = itemsBasePremium(step.items);
  const surcharges = itemsSurcharges(step.items);
  const discount = policyDiscounts(basePremium, customer, quoteIndex);
  return Math.ceil(withFirstInsurance(basePremium) + surcharges - discount + PROCESSING_FEE);
};

const reimbursedAmount = (damage: Damage, item: Item): number =>
  triggersHighEnchantmentPayoutReduction(item)
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursedAmount(damage, item) - DEDUCTIBLE_PER_DAMAGE);

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) throw new Error(`No insured item of type ${itemType}`);
  return item;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const validateDamageCountsWithinPolicy = (damages: Damage[], policy: Policy): void => {
  const insuredCounts = countBy(policy.items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      throw new Error(`More ${type} damages than insured`);
    }
  }
};

const validateDamages = (damages: Damage[], policy: Policy): void => {
  validateDamageAmounts(damages);
  validateDamageCountsWithinPolicy(damages, policy);
};

const claimResult = (
  step: ClaimStep,
  policies: Map<number, Policy>,
): { payout: number; remainingCap: number } => {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`No policy at index ${step.policy}`);
  validateDamages(step.incident.damages, policy);
  const desired = step.incident.damages.reduce(
    (sum, d) => sum + damagePayout(d, findInsuredItem(policy, d.itemType)),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step, scenario.customer, quoteIndex);
      policies.set(index, createPolicy(step.items));
      quoteIndex++;
      return { premium };
    }
    return claimResult(step, policies);
  });
  return { results };
};
