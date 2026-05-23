const PROCESSING_FEE = 5;
const FIRST_CONTRACT_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (type: string) => COMPONENT_TYPES.has(type);

const isKnownItemType = (type: string): boolean =>
  type in MAIN_ITEM_BASE_PREMIUM || COMPONENT_TYPES.has(type);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const itemInsuranceValue = (item: Item): number =>
  isComponent(item.type) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEM_INSURANCE_VALUE[item.type];

const componentsGroupBase = (count: number): number => {
  if (count === BUILDING_BLOCK_SIZE) return BUILDING_BLOCK_BASE_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
};

const itemBasePremium = (item: Item): number => {
  if (isComponent(item.type)) return COMPONENT_BASE_PREMIUM;
  return MAIN_ITEM_BASE_PREMIUM[item.type];
};

const enchantmentLevel = (item: Item | undefined): number => item?.enchantment ?? 0;

const itemSurcharges = (item: Item): number => {
  if (isComponent(item.type)) return 0;
  const base = itemBasePremium(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantment =
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curse + highEnchantment;
};

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

// MHPCO-favor rounding: premiums round up, payouts round down — both in MHPCO's favor.
const roundPremiumInMHPCOFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOFavor = (amount: number): number => Math.floor(amount);

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> =>
  values.reduce((counts, value) => {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

const countItemsByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByItemType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const policyBaseSum = (items: Item[]): number => {
  const mainItems = items.filter((i) => !isComponent(i.type));
  const components = items.filter((i) => isComponent(i.type));
  const mainSum = sum(mainItems.map(itemBasePremium));
  const componentsSum = sum(
    Array.from(countItemsByType(components).values(), componentsGroupBase)
  );
  return mainSum + componentsSum;
};

const policyItemSurcharges = (items: Item[]): number => sum(items.map(itemSurcharges));

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const baseSum = policyBaseSum(items);
  const surcharges = policyItemSurcharges(items);
  const firstContractInsurance = baseSum * FIRST_CONTRACT_INSURANCE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? baseSum * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? baseSum * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return roundPremiumInMHPCOFavor(
    baseSum + surcharges + firstContractInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE
  );
};

type Policy = { items: Item[]; cap: number };

const createPolicy = (items: Item[]): Policy => {
  const insuranceSum = sum(items.map(itemInsuranceValue));
  return { items, cap: insuranceSum * CAP_MULTIPLIER };
};

const qualifiesForHighEnchantmentClaim = (item: Item | undefined): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item | undefined): number =>
  qualifiesForHighEnchantmentClaim(item)
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damage.amount;

const damagePayout = (damage: Damage, items: Item[]): number => {
  const damagedItem = items.find((i) => i.type === damage.itemType);
  const reimbursable = reimbursableAmount(damage, damagedItem);
  return Math.max(0, reimbursable - DEDUCTIBLE_PER_DAMAGE);
};

const validateDamageCountsWithinPolicy = (policy: Policy, damages: Damage[]): void => {
  const policyCounts = countItemsByType(policy.items);
  const damageCounts = countDamagesByItemType(damages);
  for (const [itemType, damageCount] of damageCounts) {
    const policyCount = policyCounts.get(itemType) ?? 0;
    if (damageCount > policyCount) {
      throw new Error(
        `Claim rejected: ${damageCount} damages for ${itemType} but policy covers only ${policyCount}`,
      );
    }
  }
};

const validateDamageAmountsNonNegative = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
};

const validateClaim = (policy: Policy, damages: Damage[]): void => {
  validateDamageAmountsNonNegative(damages);
  validateDamageCountsWithinPolicy(policy, damages);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident.damages);
  const rawPayout = sum(incident.damages.map((d) => damagePayout(d, policy.items)));
  const payout = roundPayoutInMHPCOFavor(Math.min(rawPayout, policy.cap));
  policy.cap -= payout;
  return { payout, remainingCap: policy.cap };
};

const handleQuote = (
  step: QuoteStep,
  customer: Customer,
  policies: Policy[],
): QuoteResult => {
  validateItems(step.items);
  const isFollowUp = policies.length > 0;
  policies.push(createPolicy(step.items));
  return { premium: quotePremium(step.items, customer, isFollowUp) };
};

const handleClaim = (step: ClaimStep, policies: Policy[]): ClaimResult =>
  processClaim(policies[step.policy], step.incident);

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) =>
    step.op === "quote"
      ? handleQuote(step, scenario.customer, policies)
      : handleClaim(step, policies),
  );
  return { results };
};
