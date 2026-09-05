export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  /**
   * Zero-based index into `Scenario.steps` of the quote step that created the
   * policy — not a policy id. The field name is fixed by the input schema;
   * `policy: 0` means "the policy quoted by steps[0]".
   */
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const sumBy = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Both per-item money tables are keyed by item type and reject an unknown type
// the same way, rather than letting `undefined` poison a sum with NaN. Shared so
// the rejection is stated once; the tables themselves stay separate (see
// INSURANCE_VALUE_BY_TYPE).
const amountForType = (
  item: Item,
  amountByType: Record<string, number>,
): number => {
  const amount = amountByType[item.type];
  if (amount === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
  }
  return amount;
};

const itemBasePremium = (item: Item): number =>
  amountForType(item, BASE_PREMIUM_BY_TYPE);

const BLOCK_SIZE = 3;

const BLOCK_BASE_PREMIUM = 60;

// A block of exactly 3 alike items is priced as a unit. The block branch skips
// itemBasePremium, but quotePremium's surcharge pass calls it on every item, so
// an unknown type is still rejected — three broomsticks fail there, not here.
const basePremiumForSameTypeItems = (items: Item[]): number =>
  items.length === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : sumBy(items, itemBasePremium);

const sameTypeGroups = (items: Item[]): Item[][] => {
  const groupsByType = new Map<string, Item[]>();
  for (const item of items) {
    const group = groupsByType.get(item.type) ?? [];
    group.push(item);
    groupsByType.set(item.type, group);
  }
  return [...groupsByType.values()];
};

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_LEVEL = 5;

const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

interface SurchargeRule {
  appliesTo: (item: Item) => boolean;
  rate: number;
}

const SURCHARGE_RULES: SurchargeRule[] = [
  {
    appliesTo: (item) => item.cursed === true,
    rate: CURSE_SURCHARGE_RATE,
  },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemSurchargeRate = (item: Item): number =>
  sumBy(
    SURCHARGE_RULES.filter((rule) => rule.appliesTo(item)),
    (rule) => rule.rate,
  );

const itemSurcharge = (item: Item): number =>
  itemBasePremium(item) * itemSurchargeRate(item);

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const PROCESSING_FEE = 5;

const LOYALTY_YEARS = 2;

const LOYALTY_DISCOUNT_RATE = 0.2;

const loyaltyDiscountRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? -LOYALTY_DISCOUNT_RATE : 0;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const followUpContractDiscountRate = (precedingContracts: number): number =>
  precedingContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;

// Policy-wide modifiers are rates applied to the policy base premium.
// Surcharges are positive rates, discounts negative ones.
const policyModifierRate = (
  customer: Customer,
  precedingContracts: number,
): number =>
  FIRST_INSURANCE_SURCHARGE_RATE +
  loyaltyDiscountRate(customer) +
  followUpContractDiscountRate(precedingContracts);

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  precedingContracts: number,
): number => {
  const policyBasePremium = sumBy(
    sameTypeGroups(step.items),
    basePremiumForSameTypeItems,
  );
  const itemSurcharges = sumBy(step.items, itemSurcharge);
  // Keep this as `base + base * rate`. Factoring it to `base * (1 + rate)`
  // introduces IEEE-754 drift that is always upward (e.g. base 180 at rate 0.1
  // gives 198.00000000000003 instead of 198), and Math.ceil below turns any
  // such drift into a full extra G. Sword + staff would quote 204, not 203.
  const policyModifierAmount =
    policyBasePremium * policyModifierRate(customer, precedingContracts);
  // Rounded in the MHPCO's favour; only the final premium is rounded.
  return Math.ceil(
    policyBasePremium + itemSurcharges + policyModifierAmount + PROCESSING_FEE,
  );
};

// Deliberately kept separate from BASE_PREMIUM_BY_TYPE. The two tables share a
// key domain but not a fact: an item's base premium and its insurance value are
// independent numbers the spec states separately. Merging them into one
// catalogue would couple them in the reader's mind for no gain.
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

// The unknown-type rejection is reachable from here, not just theoretical: a
// claim whose `policy` points forward at a not-yet-priced quote reaches the cap
// calculation before quotePremium has vetted that quote's items.
const itemInsuranceValue = (item: Item): number =>
  amountForType(item, INSURANCE_VALUE_BY_TYPE);

// The block discount affects the premium only, never the insurance sum.
const insuranceSum = (policy: QuoteStep): number =>
  sumBy(policy.items, itemInsuranceValue);

const DEDUCTIBLE = 100;

const CAP_MULTIPLE = 2;

const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;

const REDUCED_REIMBURSEMENT_RATE = 0.5;

