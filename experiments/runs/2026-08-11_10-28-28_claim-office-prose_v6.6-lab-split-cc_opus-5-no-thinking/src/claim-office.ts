export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = { itemType: string; amount: number };

export type Incident = { cause: string; damages: Damage[] };

export type QuoteStep = { op: "quote"; items: Item[] };

// `policy` is the zero-based index of the quote step that created the policy.
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };

export type Step = QuoteStep | ClaimStep;

export type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };

export type ClaimResult = { payout: number; remainingCap: number };

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = { results: StepResult[] };

// The price list: one row per item type, carrying both figures the type is
// looked up for. `basePrice` is what the type costs to insure; `insuranceValue`
// is what it is insured for. The two happen to stand in a 10:1 ratio for every
// current row, but the specification states them independently, so they are
// listed independently rather than derived from one another.
const PRICE_LIST: Record<string, { basePrice: number; insuranceValue: number }> = {
  sword: { basePrice: 100, insuranceValue: 1000 },
  amulet: { basePrice: 60, insuranceValue: 600 },
  staff: { basePrice: 80, insuranceValue: 800 },
  potion: { basePrice: 40, insuranceValue: 400 },
  rune: { basePrice: 25, insuranceValue: 250 },
  moonstone: { basePrice: 25, insuranceValue: 250 },
};

const FIRST_INSURANCE_MULTIPLIER = 1.1;
const CONTRACT_FEE = 5;

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PRICE = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// Each surcharge adds a percentage of the base price when its condition holds.
// Rates add together, so a cursed and highly enchanted item pays 1 + 0.5 + 0.3.
const RISK_SURCHARGES: { appliesTo: (item: Item) => boolean; rate: number }[] = [
  { appliesTo: (item) => item.cursed === true, rate: CURSED_SURCHARGE_RATE },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const totalSurchargeRateFor = (item: Item): number =>
  RISK_SURCHARGES.filter((surcharge) => surcharge.appliesTo(item)).reduce(
    (total, surcharge) => total + surcharge.rate,
    0,
  );

// Risk surcharges apply per item, before the contract-level multiplier and fee.
const riskAdjustedPriceOfItem = (item: Item): number =>
  PRICE_LIST[item.type].basePrice * (1 + totalSurchargeRateFor(item));

const sumOfIndividualPrices = (items: Item[]): number =>
  items.reduce((total, item) => total + riskAdjustedPriceOfItem(item), 0);

// Only alike items form a building block together, and "alike" in the price
// list means same type — material and enchantment do not affect grouping. This
// is the one place that decides what "alike" means, so that the pricing below
// receives groups that are alike by construction rather than by assumption.
const alikeGroupsOf = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, Item[]>(),
    )
    .values(),
];

// Every three items in the group form a building block priced at 60 G; the
// remainder is priced individually.
const priceOfGroup = (group: Item[]): number => {
  const completeBlocks = Math.floor(group.length / BUILDING_BLOCK_SIZE);
  const itemsInBlocks = completeBlocks * BUILDING_BLOCK_SIZE;

  return (
    completeBlocks * BUILDING_BLOCK_PRICE +
    sumOfIndividualPrices(group.slice(itemsInBlocks))
  );
};

// The basis the premium is charged on: price-list figures plus per-item risk
// surcharges, before any contract-level multiplier or fee. Distinct from
// coverSumOf, which is what those same items are insured *for*.
const premiumBasisOf = (items: Item[]): number =>
  alikeGroupsOf(items).reduce((total, group) => total + priceOfGroup(group), 0);

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyMultiplierFor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? 1 - LOYALTY_DISCOUNT_RATE : 1;

const REPEAT_CONTRACT_DISCOUNT_RATE = 0.15;

// A first insurance carries an assessment surcharge; every later contract
// earns the repeat-customer discount instead.
const repeatCustomerMultiplierFor = (isFirstContract: boolean): number =>
  isFirstContract ? FIRST_INSURANCE_MULTIPLIER : 1 - REPEAT_CONTRACT_DISCOUNT_RATE;

// Customer-dependent factors that scale the whole contract, as opposed to the
// per-item risk surcharges already folded into the insured value.
const contractMultiplierFor = (
  customer: Customer,
  isFirstContract: boolean,
): number =>
  loyaltyMultiplierFor(customer) * repeatCustomerMultiplierFor(isFirstContract);

// Amounts are rounded up, in MHPCO's favor. The product is first snapped to
// this many decimals so IEEE754 noise (100 × 1.1 = 110.00000000000001) does
// not push an exact amount to the next whole G.
const SIGNIFICANT_DECIMALS = 6;

const roundedUpInMHPCOsFavor = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(SIGNIFICANT_DECIMALS)));

const resultOfQuoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFirstContract: boolean,
): QuoteResult => ({
  premium:
    roundedUpInMHPCOsFavor(
      premiumBasisOf(step.items) * contractMultiplierFor(customer, isFirstContract),
    ) + CONTRACT_FEE,
});

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;

// What the items are insured for, as opposed to what they cost to insure.
const coverSumOf = (items: Item[]): number =>
  items.reduce((total, item) => total + PRICE_LIST[item.type].insuranceValue, 0);

// A claim names the quote step that created its policy. Resolving it by
// narrowing rather than casting means a mis-aimed index fails here, with the
// offending index in hand, instead of silently yielding NaN downstream.
const insuredItemsOf = (policyIndex: number, steps: Step[]): Item[] => {
  const policy = steps[policyIndex];

  if (policy?.op !== "quote") {
    throw new Error(`Step ${policyIndex} is not a quote step`);
  }

  return policy.items;
};

