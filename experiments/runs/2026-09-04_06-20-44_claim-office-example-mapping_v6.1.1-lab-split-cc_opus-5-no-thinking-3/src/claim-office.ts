export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const BASE_PREMIUMS = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

type KnownItemType = keyof typeof BASE_PREMIUMS;

const isKnownItemType = (itemType: string): itemType is KnownItemType =>
  itemType in BASE_PREMIUMS;

const basePremiumOf = (itemType: string): number => {
  if (!isKnownItemType(itemType)) {
    throw new Error(`the MHPCO does not insure items of type "${itemType}"`);
  }
  return BASE_PREMIUMS[itemType];
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

// Counts occurrences of each item type. The parameter is structural rather
// than `Item[]` so callers need only supply the field this actually reads.
const countsByType = (things: { type: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const { type } of things) counts.set(type, (counts.get(type) ?? 0) + 1);
  return counts;
};

const basePremiumForGroup = (itemType: string, count: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * basePremiumOf(itemType);
};

const policyBasePremiumOf = (items: Item[]): number =>
  [...countsByType(items)].reduce(
    (total, [itemType, count]) => total + basePremiumForGroup(itemType, count),
    0,
  );

const CURSE_SURCHARGE = 0.5;

const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurchargeRateOf = (item: Item): number => {
  const curse = item.cursed ? CURSE_SURCHARGE : 0;
  const enchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + enchantment;
};

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce((total, item) => total + basePremiumOf(item.type) * itemSurchargeRateOf(item), 0);

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

const loyaltyRateOf = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? -LOYALTY_DISCOUNT : 0;

const FOLLOW_UP_DISCOUNT = 0.15;

// `contractOrdinal` is zero-based: the customer's first contract in the
// scenario is 0 and carries no follow-up discount.
const followUpRateOf = (contractOrdinal: number): number =>
  contractOrdinal > 0 ? -FOLLOW_UP_DISCOUNT : 0;

// The policy-scoped rate is the sum of every modifier that scales the policy
// base premium. Each addend names one rule from the spec.
const policyModifierRateOf = (customer: Customer, contractOrdinal: number): number =>
  FIRST_INSURANCE_SURCHARGE + loyaltyRateOf(customer) + followUpRateOf(contractOrdinal);

const premiumFor = (quote: QuoteStep, customer: Customer, contractOrdinal: number): number => {
  const policyBase = policyBasePremiumOf(quote.items);
  // Policy-scoped modifiers apply to the policy base only; item-scoped
  // surcharges are added afterwards and never widen that base.
  const policyModifiers = policyBase * policyModifierRateOf(customer, contractOrdinal);
  return Math.ceil(
    policyBase + itemSurchargesOf(quote.items) + policyModifiers + PROCESSING_FEE,
  );
};

// Every value here is currently 10× the matching base premium, but that is a
// coincidence of the current rate card, not a rule the spec states. Deriving
// these as `base * 10` would encode the coincidence and have to be undone the
// first time one type's insurance value moves independently, so the two tables
// stay separate. What they *do* share — the set of insurable types — is
// factored out via `KnownItemType` and `isKnownItemType`.
const INSURANCE_VALUES = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const satisfies Record<string, number>;

// Mirrors `basePremiumOf`: an uninsurable type has no insurance value either.
// Unreachable via `runScenario` today — `premiumFor` validates every item type
// in a quote before `openPolicy` computes the cap — but the guard keeps the
// two lookups honest independently of that call order, and stops an unknown
// type from silently reaching the cap arithmetic as `undefined`.
const insuranceValueOf = (itemType: string): number => {
  if (!isKnownItemType(itemType)) {
    throw new Error(`the MHPCO does not insure items of type "${itemType}"`);
  }
  return INSURANCE_VALUES[itemType];
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

const openPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLE };
};

const FULL_REIMBURSEMENT = 1;
const HALVED_REIMBURSEMENT = 0.5;
// Distinct from HIGH_ENCHANTMENT_THRESHOLD (5), which drives the *premium*
// surcharge. Enchantment 5–7 costs more to insure but is still reimbursed in
// full; only from 8 up is the payout halved.
const HALVED_REIMBURSEMENT_THRESHOLD = 8;

