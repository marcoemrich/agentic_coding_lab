type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const basePremiumOf = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type];

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const priceForComponentGroup = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * BASE_PREMIUM_BY_TYPE[type];

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

const countDamagesByItemType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const sumBasePremiumsFor = (items: Item[]): number => {
  const mainItemsTotal = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + basePremiumOf(item), 0);

  const componentsTotal = Array.from(countItemsByType(items.filter(isComponent)))
    .reduce((sum, [type, count]) => sum + priceForComponentGroup(type, count), 0);

  return mainItemsTotal + componentsTotal;
};

// Item surcharges: each rule adds a percentage of the item's base premium when it applies.
const ITEM_SURCHARGE_RULES: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  { applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD, rate: HIGH_ENCHANTMENT_SURCHARGE },
];

const surchargeRateFor = (item: Item): number =>
  ITEM_SURCHARGE_RULES.reduce((rate, rule) => rate + (rule.applies(item) ? rule.rate : 0), 0);

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOf(item) * surchargeRateFor(item), 0);

type PolicyContext = { customer: Customer; quoteIndex: number };

// Policy modifiers: each rule applies a +/- percentage of the policy base when its predicate holds.
const POLICY_MODIFIER_RULES: { applies: (ctx: PolicyContext) => boolean; rate: number }[] = [
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE },
  { applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD, rate: -LOYALTY_DISCOUNT },
  { applies: (ctx) => ctx.quoteIndex > 0, rate: -FOLLOWUP_CONTRACT_DISCOUNT },
];

const policyModifierRateFor = (ctx: PolicyContext): number =>
  POLICY_MODIFIER_RULES.reduce((rate, rule) => rate + (rule.applies(ctx) ? rule.rate : 0), 0);

const computePremium = (items: Item[], ctx: PolicyContext): number => {
  const policyBase = sumBasePremiumsFor(items);
  const itemSurcharges = itemSurchargesFor(items);
  const policyModifiers = policyBase * policyModifierRateFor(ctx);
  return policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE;
};

// Cleans float noise (e.g. 66.00000000000001) so subsequent rounding
// doesn't flip a whole-gold value to the next gold piece by mistake.
const cleanFloatNoise = (amount: number): number =>
  Math.round(amount * 1e6) / 1e6;

// Rounding is in MHPCO's favor: premiums round UP, payouts round DOWN.
const roundUpToGold = (amount: number): number =>
  Math.ceil(cleanFloatNoise(amount));

const roundDownToGold = (amount: number): number =>
  Math.floor(cleanFloatNoise(amount));

type Policy = { items: Item[]; cap: number; remainingCap: number };

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_TYPE[item.type], 0);

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT
    : 1;

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(0, damage.amount * reimbursementRateFor(item) - DEDUCTIBLE_PER_DAMAGE);

// Caller is responsible for ensuring the damage references an insured item.
// Validation of unknown itemTypes will be added when the corresponding test is implemented.
const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const grossPayoutFor = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, insuredItemFor(damage, policy)),
    0,
  );

type ScenarioState = { policies: Policy[]; results: StepResult[] };

// Throws if any item's type is not a recognised insurable type.
const validateItemTypesAreKnown = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const applyQuote = (
  state: ScenarioState,
  step: QuoteStep,
  customer: Customer,
): ScenarioState => {
  validateItemTypesAreKnown(step.items);
  const ctx: PolicyContext = { customer, quoteIndex: state.policies.length };
  const cap = insuranceSumFor(step.items) * CAP_MULTIPLIER;
  const policy: Policy = { items: step.items, cap, remainingCap: cap };
  const result: QuoteResult = { premium: roundUpToGold(computePremium(step.items, ctx)) };
  return {
    policies: [...state.policies, policy],
    results: [...state.results, result],
  };
};

// Throws if any item type is damaged more times than it is insured.
const validateDamageCountsAgainstPolicy = (incident: Incident, policy: Policy): void => {
  const insuredCounts = countItemsByType(policy.items);
  const damageCounts = countDamagesByItemType(incident.damages);
  for (const [type, damagedCount] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(`Claim has ${damagedCount} damages for ${type} but only ${insuredCount} insured`);
    }
  }
};

const validateDamageAmountsAreNonNegative = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount} for ${damage.itemType}`);
    }
  }
};

const applyClaim = (state: ScenarioState, step: ClaimStep): ScenarioState => {
  const policy = state.policies[step.policy];
  validateDamageAmountsAreNonNegative(step.incident);
  validateDamageCountsAgainstPolicy(step.incident, policy);
  const payout = roundDownToGold(Math.min(grossPayoutFor(step.incident, policy), policy.remainingCap));
  const updatedPolicy: Policy = { ...policy, remainingCap: policy.remainingCap - payout };
  return {
    policies: state.policies.map((p, i) => (i === step.policy ? updatedPolicy : p)),
    results: [...state.results, { payout, remainingCap: updatedPolicy.remainingCap }],
  };
};

const applyStep = (customer: Customer) => (state: ScenarioState, step: Step): ScenarioState =>
  step.op === "quote" ? applyQuote(state, step, customer) : applyClaim(state, step);

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const initial: ScenarioState = { policies: [], results: [] };
  const { results } = scenario.steps.reduce(applyStep(scenario.customer), initial);
  return { results };
};
