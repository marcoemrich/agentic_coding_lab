export interface Item {
  readonly type: string;
  readonly material?: string;
  readonly enchantment?: number;
  readonly cursed?: boolean;
}

export interface QuoteStep {
  readonly op: "quote";
  readonly items: readonly Item[];
}

export interface Damage {
  readonly itemType: string;
  readonly amount: number;
}

export interface Incident {
  readonly cause: string;
  readonly damages: readonly Damage[];
}

export interface ClaimStep {
  readonly op: "claim";
  readonly policy: number;
  readonly incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  readonly yearsWithMHPCO: number;
}

export interface Scenario {
  readonly customer: Customer;
  readonly steps: readonly Step[];
}

export interface QuoteResult {
  readonly premium: number;
}

export interface ClaimResult {
  readonly payout: number;
  readonly remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  readonly results: readonly StepResult[];
}

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const sumOf = <T>(values: readonly T[], amountOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + amountOf(value), 0);

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_ITEM_TYPE;

const rejectUnknownItemTypes = (items: readonly Item[]): void => {
  const unknownItem = items.find((item) => !isKnownItemType(item.type));

  if (unknownItem !== undefined) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
};

const itemBasePremiumOf = (item: Item): number =>
  BASE_PREMIUM_BY_ITEM_TYPE[item.type];

const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

const itemTypesOf = (items: readonly Item[]): readonly string[] => [
  ...new Set(items.map((item) => item.type)),
];

const itemsGroupedByType = (
  items: readonly Item[],
): readonly (readonly Item[])[] =>
  itemTypesOf(items).map((type) => items.filter((item) => item.type === type));

// A component block is a discount on exactly BLOCK_SIZE items of the same type.
const sameTypeBasePremiumOf = (sameTypeItems: readonly Item[]): number =>
  sameTypeItems.length === BLOCK_SIZE
    ? BLOCK_PREMIUM
    : sumOf(sameTypeItems, itemBasePremiumOf);

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

interface Surcharge {
  readonly appliesTo: (item: Item) => boolean;
  readonly rate: number;
}

