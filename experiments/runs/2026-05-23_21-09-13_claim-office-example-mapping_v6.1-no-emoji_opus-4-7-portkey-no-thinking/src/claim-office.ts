const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type ItemTypeSpec = { basePremium: number; insuranceValue: number; isComponent: boolean };

const ITEM_TYPES: Record<string, ItemTypeSpec> = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

const basePremiumFor = (item: Item): number => ITEM_TYPES[item.type].basePremium;
const insuranceValueFor = (item: Item): number => ITEM_TYPES[item.type].insuranceValue;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const premiumForTypeCount = (type: string, count: number): number => {
  const spec = ITEM_TYPES[type];
  return spec.isComponent && count === BLOCK_SIZE
    ? BLOCK_PREMIUM
    : count * spec.basePremium;
};

const basePremiumOf = (items: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += premiumForTypeCount(type, count);
  }
  return total;
};

type SurchargeRule = { applies: (item: Item) => boolean; rate: number };

const SURCHARGE_RULES: SurchargeRule[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  { applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const surchargeRateFor = (item: Item): number =>
  SURCHARGE_RULES.reduce((rate, rule) => rate + (rule.applies(item) ? rule.rate : 0), 0);

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item) * surchargeRateFor(item), 0);

const loyaltyDiscountFor = (basePremium: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const followUpDiscountFor = (basePremium: number, stepIndex: number): number =>
  stepIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const quoteForStep = ({ items }: QuoteStep, customer: Customer, stepIndex: number) => {
  const basePremium = basePremiumOf(items);
  const itemSurcharges = itemSurchargesOf(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = loyaltyDiscountFor(basePremium, customer);
  const followUpDiscount = followUpDiscountFor(basePremium, stepIndex);
  return {
    premium: Math.ceil(
      basePremium + itemSurcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
    ),
  };
};

type Policy = { items: Item[]; remainingCap: number };

const policyFor = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueFor(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const insuredItemFor = (policy: Policy, damage: Damage): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

const payoutForDamage = (policy: Policy, damage: Damage): number => {
  const item = insuredItemFor(policy, damage);
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
};

const validateDamage = (policy: Policy, damage: Damage): void => {
  if (!policy.items.some((item) => item.type === damage.itemType)) {
    throw new Error(`Damaged item not insured: ${damage.itemType}`);
  }
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
};

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Too many damages for: ${type}`);
    }
  }
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  damages.forEach((damage) => validateDamage(policy, damage));
  validateDamageCounts(policy, damages);
};

const claimForStep = (step: ClaimStep, policies: Map<number, Policy>) => {
  const policy = policies.get(step.policy)!;
  validateDamages(policy, step.incident.damages);
  const desiredPayout = step.incident.damages.reduce((sum, dmg) => sum + payoutForDamage(policy, dmg), 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_TYPES)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export const runScenario = (scenario: Scenario): unknown => {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, i) => {
    if (step.op === "quote") {
      validateItems(step.items);
      policies.set(i, policyFor(step.items));
      return quoteForStep(step, scenario.customer, i);
    }
    return claimForStep(step, policies);
  });
  return { results };
};