const FULL_REIMBURSEMENT_RATE = 1;

// Named for the trigger (enchantment level), to keep it distinct from the
// premium-side HIGH_ENCHANTMENT_LEVEL, which is a different threshold (5).
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// The deductible is withheld once per damage entry, not once per incident,
// and applies after any reimbursement clause has reduced the amount.
// Clamped per entry, not on the total: a damage smaller than the deductible
// yields nothing, but must not eat into another damage's reimbursement.
const payableForDamage = (damage: Damage, item: Item): number => {
  const reimbursement = damage.amount * reimbursementRate(item);
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

// Which insured item a damage entry refers to. Callers run
// rejectOverClaimedTypes first, which already rejects any type the policy does
// not cover (insured count 0 < damaged count), so the `undefined` branch is
// unreachable in practice — it is a guard on the declared return type, keeping
// this function total rather than relying on that ordering from a distance.
const insuredItemFor = (damage: Damage, policy: QuoteStep): Item => {
  const insured = policy.items.find((item) => item.type === damage.itemType);
  if (insured === undefined) {
    throw new Error(
      `The policy does not cover an item of type "${damage.itemType}"`,
    );
  }
  return insured;
};

// Kept separate from sameTypeGroups, which groups the items themselves and
// discards the type key. This one needs the key, to look a type up; that one
// needs the members, to price a block. Merging them would distort whichever
// call site did not ask for the shape.
const countByType = <T>(
  values: T[],
  typeOf: (value: T) => string,
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const type = typeOf(value);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

// Distinct from the zero-clamp in payableForDamage: that handles a legitimate
// damage too small to clear the deductible, whereas a negative amount is not a
// damage at all.
const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(
        `A damage amount cannot be negative, but the claim reports ${damage.amount}`,
      );
    }
  }
};

// A damage entry is one damaged item, so a type cannot be damaged more times
// than the policy insures it. Checked per type across the whole incident before
// any settlement, because the spec rejects the claim as a whole.
const rejectOverClaimedTypes = (damages: Damage[], policy: QuoteStep): void => {
  const insuredCounts = countByType(policy.items, (item) => item.type);
  for (const [type, damagedCount] of countByType(
    damages,
    (damage) => damage.itemType,
  )) {
    if (damagedCount > (insuredCounts.get(type) ?? 0)) {
      throw new Error(
        `The policy covers fewer items of type "${type}" than the claim reports damaged`,
      );
    }
  }
};

const policyCap = (policy: QuoteStep): number =>
  insuranceSum(policy) * CAP_MULTIPLE;

// `step.policy` is an index into the scenario's own steps, so a malformed
// scenario can point it out of range or at another claim. Resolving it here
// turns both into the same kind of domain error every other bad input gets,
// rather than a TypeError downstream on `undefined.items`.
const policyReferencedBy = (step: ClaimStep, steps: Step[]): QuoteStep => {
  const referenced = steps[step.policy];
  if (referenced === undefined || referenced.op !== "quote") {
    throw new Error(
      `A claim must reference a quote step, but step ${step.policy} is not one`,
    );
  }
  return referenced;
};

// The cap is a per-policy budget: a claim pays out at most what is left of it.
const settleClaim = (
  step: ClaimStep,
  policy: QuoteStep,
  capRemaining: number,
): ClaimResult => {
  rejectNegativeAmounts(step.incident.damages);
  rejectOverClaimedTypes(step.incident.damages, policy);
  const payable = sumBy(step.incident.damages, (damage) =>
    payableForDamage(damage, insuredItemFor(damage, policy)),
  );
  // Rounded in the MHPCO's favour — down, the opposite of the premium's
  // Math.ceil. Only the final payout is rounded, and the cap is decremented by
  // the rounded figure so the remaining cap stays in whole G.
  const payout = Math.floor(Math.min(payable, capRemaining));
  return { payout, remainingCap: capRemaining - payout };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  const capRemainingByPolicy = new Map<number, number>();
  // Only quote steps conclude a contract, so this cannot be derived from the
  // step index: a claim step must not earn the next quote its follow-up
  // discount. Incremented after pricing, so during a quote it holds the number
  // of contracts concluded *before* that quote — hence `preceding`.
  let precedingContracts = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push({
        premium: quotePremium(step, scenario.customer, precedingContracts),
      });
      precedingContracts += 1;
    } else {
      const policy = policyReferencedBy(step, scenario.steps);
      const capRemaining =
        capRemainingByPolicy.get(step.policy) ?? policyCap(policy);
      const result = settleClaim(step, policy, capRemaining);
      capRemainingByPolicy.set(step.policy, result.remainingCap);
      results.push(result);
    }
  }
  return { results };
};