const FRAGILE_ENCHANTMENT_LEVEL = 8;
const FRAGILE_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

const DRAGON_MATERIAL = "dragon";

// Order is significant: the first rule that applies sets the rate, so dragon
// material overrides the high-enchantment halving. Add new rules at the
// position matching their specificity, not at the end. Anything no rule claims
// is reimbursed in full.
const REIMBURSEMENT_RULES_MOST_SPECIFIC_FIRST: {
  appliesTo: (item: Item) => boolean;
  rate: number;
}[] = [
  {
    appliesTo: (item) => item.material === DRAGON_MATERIAL,
    rate: FULL_REIMBURSEMENT_RATE,
  },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= FRAGILE_ENCHANTMENT_LEVEL,
    rate: FRAGILE_REIMBURSEMENT_RATE,
  },
];

const reimbursementRateFor = (item: Item): number =>
  REIMBURSEMENT_RULES_MOST_SPECIFIC_FIRST.find(({ appliesTo }) => appliesTo(item))
    ?.rate ?? FULL_REIMBURSEMENT_RATE;

// A damage names the type of the item it befell. A damage to something not on
// the policy has no insured item to rate, and is reimbursed in full.
const reimbursementRateForDamageTo = (
  itemType: string,
  insured: Item[],
): number => {
  const damagedItem = insured.find(({ type }) => type === itemType);

  return damagedItem ? reimbursementRateFor(damagedItem) : FULL_REIMBURSEMENT_RATE;
};

const totalReimbursableOf = (incident: Incident, insured: Item[]): number =>
  incident.damages.reduce(
    (total, { itemType, amount }) =>
      total + amount * reimbursementRateForDamageTo(itemType, insured),
    0,
  );

// The customer bears the deductible, and never the other way round: a damage
// smaller than the deductible pays nothing rather than billing the customer.
const afterDeductible = (reimbursable: number): number =>
  Math.max(0, reimbursable - DEDUCTIBLE);

const payoutCapOf = (insured: Item[]): number =>
  CAP_FACTOR * coverSumOf(insured);

// The cap belongs to the policy, not the claim: successive claims draw down a
// shared balance, so the caller supplies what earlier claims have left.
const resultOfClaimStep = (
  step: ClaimStep,
  steps: Step[],
  capRemaining: number,
): ClaimResult => {
  const insured = insuredItemsOf(step.policy, steps);
  // The cap is the ceiling on what a policy pays, not on what it reimburses,
  // so it is applied last — outermost here, after the deductible is borne.
  const payout = Math.min(
    capRemaining,
    afterDeductible(totalReimbursableOf(step.incident, insured)),
  );

  return { payout, remainingCap: capRemaining - payout };
};

// It is contracts that count, not steps: a quote preceded only by claim steps
// is still the customer's first contract. Claims are therefore not counted.
const isFirstContractAt = (stepIndex: number, steps: Step[]): boolean =>
  !steps.slice(0, stepIndex).some(({ op }) => op === "quote");

// What running the scenario carries from one step to the next: the results so
// far, and how much of each policy's cap its earlier claims have left. A policy
// absent from the ledger has not been claimed against yet and still has its
// full cap; policies draw down independently of one another.
type ScenarioProgress = {
  results: StepResult[];
  capRemainingByPolicy: Map<number, number>;
};

const EMPTY_PROGRESS: ScenarioProgress = {
  results: [],
  capRemainingByPolicy: new Map(),
};

const withResult = (
  progress: ScenarioProgress,
  result: StepResult,
): ScenarioProgress => ({
  ...progress,
  results: [...progress.results, result],
});

// A quote leaves the ledger untouched: caps are drawn down by claims alone.
const progressAfterQuoteStep = (
  step: QuoteStep,
  index: number,
  scenario: Scenario,
  progress: ScenarioProgress,
): ScenarioProgress =>
  withResult(
    progress,
    resultOfQuoteStep(
      step,
      scenario.customer,
      isFirstContractAt(index, scenario.steps),
    ),
  );

// The ledger's own rule for what a policy has left: an entry once it has been
// claimed against, and otherwise the full cap it was written with.
const capRemainingForPolicy = (
  policyIndex: number,
  steps: Step[],
  progress: ScenarioProgress,
): number =>
  progress.capRemainingByPolicy.get(policyIndex) ??
  payoutCapOf(insuredItemsOf(policyIndex, steps));

const withCapRemainingForPolicy = (
  progress: ScenarioProgress,
  policyIndex: number,
  capRemaining: number,
): ScenarioProgress => ({
  ...progress,
  capRemainingByPolicy: new Map(progress.capRemainingByPolicy).set(
    policyIndex,
    capRemaining,
  ),
});

// A claim is the only step that both reads and advances the ledger, so it is
// the only one that returns a new one.
const progressAfterClaimStep = (
  step: ClaimStep,
  steps: Step[],
  progress: ScenarioProgress,
): ScenarioProgress => {
  const result = resultOfClaimStep(
    step,
    steps,
    capRemainingForPolicy(step.policy, steps, progress),
  );

  return withResult(
    withCapRemainingForPolicy(progress, step.policy, result.remainingCap),
    result,
  );
};

// Steps are folded rather than mapped: a claim's payout depends on what earlier
// claims on the same policy have already drawn, so the steps are not
// independent and the carried ledger belongs in the signature, not in a closure.
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const { results } = scenario.steps.reduce<ScenarioProgress>(
    (progress, step, index) =>
      step.op === "quote"
        ? progressAfterQuoteStep(step, index, scenario, progress)
        : progressAfterClaimStep(step, scenario.steps, progress),
    EMPTY_PROGRESS,
  );

  return { results };
};
