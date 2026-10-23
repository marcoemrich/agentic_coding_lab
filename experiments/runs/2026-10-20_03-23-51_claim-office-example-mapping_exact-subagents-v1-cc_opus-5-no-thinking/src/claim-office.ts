export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = { itemType: string; amount: number };

export type Incident = { cause: string; damages: Damage[] };

export type QuoteStep = { op: "quote"; items: Item[] };

export type ClaimStep = { op: "claim"; policy: number; incident: Incident };

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = { results: StepResult[] };

const PROCESSING_FEE = 5;

// The MHPCO price list: one row per insurable item type.
type PriceListEntry = { insuranceValue: number; basePremium: number };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

// MHPCO refuses business it cannot price or verify; every refusal is raised the same way.
const reject = (reason: string): never => {
  throw new Error(reason);
};

// MHPCO only insures item types on its price list.
const priceListEntryOf = (item: Item): PriceListEntry =>
  PRICE_LIST[item.type] ?? reject(`Unknown item type: ${item.type}`);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const basePremiumOf = (item: Item): number => priceListEntryOf(item).basePremium;

// An item without an explicit enchantment level counts as unenchanted.
const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isEnchantedAtLeast = (item: Item, threshold: number): boolean =>
  enchantmentOf(item) >= threshold;

const curseSurchargeRateOf = (item: Item): number => (item.cursed ? CURSE_SURCHARGE_RATE : 0);

const highEnchantmentSurchargeRateOf = (item: Item): number =>
  isEnchantedAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;

// Rates stack additively: every applicable rule contributes its own rate,
// whether it is an item surcharge or a policy-wide discount.
type RateRule<Subject> = (subject: Subject) => number;

const sumRates = <Subject>(rules: RateRule<Subject>[], subject: Subject): number =>
  rules.reduce((total, rateOf) => total + rateOf(subject), 0);

const ITEM_SURCHARGE_RULES: RateRule<Item>[] = [
  curseSurchargeRateOf,
  highEnchantmentSurchargeRateOf,
];

const totalSurchargeRateOf = (item: Item): number => sumRates(ITEM_SURCHARGE_RULES, item);

const premiumOf = (item: Item): number => basePremiumOf(item) * (1 + totalSurchargeRateOf(item));

const BLOCK_SIZE = 3;
const PREMIUM_PER_BLOCK = 60;

const groupByType = (items: Item[]): Item[][] => {
  const types = [...new Set(items.map((item) => item.type))];
  return types.map((type) => items.filter((item) => item.type === type));
};

type ItemValuation = (item: Item) => number;

const premiumOfSameTypeItems = (sameTypeItems: Item[], valueOf: ItemValuation): number =>
  sameTypeItems.length === BLOCK_SIZE
    ? PREMIUM_PER_BLOCK
    : sameTypeItems.reduce((sum, item) => sum + valueOf(item), 0);

const blockPricedTotal = (items: Item[], valueOf: ItemValuation): number =>
  groupByType(items).reduce((total, group) => total + premiumOfSameTypeItems(group, valueOf), 0);

const itemsPremiumWithSurcharges = (items: Item[]): number => blockPricedTotal(items, premiumOf);

const itemsBasePremium = (items: Item[]): number => blockPricedTotal(items, basePremiumOf);

type Customer = { yearsWithMHPCO: number };

type PolicyContext = { customer: Customer; quotesSoFar: number };

const LOYALTY_DISCOUNT_RATE = -0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const loyaltyRateOf = ({ customer }: PolicyContext): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// Every quote carries this surcharge, so it ignores the policy context.
const firstInsuranceRateOf = (): number => FIRST_INSURANCE_SURCHARGE_RATE;

const FOLLOW_UP_DISCOUNT_RATE = -0.15;

const followUpRateOf = ({ quotesSoFar }: PolicyContext): number =>
  quotesSoFar > 0 ? FOLLOW_UP_DISCOUNT_RATE : 0;

const POLICY_RATE_RULES: RateRule<PolicyContext>[] = [
  loyaltyRateOf,
  firstInsuranceRateOf,
  followUpRateOf,
];

const totalPolicyRateOf = (context: PolicyContext): number =>
  sumRates(POLICY_RATE_RULES, context);

// MHPCO always rounds in its own favor: premiums it charges go up, payouts it owes go down.
const roundPremiumInMHPCOsFavor = (amount: number): number => Math.ceil(amount);

const roundPayoutInMHPCOsFavor = (amount: number): number => Math.floor(amount);