const reimbursementRateOf = (item: Item): number =>
  (item.enchantment ?? 0) >= HALVED_REIMBURSEMENT_THRESHOLD
    ? HALVED_REIMBURSEMENT
    : FULL_REIMBURSEMENT;

// The deductible is withheld once per damage entry, not once per claim.
// This is what the entry *earns*, before the policy cap has any say — hence
// "owed" rather than "payout", which this codebase reserves for the final
// settled figure in `ClaimResult`.
const owedForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateOf(item) - DEDUCTIBLE;

// The insured item a damage entry refers to. The non-null assertion is safe
// because `rejectOverclaimedTypes` runs first and rejects any damage type the
// policy does not insure in at least the claimed quantity: a type absent from
// the policy has an insured count of 0, so any damage naming it is already
// rejected as overclaimed. That guard therefore covers both "item not part of
// the policy" and "unknown item type" — an unknown type is simply one no
// policy can contain. By the time this runs, a match is guaranteed to exist.
const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const owedForClaim = (claim: ClaimStep, policy: Policy): number =>
  claim.incident.damages.reduce(
    (total, damage) => total + owedForDamage(damage, insuredItemFor(damage, policy)),
    0,
  );

// Mutates the policy: the cap is drawn down by what was actually paid, so a
// later claim against the same policy sees the reduced remainder.
const drawDownCap = (policy: Policy, payout: number): number =>
  (policy.remainingCap -= payout);

// A policy covers a fixed set of items, so a claim may not report more
// damages of a type than it insures. The whole claim is rejected.
const rejectOverclaimedTypes = (claim: ClaimStep, policy: Policy): void => {
  const insuredCounts = countsByType(policy.items);
  const claimedCounts = countsByType(
    claim.incident.damages.map(({ itemType }) => ({ type: itemType })),
  );
  for (const [itemType, claimed] of claimedCounts) {
    const insured = insuredCounts.get(itemType) ?? 0;
    if (claimed > insured) {
      throw new Error(
        `claim reports ${claimed} ${itemType} damages but the policy insures ${insured}`,
      );
    }
  }
};

// A damage is an amount of harm suffered; a negative one is nonsense and
// would otherwise pay a negative sum and refund the policy's cap.
const rejectNegativeAmounts = (claim: ClaimStep): void => {
  for (const damage of claim.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage to a ${damage.itemType} cannot be negative (${damage.amount})`);
    }
  }
};

const settleClaim = (claim: ClaimStep, policy: Policy): ClaimResult => {
  // Both guards must precede the settling below, and not only to keep the cap
  // unmutated on a rejected claim: `insuredItemFor` relies on
  // `rejectOverclaimedTypes` having already ruled out damage types the policy
  // does not insure. Reordering these would turn a clear error into a crash.
  rejectNegativeAmounts(claim);
  rejectOverclaimedTypes(claim, policy);
  // Rounded down in the MHPCO's favour *before* the draw-down, so the
  // remaining cap stays whole. The policy never pays beyond its cap, so a
  // claim owed more than the remainder is reduced to it.
  const owed = Math.floor(owedForClaim(claim, policy));
  const payout = Math.min(owed, policy.remainingCap);
  return { payout, remainingCap: drawDownCap(policy, payout) };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  // Counts the quote steps seen so far. Only quotes open a contract, so this
  // deliberately tracks the customer's contracts rather than the step index —
  // a claim step between two quotes must not advance the ordinal.
  let contractsSoFar = 0;
  const policies = new Map<number, Policy>();

  // A claim names the policy it settles against by the zero-based step index
  // of the quote that opened it. An index that never opened a policy — a
  // forward reference, another claim, or simply out of range — is rejected
  // here so it reads as a domain error rather than crashing on `undefined`
  // deeper in `settleClaim`.
  const policyFor = (claim: ClaimStep): Policy => {
    const policy = policies.get(claim.policy);
    if (!policy) {
      throw new Error(`step ${claim.policy} did not open a policy to claim against`);
    }
    return policy;
  };

  const resultOf = (step: Step, index: number): StepResult => {
    if (step.op === "claim") {
      return settleClaim(step, policyFor(step));
    }
    const premium = premiumFor(step, scenario.customer, contractsSoFar);
    contractsSoFar += 1;
    policies.set(index, openPolicy(step.items));
    return { premium };
  };

  return { results: scenario.steps.map(resultOf) };
};
