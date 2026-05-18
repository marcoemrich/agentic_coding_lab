const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

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
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

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
  incident: { cause?: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface PolicyState {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);
const isMainItem = (item: Item): boolean => !isComponent(item);

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const countsBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> =>
  items.reduce((counts, item) => {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

const countsByType = (items: Item[]): Map<string, number> =>
  countsBy(items, (item) => item.type);

const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_UNIT_PREMIUM;

const sumComponentPremiums = (components: Item[]): number =>
  Array.from(countsByType(components).values()).reduce(
    (total, count) => total + componentGroupPremium(count),
    0,
  );

const sumMainItemPremiums = (mainItems: Item[]): number =>
  mainItems.reduce((total, item) => total + basePremiumFor(item), 0);

const policyBasePremium = (items: Item[]): number =>
  sumMainItemPremiums(items.filter(isMainItem)) +
  sumComponentPremiums(items.filter(isComponent));

const curseRate = (item: Item): number => (item.cursed ? CURSE_SURCHARGE_RATE : 0);

const highEnchantmentRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_RATE : 0;

const itemModifierRate = (item: Item): number => curseRate(item) + highEnchantmentRate(item);

const itemModifierSurcharge = (item: Item): number =>
  isComponent(item) ? 0 : basePremiumFor(item) * itemModifierRate(item);

const sumItemModifiers = (items: Item[]): number =>
  items.reduce((total, item) => total + itemModifierSurcharge(item), 0);

interface CustomerContext {
  yearsWithMHPCO: number;
  isFollowUpContract: boolean;
}

const loyaltyDiscountRate = (ctx: CustomerContext): number =>
  ctx.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountRate = (ctx: CustomerContext): number =>
  ctx.isFollowUpContract ? FOLLOW_UP_DISCOUNT_RATE : 0;

const policyModifierRate = (ctx: CustomerContext): number =>
  FIRST_INSURANCE_RATE - loyaltyDiscountRate(ctx) - followUpDiscountRate(ctx);

const policyModifierAmount = (policyBase: number, ctx: CustomerContext): number =>
  policyBase * policyModifierRate(ctx);

const computeQuote = (step: QuoteStep, ctx: CustomerContext) => {
  const policyBase = policyBasePremium(step.items);
  const itemSurcharges = sumItemModifiers(step.items);
  const policyMods = policyModifierAmount(policyBase, ctx);
  const premium = policyBase + itemSurcharges + policyMods + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0);

const createPolicy = (items: Item[]): PolicyState => {
  const insuranceSum = insuranceSumOf(items);
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
};

const hasHighClaimEnchantment = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursedAmount = (damage: Damage, item: Item | undefined): number =>
  hasHighClaimEnchantment(item) ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE : damage.amount;

const damagePayout = (damage: Damage, item: Item | undefined): number =>
  Math.max(0, reimbursedAmount(damage, item) - DEDUCTIBLE);

const findItem = (items: Item[], itemType: string): Item | undefined =>
  items.find((i) => i.type === itemType);

const sumDamagePayouts = (damages: Damage[], items: Item[]): number =>
  damages.reduce((total, damage) => total + damagePayout(damage, findItem(items, damage.itemType)), 0);

const processClaim = (step: ClaimStep, policy: PolicyState) => {
  const uncappedPayout = sumDamagePayouts(step.incident.damages, policy.items);
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout: Math.floor(payout), remainingCap: policy.remainingCap };
};

interface ScenarioState {
  policies: PolicyState[];
  quoteCount: number;
  yearsWithMHPCO: number;
}

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUMS));

const isKnownItem = (item: Item): boolean => KNOWN_ITEM_TYPES.has(item.type);

const assertAllValid = <T>(
  collection: T[],
  isValid: (element: T) => boolean,
  buildError: (invalid: T) => string,
): void => {
  const invalid = collection.find((element) => !isValid(element));
  if (invalid) {
    throw new Error(buildError(invalid));
  }
};

const validateQuoteItems = (items: Item[]): void =>
  assertAllValid(items, isKnownItem, (item) => `Unknown item type: ${item.type}`);

const handleQuoteStep = (step: QuoteStep, state: ScenarioState) => {
  validateQuoteItems(step.items);
  const ctx: CustomerContext = {
    yearsWithMHPCO: state.yearsWithMHPCO,
    isFollowUpContract: state.quoteCount > 0,
  };
  state.quoteCount += 1;
  state.policies.push(createPolicy(step.items));
  return computeQuote(step, ctx);
};

const insuredTypesOf = (items: Item[]): Set<string> =>
  new Set(items.map((item) => item.type));

const assertNonNegativeDamageAmounts = (damages: Damage[]): void =>
  assertAllValid(
    damages,
    (damage) => damage.amount >= 0,
    (damage) => `Negative damage amount: ${damage.amount}`,
  );

const assertDamagesReferenceInsuredItems = (damages: Damage[], policyItems: Item[]): void => {
  const insuredTypes = insuredTypesOf(policyItems);
  assertAllValid(
    damages,
    (damage) => insuredTypes.has(damage.itemType),
    (damage) => `Damage references item not in policy: ${damage.itemType}`,
  );
};

const assertDamageCountsWithinInsured = (damages: Damage[], policyItems: Item[]): void => {
  const insuredCounts = countsByType(policyItems);
  const damageCounts = countsBy(damages, (damage) => damage.itemType);
  assertAllValid(
    Array.from(damageCounts.entries()),
    ([itemType, count]) => count <= (insuredCounts.get(itemType) ?? 0),
    ([itemType]) => `Damage entries for ${itemType} exceed insured count`,
  );
};

const validateClaimDamages = (damages: Damage[], policyItems: Item[]): void => {
  assertNonNegativeDamageAmounts(damages);
  assertDamagesReferenceInsuredItems(damages, policyItems);
  assertDamageCountsWithinInsured(damages, policyItems);
};

const handleClaimStep = (step: ClaimStep, state: ScenarioState) => {
  const policy = state.policies[step.policy];
  validateClaimDamages(step.incident.damages, policy.items);
  return processClaim(step, policy);
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const state: ScenarioState = {
    policies: [],
    quoteCount: 0,
    yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
  };
  const results = scenario.steps.map((step) =>
    step.op === "quote" ? handleQuoteStep(step, state) : handleClaimStep(step, state),
  );
  return { results };
};