const premiumFor = (items: Item[], context: PolicyContext): number =>
  roundPremiumInMHPCOsFavor(
    itemsPremiumWithSurcharges(items) +
      itemsBasePremium(items) * totalPolicyRateOf(context) +
      PROCESSING_FEE,
  );

const insuranceValueOf = (item: Item): number => priceListEntryOf(item).insuranceValue;

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const CAP_FACTOR = 2;

const capOf = (items: Item[]): number => insuranceSumOf(items) * CAP_FACTOR;

const DEDUCTIBLE = 100;

const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRateOf = (insuredItem: Item): number =>
  isEnchantedAtLeast(insuredItem, HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD)
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const validatedAmountOf = (damage: Damage): number =>
  damage.amount < 0 ? reject(`Invalid damage amount: ${damage.amount}`) : damage.amount;

const payoutForDamage = (damage: Damage, insuredItem: Item): number =>
  validatedAmountOf(damage) * reimbursementRateOf(insuredItem) - DEDUCTIBLE;

const insuredItemFor = (damage: Damage, policyItems: Item[]): Item =>
  policyItems.find((item) => item.type === damage.itemType) ??
  reject(`Item not insured: ${damage.itemType}`);

const damageCountOfType = (itemType: string, damages: Damage[]): number =>
  damages.filter((damage) => damage.itemType === itemType).length;

const insuredCountOfType = (itemType: string, policyItems: Item[]): number =>
  policyItems.filter((item) => item.type === itemType).length;

// A policy covers each insured item once: more damage entries of a type than
// insured items of that type means the claim is rejected.
const rejectOverClaimedTypes = (damages: Damage[], policyItems: Item[]): void => {
  damages.forEach((damage) => {
    const claimed = damageCountOfType(damage.itemType, damages);
    const insured = insuredCountOfType(damage.itemType, policyItems);
    if (claimed > insured)
      reject(`More ${damage.itemType} damages than insured: ${claimed} of ${insured}`);
  });
};

const payoutForIncident = (incident: Incident, policyItems: Item[]): number => {
  rejectOverClaimedTypes(incident.damages, policyItems);
  return incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, insuredItemFor(damage, policyItems)),
    0,
  );
};

type ScenarioState = {
  context: PolicyContext;
  results: StepResult[];
  steps: Step[];
  remainingCaps: Record<number, number>;
};

const policyItemsOf = (state: ScenarioState, step: ClaimStep): Item[] =>
  (state.steps[step.policy] as QuoteStep).items;

// A policy starts out with its full cap and keeps whatever earlier claims left of it.
const remainingCapOf = (state: ScenarioState, step: ClaimStep): number =>
  state.remainingCaps[step.policy] ?? capOf(policyItemsOf(state, step));

const claimResultFor = (state: ScenarioState, step: ClaimStep): ClaimResult => {
  const remainingCap = remainingCapOf(state, step);
  const desiredPayout = roundPayoutInMHPCOsFavor(
    payoutForIncident(step.incident, policyItemsOf(state, step)),
  );
  const payout = Math.min(desiredPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

// What a step contributes to the scenario: its own result, plus whatever it
// used up of its policy's cap.
type StepOutcome = { result: StepResult; remainingCaps: Record<number, number> };

const quoteOutcome = (state: ScenarioState, step: QuoteStep): StepOutcome => ({
  result: { premium: premiumFor(step.items, state.context) },
  remainingCaps: state.remainingCaps,
});

const claimOutcome = (state: ScenarioState, step: ClaimStep): StepOutcome => {
  const result = claimResultFor(state, step);
  return {
    result,
    remainingCaps: { ...state.remainingCaps, [step.policy]: result.remainingCap },
  };
};

const outcomeOf = (state: ScenarioState, step: Step): StepOutcome =>
  step.op === "quote" ? quoteOutcome(state, step) : claimOutcome(state, step);

const applyStep = (state: ScenarioState, step: Step): ScenarioState => {
  const { result, remainingCaps } = outcomeOf(state, step);
  return {
    ...state,
    context: { ...state.context, quotesSoFar: state.context.quotesSoFar + 1 },
    results: [...state.results, result],
    remainingCaps,
  };
};

export function runScenario(scenario: Scenario): ScenarioResult {
  const initialState: ScenarioState = {
    context: { customer: scenario.customer, quotesSoFar: 0 },
    results: [],
    steps: scenario.steps,
    remainingCaps: {},
  };
  return { results: scenario.steps.reduce(applyStep, initialState).results };
}