const SURCHARGES: readonly Surcharge[] = [
  { appliesTo: isCursed, rate: CURSED_SURCHARGE_RATE },
  { appliesTo: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const surchargeRateOf = (item: Item): number =>
  sumOf(SURCHARGES, (surcharge) =>
    surcharge.appliesTo(item) ? surcharge.rate : 0,
  );

const itemSurchargeOf = (item: Item): number =>
  itemBasePremiumOf(item) * surchargeRateOf(item);

const policyBasePremiumOf = (items: readonly Item[]): number =>
  sumOf(itemsGroupedByType(items), sameTypeBasePremiumOf);

const policySurchargeOf = (items: readonly Item[]): number =>
  sumOf(items, itemSurchargeOf);

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const firstInsuranceSurchargeOf = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const loyaltyDiscountOf = (basePremium: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscountOf = (
  basePremium: number,
  previousQuoteCount: number,
): number =>
  previousQuoteCount > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const exactPremiumBeforeFeeOf = (
  items: readonly Item[],
  customer: Customer,
  previousQuoteCount: number,
): number => {
  const basePremium = policyBasePremiumOf(items);

  return (
    basePremium +
    policySurchargeOf(items) +
    firstInsuranceSurchargeOf(basePremium) -
    loyaltyDiscountOf(basePremium, customer) -
    followUpDiscountOf(basePremium, previousQuoteCount)
  );
};

const PROCESSING_FEE = 5;

// Premiums round up and payouts round down: both in the MHPCO's favour.
const roundedPremiumInMHPCOsFavour = (premium: number): number =>
  Math.ceil(premium);

const quotePremiumOf = (
  items: readonly Item[],
  customer: Customer,
  previousQuoteCount: number,
): number => {
  rejectUnknownItemTypes(items);

  return roundedPremiumInMHPCOsFavour(
    exactPremiumBeforeFeeOf(items, customer, previousQuoteCount) +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;

const itemInsuranceValueOf = (item: Item): number =>
  INSURANCE_VALUE_BY_ITEM_TYPE[item.type];

const MASTER_ENCHANTMENT_THRESHOLD = 8;
const MASTER_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const isMasterEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= MASTER_ENCHANTMENT_THRESHOLD;

// Dragon material needs no branch of its own: it is reimbursed in full, which
// is already the default rate. Master enchantment overrides that default.
const reimbursementRateOf = (item: Item): number =>
  isMasterEnchanted(item)
    ? MASTER_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// A damage entry names an item type, not a particular item, so the terms that
// govern it come from an insured item of that type. Absent when the policy
// insures no item of that type, which is what makes a damage entry uncovered.
const insuredItemOfType = (
  itemType: string,
  insuredItems: readonly Item[],
): Item | undefined => insuredItems.find((item) => item.type === itemType);

const isCoveredBy = (itemType: string, insuredItems: readonly Item[]): boolean =>
  insuredItemOfType(itemType, insuredItems) !== undefined;

const notCoveredError = (itemType: string): Error =>
  new Error(`Item not covered by the policy: ${itemType}`);

// Rejects item types the policy does not insure. This also rejects item types
// that do not exist at all: an unknown type is, necessarily, not one the policy
// insures, so it needs no separate check of its own.
const rejectUncoveredTypes = (
  damages: readonly Damage[],
  insuredItems: readonly Item[],
): void => {
  const uncoveredDamage = damages.find(
    (damage) => !isCoveredBy(damage.itemType, insuredItems),
  );

  if (uncoveredDamage !== undefined) {
    throw notCoveredError(uncoveredDamage.itemType);
  }
};

// The reimbursement rate applies to the damage first; the deductible comes off
// what is left, not off the damage. Reached only after rejectInvalidDamages has
// established that every damaged type is one the policy insures.
const damagePayoutOf = (
  damage: Damage,
  insuredItems: readonly Item[],
): number => {
  const insuredItem = insuredItemOfType(damage.itemType, insuredItems);

  if (insuredItem === undefined) {
    throw notCoveredError(damage.itemType);
  }

  const reimbursedAmount = damage.amount * reimbursementRateOf(insuredItem);

  return reimbursedAmount - DEDUCTIBLE;
};

// The cap is twice the policy's insurance sum: the unmodified insurance values
// of the insured items, untouched by premium modifiers or block discounts.
const policyCapOf = (insuredItems: readonly Item[]): number =>
  sumOf(insuredItems, itemInsuranceValueOf) * CAP_FACTOR;

const countOfType = (types: readonly string[], type: string): number =>
  types.filter((candidate) => candidate === type).length;

// A damage entry claims one insured item, so a type cannot be claimed more
// often than the policy insures items of that type. Every damaged type is
// known to be covered here, so a type claimed at all is insured at least once.
const rejectOverclaimedTypes = (
  damages: readonly Damage[],
  insuredItems: readonly Item[],
): void => {
  const damagedTypes = damages.map((damage) => damage.itemType);
  const insuredTypes = insuredItems.map((item) => item.type);

  const overclaimedType = damagedTypes.find(
    (type) => countOfType(damagedTypes, type) > countOfType(insuredTypes, type),
  );

  if (overclaimedType !== undefined) {
    throw new Error(
      `More ${overclaimedType} damages claimed than the policy insures`,
    );
  }
};

// A damage is a loss, so its amount cannot be negative. A negative amount would
// otherwise pay out a negative sum and hand cap back to the policy.
const rejectNegativeAmounts = (damages: readonly Damage[]): void => {
  const negativeDamage = damages.find((damage) => damage.amount < 0);

  if (negativeDamage !== undefined) {
    throw new Error(`Negative damage amount: ${negativeDamage.amount}`);
  }
};

// The first two checks are ordered, not independent: a type the policy does
// not insure at all is reported as not covered, never as overclaimed. Rejecting
// uncovered types first is what lets the overclaim check assume coverage.
// The amount check stands apart from that pair — it reads only the damages and
// never the insured items — so its position here is a choice, not a
// requirement: a claim naming a type the policy does not insure is reported as
// uncovered even when its amount is also negative.
const rejectInvalidDamages = (
  damages: readonly Damage[],
  insuredItems: readonly Item[],
): void => {
  rejectUncoveredTypes(damages, insuredItems);
  rejectOverclaimedTypes(damages, insuredItems);
  rejectNegativeAmounts(damages);
};

const entitledPayoutOf = (
  incident: Incident,
  insuredItems: readonly Item[],
): number => {
  rejectInvalidDamages(incident.damages, insuredItems);

  return sumOf(incident.damages, (damage) =>
    damagePayoutOf(damage, insuredItems),
  );
};

// Payouts round down and premiums round up: both in the MHPCO's favour.
const roundedPayoutInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

// The cap limits what a policy pays out over its lifetime, so a claim never
// pays more than the cap left at the time it is made.
const cappedBy = (entitledPayout: number, remainingCap: number): number =>
  Math.min(entitledPayout, remainingCap);

const claimResultOf = (
  step: ClaimStep,
  policies: readonly (QuoteStep | undefined)[],
  remainingCap: number,
): ClaimResult => {
  const entitledPayout = entitledPayoutOf(
    step.incident,
    policyAt(policies, step.policy).items,
  );
  const payout = roundedPayoutInMHPCOsFavour(
    cappedBy(entitledPayout, remainingCap),
  );

  return { payout, remainingCap: remainingCap - payout };
};

const quoteResultOf = (
  step: QuoteStep,
  customer: Customer,
  previousQuoteCount: number,
): QuoteResult => ({
  premium: quotePremiumOf(step.items, customer, previousQuoteCount),
});

const isQuoteStep = (step: Step): step is QuoteStep => step.op === "quote";

// A claim names its policy by the index of the step that quoted it, so the
// policies are kept at their step positions rather than packed together. The
// positions of claim steps hold no policy.
const policyByStepIndex = (
  steps: readonly Step[],
): readonly (QuoteStep | undefined)[] =>
  steps.map((step) => (isQuoteStep(step) ? step : undefined));

// Every claim in the tests names a step that quoted a policy. Nothing has
// demanded a reading of what happens when one does not, so this states the
// assumption in one place instead of leaving it implicit at each use.
const policyAt = (
  policies: readonly (QuoteStep | undefined)[],
  stepIndex: number,
): QuoteStep => {
  const policy = policies[stepIndex];

  if (policy === undefined) {
    throw new Error(`No policy was quoted at step ${stepIndex}`);
  }

  return policy;
};

// The follow-up discount turns on how many quotes the customer has already
// had, so what a quote step needs from its predecessors is a count, not a list.
const quoteCountBefore = (
  steps: readonly Step[],
  stepIndex: number,
): number => steps.slice(0, stepIndex).filter(isQuoteStep).length;

// The state a scenario carries from one step to the next: the results produced
// so far, and how much of each policy's cap is still available.
interface ScenarioState {
  readonly results: readonly StepResult[];
  readonly remainingCaps: readonly number[];
}

// One cap per step position, matching the policy positions. A step that quoted
// no policy has no cap to track; the 0 is never read, since reaching it would
// mean a claim named that step, which policyAt rejects first.
const NO_POLICY_CAP = 0;

const initialStateOf = (
  policies: readonly (QuoteStep | undefined)[],
): ScenarioState => ({
  results: [],
  remainingCaps: policies.map((policy) =>
    policy === undefined ? NO_POLICY_CAP : policyCapOf(policy.items),
  ),
});

const capsAfterClaim = (
  remainingCaps: readonly number[],
  policy: number,
  remainingCap: number,
): readonly number[] =>
  remainingCaps.map((cap, index) => (index === policy ? remainingCap : cap));

const stateAfterQuote = (
  state: ScenarioState,
  result: QuoteResult,
): ScenarioState => ({ ...state, results: [...state.results, result] });

const stateAfterClaim = (
  state: ScenarioState,
  step: ClaimStep,
  result: ClaimResult,
): ScenarioState => ({
  results: [...state.results, result],
  remainingCaps: capsAfterClaim(
    state.remainingCaps,
    step.policy,
    result.remainingCap,
  ),
});

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = policyByStepIndex(scenario.steps);

  const { results } = scenario.steps.reduce(
    (state, step, stepIndex) =>
      isQuoteStep(step)
        ? stateAfterQuote(
            state,
            quoteResultOf(
              step,
              scenario.customer,
              quoteCountBefore(scenario.steps, stepIndex),
            ),
          )
        : stateAfterClaim(
            state,
            step,
            claimResultOf(step, policies, state.remainingCaps[step.policy]),
          ),
    initialStateOf(policies),
  );

  return { results };
};
