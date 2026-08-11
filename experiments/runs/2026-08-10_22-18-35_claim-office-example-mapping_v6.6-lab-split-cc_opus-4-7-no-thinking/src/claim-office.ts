const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

interface CatalogEntry {
  basePremium: number;
  insuranceValue: number;
}

const CATALOG: Record<string, CatalogEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumOf = (type: string): number => CATALOG[type]?.basePremium ?? 0;
const insuranceValueOf = (type: string): number => CATALOG[type]?.insuranceValue ?? 0;

const sumBy = <T>(items: readonly T[], value: (item: T) => number): number =>
  items.reduce((total, item) => total + value(item), 0);

interface ConditionalRate<T> {
  applies: (subject: T) => boolean;
  rate: number;
}

const sumApplicableRates = <T>(rates: readonly ConditionalRate<T>[], subject: T): number =>
  sumBy(rates, ({ applies, rate }) => (applies(subject) ? rate : 0));

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isCursed = (item: Item): boolean => item.cursed === true;
const hasHighEnchantmentForPremium = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;

const SURCHARGE_RATES: ReadonlyArray<ConditionalRate<Item>> = [
  { applies: isCursed, rate: 0.5 },
  { applies: hasHighEnchantmentForPremium, rate: 0.3 },
];

const itemSurcharge = (item: Item): number =>
  basePremiumOf(item.type) * sumApplicableRates(SURCHARGE_RATES, item);

const itemsSurcharge = (items: Item[]): number => sumBy(items, itemSurcharge);

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
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
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

interface ScenarioResult {
  results: StepResult[];
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE = 60;

const roundUpInMHPCOsFavor = (amount: number): number => Math.ceil(amount);
const roundDownInMHPCOsFavor = (amount: number): number => Math.floor(amount);

const countByKey = <T>(items: readonly T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countItemsByType = (items: Item[]): Map<string, number> =>
  countByKey(items, (item) => item.type);

const isComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

const basePremiumForSameTypeItems = (type: string, count: number): number =>
  isComponentBlock(type, count) ? COMPONENT_BLOCK_BASE : basePremiumOf(type) * count;

const itemsBasePremium = (items: Item[]): number =>
  sumBy([...countItemsByType(items)], ([type, count]) => basePremiumForSameTypeItems(type, count));

const firstInsuranceSurcharge = (base: number): number => base * FIRST_INSURANCE_RATE;

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

interface QuoteContext {
  customer: Customer;
  isFollowUp: boolean;
}

const isLoyalCustomer = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const isFollowUpQuote = ({ isFollowUp }: QuoteContext): boolean => isFollowUp;

const DISCOUNT_RATES: ReadonlyArray<ConditionalRate<QuoteContext>> = [
  { applies: isLoyalCustomer, rate: LOYALTY_DISCOUNT_RATE },
  { applies: isFollowUpQuote, rate: FOLLOW_UP_DISCOUNT_RATE },
];

const totalDiscount = (base: number, context: QuoteContext): number =>
  base * sumApplicableRates(DISCOUNT_RATES, context);

const quotePremium = ({ items }: QuoteStep, context: QuoteContext): number => {
  const base = itemsBasePremium(items);
  const premiumBeforeFee =
    base + itemsSurcharge(items) + firstInsuranceSurcharge(base) - totalDiscount(base, context);
  return roundUpInMHPCOsFavor(premiumBeforeFee + PROCESSING_FEE);
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const totalInsuranceValue = (items: Item[]): number =>
  sumBy(items, (item) => insuranceValueOf(item.type));

const createPolicy = ({ items }: QuoteStep): Policy => ({
  items,
  remainingCap: totalInsuranceValue(items) * CAP_MULTIPLIER,
});

const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const hasHighEnchantmentForClaim = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursementRate = (item: Item): number =>
  hasHighEnchantmentForClaim(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);

const requireItemByType = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((candidate) => candidate.type === itemType);
  if (item === undefined) throw new Error(`Claim references item not in policy: ${itemType}`);
  return item;
};

const payoutForDamage = (damage: Damage, policy: Policy): number =>
  damagePayout(damage, requireItemByType(policy, damage.itemType));

const calculatePayout = (damages: Damage[], policy: Policy): number => {
  const rawPayout = sumBy(damages, (damage) => payoutForDamage(damage, policy));
  return roundDownInMHPCOsFavor(Math.min(rawPayout, policy.remainingCap));
};

const assertNonNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
};

const assertDamageCountsWithinPolicy = (damages: Damage[], policy: Policy): void => {
  const insuredCounts = countItemsByType(policy.items);
  const damageCounts = countByKey(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damages of type ${type} than items insured`);
    }
  }
};

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const { damages } = step.incident;
  const policy = policies[step.policy];
  damages.forEach(assertNonNegativeDamage);
  assertDamageCountsWithinPolicy(damages, policy);
  const payout = calculatePayout(damages, policy);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const assertKnownItemType = (item: Item): void => {
  if (!(item.type in CATALOG)) throw new Error(`Unknown item type: ${item.type}`);
};

const processQuote = (
  step: QuoteStep,
  customer: Customer,
  policies: Policy[],
): QuoteResult => {
  step.items.forEach(assertKnownItemType);
  const context: QuoteContext = { customer, isFollowUp: policies.length > 0 };
  policies.push(createPolicy(step));
  return { premium: quotePremium(step, context) };
};

const processStep = (
  step: Step,
  customer: Customer,
  policies: Policy[],
): StepResult =>
  step.op === "quote"
    ? processQuote(step, customer, policies)
    : processClaim(step, policies);

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results = steps.map((step) => processStep(step, customer, policies));
  return { results };
};
