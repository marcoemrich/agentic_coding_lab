const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const QUOTE_HIGH_ENCH_THRESHOLD = 5;
const QUOTE_HIGH_ENCH_RATE = 0.3;
const CLAIM_HIGH_ENCH_THRESHOLD = 8;
const CLAIM_HIGH_ENCH_RATE = 0.5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_RATE = 0.2;
const FOLLOWUP_RATE = 0.15;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;

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

const COMPONENT_TYPES = ["rune", "moonstone"];

type Item = { type: string; cursed?: boolean; enchantment?: number };

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;
const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);
const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchantedForQuote = (item: Item): boolean =>
  enchantmentLevel(item) >= QUOTE_HIGH_ENCH_THRESHOLD;
const isHighlyEnchantedForClaim = (item: Item): boolean =>
  enchantmentLevel(item) >= CLAIM_HIGH_ENCH_THRESHOLD;

const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

const sumOfBasePremiums = (items: Item[]): number =>
  sum(items.map((item) => BASE_PREMIUMS[item.type]));

const groupByType = (items: Item[]): Item[][] => {
  const groups: Record<string, Item[]> = {};
  for (const item of items) {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  }
  return Object.values(groups);
};

const basePremiumForComponentGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_PREMIUM : sumOfBasePremiums(group);

const basePremiumFor = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const nonComponents = items.filter((item) => !isComponent(item));
  const componentGroupPremiums = groupByType(components).map(basePremiumForComponentGroup);
  return sum(componentGroupPremiums) + sumOfBasePremiums(nonComponents);
};

const surchargeFor = (
  items: Item[],
  rate: number,
  applies: (item: Item) => boolean,
): number =>
  sum(items.map((item) => (applies(item) ? BASE_PREMIUMS[item.type] * rate : 0)));

const quotePremium = (items: Item[], yearsWithMHPCO: number, quoteIndex: number): number => {
  const base = basePremiumFor(items);
  const curseSurcharge = surchargeFor(items, CURSE_RATE, isCursed);
  const highEnchSurcharge = surchargeFor(items, QUOTE_HIGH_ENCH_RATE, isHighlyEnchantedForQuote);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_THRESHOLD ? base * LOYALTY_RATE : 0;
  const followupDiscount = quoteIndex > 0 ? base * FOLLOWUP_RATE : 0;
  const firstInsuranceFee = base * FIRST_INSURANCE_RATE;
  const total = base + curseSurcharge + highEnchSurcharge
    - loyaltyDiscount - followupDiscount
    + firstInsuranceFee + PROCESSING_FEE;
  return Math.ceil(total);
};

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

const insuranceSumFor = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

const reimbursableAmount = (damageAmount: number, item: Item | undefined): number =>
  item && isHighlyEnchantedForClaim(item)
    ? damageAmount * CLAIM_HIGH_ENCH_RATE
    : damageAmount;

type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer?: { yearsWithMHPCO?: number }; steps: Step[] };

const findItemByType = (items: Item[], type: string): Item | undefined =>
  items.find((item) => item.type === type);

const validateDamage = (damage: Damage, policy: Policy): void => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
  if (!findItemByType(policy.items, damage.itemType)) {
    throw new Error(`${damage.itemType} not in policy`);
  }
};

const countByType = <T>(items: T[], typeOf: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const type = typeOf(item);
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
};

const validateDamageCounts = (damages: Damage[], policy: Policy): void => {
  const damageCounts = countByType(damages, (damage) => damage.itemType);
  const policyCounts = countByType(policy.items, (item) => item.type);
  for (const type in damageCounts) {
    if (damageCounts[type] > (policyCounts[type] ?? 0)) {
      throw new Error(`too many ${type} damages: exceed insured count`);
    }
  }
};

const validateDamagesAgainstPolicy = (damages: Damage[], policy: Policy): void => {
  damages.forEach((damage) => validateDamage(damage, policy));
  validateDamageCounts(damages, policy);
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const payoutForDamage = (damage: Damage, policy: Policy): number => {
  const item = findItemByType(policy.items, damage.itemType);
  const reimbursable = reimbursableAmount(damage.amount, item);
  return Math.max(0, Math.floor(reimbursable - DEDUCTIBLE_PER_DAMAGE));
};

type ClaimResult = { payout: number; remainingCap: number };
type QuoteResult = { premium: number };

const handleClaim = (step: ClaimStep, policies: Record<number, Policy>): ClaimResult => {
  const policy = policies[step.policy];
  const damages = step.incident.damages;
  validateDamagesAgainstPolicy(damages, policy);
  const totalPayout = sum(damages.map((damage) => payoutForDamage(damage, policy)));
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
};

const handleQuote = (
  step: QuoteStep,
  stepIndex: number,
  yearsWithMHPCO: number,
  quoteIndex: number,
  policies: Record<number, Policy>,
): QuoteResult => {
  validateItemTypes(step.items);
  const premium = quotePremium(step.items, yearsWithMHPCO, quoteIndex);
  const insuranceSum = insuranceSumFor(step.items);
  policies[stepIndex] = {
    items: step.items,
    insuranceSum,
    remainingCap: insuranceSum * CAP_MULTIPLIER,
  };
  return { premium };
};

export const runScenario = (scenario: Scenario): { results: Array<QuoteResult | ClaimResult> } => {
  const yearsWithMHPCO = scenario.customer?.yearsWithMHPCO ?? 0;
  let quoteIndex = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return handleClaim(step, policies);
    }
    const result = handleQuote(step, stepIndex, yearsWithMHPCO, quoteIndex, policies);
    quoteIndex++;
    return result;
  });
  return { results };
};
