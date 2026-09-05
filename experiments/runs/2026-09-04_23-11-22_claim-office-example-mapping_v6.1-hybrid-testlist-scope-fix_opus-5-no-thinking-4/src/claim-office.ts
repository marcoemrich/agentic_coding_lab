export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

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

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Result = QuoteResult | ClaimResult;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResult {
  results: Result[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// What a single item of each type is worth to the MHPCO: what it costs to
// insure, and what it is insured for. Keeping the two figures side by side
// makes this the one place that says which item types exist at all.
interface ItemTypeRates {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_TYPE_RATES: Record<string, ItemTypeRates> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

// The MHPCO's price list is closed: anything not on it cannot be insured.
const ratesFor = (type: string): ItemTypeRates => {
  const rates = ITEM_TYPE_RATES[type];
  if (rates === undefined) {
    throw new Error(`the MHPCO does not insure items of type ${type}`);
  }
  return rates;
};

const unitBasePremium = (type: string): number => ratesFor(type).basePremium;

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

// A building block of 3 alike components is offered at a special base premium.
const basePremiumForItemGroup = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * unitBasePremium(type);

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForItemGroup(type, count),
    0,
  );

// Premium-side enchantment rule (threshold 5), distinct from the claim-side
// reduced-reimbursement rule (threshold 8).
const qualifiesForHighEnchantmentSurcharge = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (qualifiesForHighEnchantmentSurcharge(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

// Item-specific modifiers apply to the affected item's own base premium, i.e.
// the unit price of its type — a block discount never shrinks a surcharge.
const itemSurcharge = (item: Item): number =>
  unitBasePremium(item.type) * surchargeRate(item);

const itemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

// Policy-wide modifiers apply to the policy base premium only — never to the
// item surcharges. Net signed delta: a discount can outweigh the surcharge.
// Every quote is a first insurance for its items, regardless of customer
// history, so that surcharge always applies.
const policyAdjustmentRate = (
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (isLongStanding(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUpContract ? FOLLOW_UP_DISCOUNT_RATE : 0);

// Premiums round up, in the MHPCO's favour — once, over the whole sum, so
// intermediate amounts stay fractional. Rounding each term as it is computed
// would give a different answer: a base of 85 at a net rate of −10 % is
// 85 − 8.5 + 5 = 81.5 → 82, where rounding the −8.5 to −9 first yields 81.
//
// The policy adjustment is a signed rate applied to the base as its own term
// (`base + base * rate`) rather than a scale factor (`base * (1 + rate)`).
// Both express the same arithmetic, but the summed form avoids the rounding
// error a factor can carry: 100 * 1.1 === 110.00000000000001, while
// 100 + 100 * 0.1 === 110 exactly.
const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const base = policyBasePremium(items);
  return Math.ceil(
    base +
      itemSurcharges(items) +
      base * policyAdjustmentRate(customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

const unitInsuranceValue = (type: string): number =>
  ratesFor(type).insuranceValue;

// The total payout per policy is capped at twice the insurance sum. Premium
// modifiers never reach the insurance sum: it is the plain sum of the unit
// values of the insured items.
const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + unitInsuranceValue(item.type), 0);

// A policy created by a quote step, tracked so later claims can pay out
// against it. `remainingCap` shrinks as successive claims are settled.
interface Policy {
  items: Item[];
  remainingCap: number;
}

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

// State accumulated by the steps run so far. Later steps price and pay out
// against what earlier steps established, so each step reads the state it was
// run with and returns the state the next step should see.
interface ScenarioState {
  customer: Customer;
  contractsSoFar: number;
  // Keyed by the zero-based index of the quote step that created the policy.
  policies: Map<number, Policy>;
}

// A step's outcome: what to report, and how the scenario stands afterwards.
interface StepOutcome {
  result: Result;
  state: ScenarioState;
}

// Records a policy against the step index that identifies it, leaving the
// state it was given untouched.
const withPolicy = (
  state: ScenarioState,
  policyId: number,
  policy: Policy,
): ScenarioState => ({
  ...state,
  policies: new Map(state.policies).set(policyId, policy),
});

const quote = (
  step: QuoteStep,
  state: ScenarioState,
  stepIndex: number,
): StepOutcome => ({
  result: {
    premium: quotePremium(step.items, state.customer, state.contractsSoFar > 0),
  },
  state: withPolicy(
    { ...state, contractsSoFar: state.contractsSoFar + 1 },
    stepIndex,
    openPolicy(step.items),
  ),
});

// Claim-side enchantment rule (threshold 8), distinct from the premium-side
// high-enchantment surcharge (threshold 5).
const qualifiesForReducedReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD;

// Damage to heavily enchanted items is reimbursed at 50 % of the damage amount.
//
// The spec's other claim rule — "damage to items made of dragon material is
// fully reimbursed" — needs no code here, and its absence is not an oversight.
// Full reimbursement is already the default for items no clause applies to, so
// the dragon rule can only bite where it overrides something; and in the one
// case where the two compete (dragon material at enchantment >= 8) the spec
// gives the 50 % rule priority. Under the current rules no input distinguishes
// an implementation that reads `material` from one that ignores it, which is
// why `Item.material` is carried in the schema but never consulted. Adding any
// further clause that reimburses below 100 % would change that: dragon material
// would then have something to override, and this would need real code.
const reimbursementRate = (item: Item): number =>
  qualifiesForReducedReimbursement(item) ? REDUCED_REIMBURSEMENT_RATE : 1;

// A damage entry together with the specific insured item it was matched to.
interface MatchedDamage {
  damage: Damage;
  item: Item;
}

// What a single damage entry entitles the claimant to, before the policy-wide
// cap is applied. A deductible applies per damage event, i.e. once per damaged
// item. Special clauses reduce the reimbursement first; the deductible comes
// off after.
//
// A damage smaller than the deductible yields a negative entitlement. The
// payout as a whole is floored at zero in `settleAgainstCap`, so a claim never
// bills the claimant, but this per-damage figure stays signed.
//
// UNSPECIFIED: whether such a damage should offset the others in the same
// claim. Because the entitlement stays signed, a 500 G and a 50 G damage
// currently pay 350 rather than 400. The spec's examples are all well above
// the deductible, so nothing pins this; flooring here instead of per claim
// would pick the other reading. Left signed rather than guessing.
const damageEntitlement = ({ damage, item }: MatchedDamage): number =>
  damage.amount * reimbursementRate(item) - DEDUCTIBLE;

// Pairs each damage entry with a distinct insured item of the same type: two
// damages to "sword" refer to two different insured swords, not the same one
// twice. Instances of a type are consumed in the order they were insured.
const matchDamagesToItems = (
  insuredItems: Item[],
  damages: Damage[],
): MatchedDamage[] => {
  const unclaimed = [...insuredItems];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`the policy does not cover a damaged ${damage.itemType}`);
    }
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

// Reading a policy the scenario never opened is a programming error rather
// than a claimant's mistake, so this says so plainly instead of asserting the
// lookup succeeded and failing later with an incidental TypeError. Validating
// the claim step's policy index against the scenario is a separate concern,
// still to be specified.
const policyFor = (state: ScenarioState, policyId: number): Policy => {
  const policy = state.policies.get(policyId);
  if (policy === undefined) {
    throw new Error(`there is no policy ${policyId}`);
  }
  return policy;
};

// The MHPCO does not reimburse a negative loss.
const rejectNegativeAmounts = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(
      `damage amount ${negative.amount} for ${negative.itemType} is negative`,
    );
  }
};

// What the matched damages entitle the claimant to, before the policy-wide cap.
const claimEntitlement = (matchedDamages: MatchedDamage[]): number =>
  matchedDamages.reduce(
    (total, matched) => total + damageEntitlement(matched),
    0,
  );

// The total payout per policy is capped: a claim gets at most what is left of
// the cap, and whatever it takes is no longer available to later claims. Both
// figures are derived here so they cannot drift apart.
const settleAgainstCap = (
  entitlement: number,
  remainingCap: number,
): ClaimResult => {
  // Payouts round down, in the MHPCO's favour: an entitlement of 350.5 pays
  // 350. The floor is applied to the entitlement, which is the only fractional
  // input here — `remainingCap` is always whole, starting at twice the
  // insurance sum and only ever losing whole payouts.
  //
  // Clamped to zero at the bottom as well as to the cap at the top: damages
  // under the deductible must not bill the claimant, nor hand the policy back
  // cap it had already spent.
  const payout = Math.max(0, Math.min(Math.floor(entitlement), remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};

const claim = (step: ClaimStep, state: ScenarioState): StepOutcome => {
  const policy = policyFor(state, step.policy);
  rejectNegativeAmounts(step.incident.damages);
  const matchedDamages = matchDamagesToItems(
    policy.items,
    step.incident.damages,
  );
  const result = settleAgainstCap(
    claimEntitlement(matchedDamages),
    policy.remainingCap,
  );
  return {
    result,
    state: withPolicy(state, step.policy, {
      ...policy,
      remainingCap: result.remainingCap,
    }),
  };
};

const runStep = (
  step: Step,
  state: ScenarioState,
  stepIndex: number,
): StepOutcome => {
  switch (step.op) {
    case "quote":
      return quote(step, state, stepIndex);
    case "claim":
      return claim(step, state);
  }
};

// Where a scenario stands before any of its steps have run.
const initialState = (customer: Customer): ScenarioState => ({
  customer,
  contractsSoFar: 0,
  policies: new Map(),
});

// The scenario part-way through: the results reported so far, and the state
// the next step will be run against.
interface ScenarioProgress {
  results: Result[];
  state: ScenarioState;
}

// Each step is priced against the state the steps before it established, so
// the walk is sequential: fold the steps, threading the state from one to the
// next and collecting one result per step. The results array therefore mirrors
// the input steps in length and order.
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const finalProgress = scenario.steps.reduce<ScenarioProgress>(
    (progress, step, stepIndex) => {
      const outcome = runStep(step, progress.state, stepIndex);
      return {
        results: [...progress.results, outcome.result],
        state: outcome.state,
      };
    },
    { results: [], state: initialState(scenario.customer) },
  );
  return { results: finalProgress.results };
};
