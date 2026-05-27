const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
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

export interface ScenarioResult {
  results: StepResult[];
}

interface ItemTypeInfo {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_CATALOG: Record<string, ItemTypeInfo> = {
  sword:     { basePremium: 100, insuranceValue: 1000 },
  amulet:    { basePremium:  60, insuranceValue:  600 },
  staff:     { basePremium:  80, insuranceValue:  800 },
  potion:    { basePremium:  40, insuranceValue:  400 },
  rune:      { basePremium:  25, insuranceValue:  250 },
  moonstone: { basePremium:  25, insuranceValue:  250 },
};

const basePremium = (item: Item): number => ITEM_CATALOG[item.type]?.basePremium ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const qualifiesForBlockDiscount = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const groupPremium = (type: string, count: number): number =>
  qualifiesForBlockDiscount(type, count) ? BLOCK_PREMIUM : count * basePremium({ type });

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const sumBasePremiums = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countItemsByType(items)) {
    total += groupPremium(type, count);
  }
  return total;
};

const CURSE_SURCHARGE_RATE = 0.5;
const PREMIUM_SURCHARGE_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const triggersPremiumEnchantmentSurcharge = (item: Item): boolean =>
  (item.enchantment ?? 0) >= PREMIUM_SURCHARGE_ENCHANTMENT_THRESHOLD;

const curseSurcharge = (item: Item): number =>
  item.cursed ? basePremium(item) * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurcharge = (item: Item): number =>
  triggersPremiumEnchantmentSurcharge(item) ? basePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;

const itemSurcharges = (item: Item): number =>
  curseSurcharge(item) + highEnchantmentSurcharge(item);

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const firstInsuranceSurcharge = (basePremiumTotal: number): number =>
  basePremiumTotal * FIRST_INSURANCE_RATE;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyDiscount = (customer: Customer, basePremiumTotal: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremiumTotal * LOYALTY_DISCOUNT_RATE
    : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscount = (basePremiumTotal: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremiumTotal * FOLLOW_UP_DISCOUNT_RATE : 0;

const quote = (
  { items }: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => {
  const base = sumBasePremiums(items);
  const rawPremium =
    base +
    sumItemSurcharges(items) +
    firstInsuranceSurcharge(base) -
    loyaltyDiscount(customer, base) -
    followUpDiscount(base, isFollowUp) +
    PROCESSING_FEE;
  return { premium: Math.ceil(rawPremium) };
};

const DEDUCTIBLE = 100;

const insuranceValue = (item: Item): number => ITEM_CATALOG[item.type]?.insuranceValue ?? 0;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValue(item), 0);

const CAP_MULTIPLIER = 2;

interface Policy {
  items: Item[];
  cap: number;
  remainingCap: number;
}

const createPolicy = (items: Item[]): Policy => {
  const cap = insuranceSum(items) * CAP_MULTIPLIER;
  return { items, cap, remainingCap: cap };
};

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;

const triggersHighEnchantmentReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD;

const reimbursementRate = (item: Item): number =>
  triggersHighEnchantmentReimbursement(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursed = damage.amount * reimbursementRate(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const findItemForDamage = (policy: Policy, damage: Damage): Item | undefined =>
  policy.items.find((i) => i.type === damage.itemType);

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const dmg of damages) {
    if (dmg.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${dmg.amount}`);
    }
  }
};

const validateDamageCountsAgainstPolicy = (damages: Damage[], policy: Policy): void => {
  const policyCounts = countItemsByType(policy.items);
  const damageCounts = countDamagesByType(damages);
  for (const [type, damageCount] of damageCounts) {
    const policyCount = policyCounts.get(type) ?? 0;
    if (damageCount > policyCount) {
      throw new Error(
        `Claim has ${damageCount} damage entries for '${type}' but policy covers only ${policyCount}`,
      );
    }
  }
};

const sumDamagePayouts = (damages: Damage[], policy: Policy): number =>
  damages.reduce((sum, dmg) => sum + damagePayout(dmg, findItemForDamage(policy, dmg)!), 0);

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  const { damages } = step.incident;
  validateDamageAmounts(damages);
  validateDamageCountsAgainstPolicy(damages, policy);
  const payout = Math.floor(Math.min(sumDamagePayouts(damages, policy), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_CATALOG)) {
      throw new Error(`Unknown item type: '${item.type}'`);
    }
  }
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policyByStepIndex = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const isFollowUp = policyByStepIndex.size > 0;
      policyByStepIndex.set(index, createPolicy(step.items));
      return quote(step, scenario.customer, isFollowUp);
    }
    return processClaim(step, policyByStepIndex.get(step.policy)!);
  });
  return { results };
};
