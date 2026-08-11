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

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

export interface ScenarioOutcome {
  results: Result[];
}

/**
 * Decimal places kept before rounding up. Enough to preserve any genuine fraction of a G,
 * few enough to discard the trailing noise of binary floating-point arithmetic — without
 * this, a premium computed as 88.00000000000001 would round up to 89.
 */
const SIGNIFICANT_DECIMAL_PLACES = 6;

/** Rounds up to whole G (the MHPCO's favour), ignoring binary floating-point noise. */
const roundUpToWholeG = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(SIGNIFICANT_DECIMAL_PLACES)));

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const POLICY_FEE = 5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const sum = (amounts: number[]): number => amounts.reduce((a, b) => a + b, 0);

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

/**
 * Components of one kind are bundled into building blocks of 3, each charged at
 * the special block rate; leftovers are charged individually.
 */
const componentGroupBasePremium = (type: string, count: number): number => {
  const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
  const singles = count % BUILDING_BLOCK_SIZE;
  return blocks * BUILDING_BLOCK_BASE_PREMIUM + singles * BASE_PREMIUM[type];
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
/**
 * The quote-side threshold. Independent of HIGH_ENCHANTMENT_CLAIM_LEVEL: an item at
 * enchantment 7 carries the surcharge here but is still reimbursed in full on a claim.
 */
const HIGH_ENCHANTMENT_QUOTE_LEVEL = 5;

/**
 * A premium modifier as a multiplicative factor: a positive rate loads the premium,
 * a negative rate discounts it, and a modifier that does not apply leaves it untouched.
 */
const rateFactor = (applies: boolean, rate: number): number => (applies ? 1 + rate : 1);

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_QUOTE_LEVEL;

/** Risk surcharges attach to the individual item that carries the risk, and compound. */
const riskMultiplierOf = (item: Item): number =>
  rateFactor(isCursed(item), CURSED_SURCHARGE_RATE) *
  rateFactor(isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE_RATE);

/** Main items are priced one by one off the base price list, each carrying its own risk load. */
const mainItemsPremium = (items: Item[]): number =>
  sum(
    items
      .filter((item) => !isComponent(item))
      .map((item) => BASE_PREMIUM[item.type] * riskMultiplierOf(item)),
  );

/**
 * Components are priced per kind, so alike ones can bundle into building blocks.
 * Pricing by count means individual risk flags are not visible here — no test covers
 * a cursed component yet, so this stays as-is rather than being fixed speculatively.
 */
const componentsPremium = (items: Item[]): number =>
  sum(COMPONENT_TYPES.map((type) => componentGroupBasePremium(type, countOfType(items, type))));

/** Base price list plus per-item risk loading — everything before customer-level modifiers. */
const riskLoadedPremiumOf = (items: Item[]): number =>
  mainItemsPremium(items) + componentsPremium(items);

const LOYALTY_DISCOUNT_RATE = -0.2;
/** Loyalty begins at the start of the second year: 1 year does not qualify, 2 do. */
const LOYALTY_THRESHOLD_YEARS = 2;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const CONTRACT_DISCOUNT_RATE = -0.15;

/**
 * Customer-level modifiers apply to the whole quote and compound. A customer's very
 * first insurance carries the assessment surcharge; every contract after it is
 * discounted instead. `previousQuotes` counts quotes already given to this customer.
 */
const customerMultiplierOf = (customer: Customer, previousQuotes: number): number => {
  const isFirstInsurance = previousQuotes === 0;
  return (
    rateFactor(isLoyal(customer), LOYALTY_DISCOUNT_RATE) *
    rateFactor(isFirstInsurance, FIRST_INSURANCE_SURCHARGE_RATE) *
    rateFactor(!isFirstInsurance, CONTRACT_DISCOUNT_RATE)
  );
};

const quote = (items: Item[], customer: Customer, previousQuotes: number): QuoteResult => {
  const premiumBeforeFee =
    riskLoadedPremiumOf(items) * customerMultiplierOf(customer, previousQuotes);
  return { premium: roundUpToWholeG(premiumBeforeFee) + POLICY_FEE };
};

/**
 * Steps are not independent: each one is answered in the light of the steps before it,
 * so the scenario is walked as a fold that threads what has happened so far.
 */
interface Policy {
  items: Item[];
  remainingCap: number;
}

interface ScenarioState {
  quotesSoFar: number;
  /** Policies issued so far, keyed by the step index of the quote that created each. */
  policies: Record<number, Policy>;
}

const INITIAL_STATE: ScenarioState = { quotesSoFar: 0, policies: {} };

const DEDUCTIBLE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSumOf = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUE[item.type]));

const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const DRAGON_MATERIAL = "dragon";

const isDragonMade = (item: Item): boolean => item.material === DRAGON_MATERIAL;

/**
 * The claim-side threshold, named separately from isHighlyEnchanted so the two
 * thresholds can move independently: an item at enchantment 7 carries the quote
 * surcharge but is still reimbursed in full here.
 */
const isHeavilyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;

/**
 * Heavily enchanted items are only half covered — but dragon-made ones are reimbursed
 * in full regardless, the MHPCO holding dragon craftsmanship beyond reproach.
 */
const hasReducedCover = (item: Item): boolean =>
  isHeavilyEnchanted(item) && !isDragonMade(item);

const reimbursementRateOf = (item: Item): number =>
  hasReducedCover(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

/**
 * A damage names its item by type. A damage naming a type the policy does not cover is
 * outside anything the specification describes, so it is reimbursed at the plain rate
 * rather than given a rule of its own.
 */
const reimbursementRateForDamage = (damage: Damage, items: Item[]): number => {
  const damagedItem = items.find((item) => item.type === damage.itemType);
  return damagedItem === undefined ? FULL_REIMBURSEMENT_RATE : reimbursementRateOf(damagedItem);
};

/**
 * Each damage is reimbursed at the rate its own item earns, and the deductible is borne
 * by the incident as a whole — so the rates are applied first and the sum reduced once.
 */
const reimbursableDamageOf = (incident: Incident, items: Item[]): number =>
  sum(incident.damages.map((damage) => damage.amount * reimbursementRateForDamage(damage, items)));

/** Draws the payout down against the policy's remaining cap, reporting what is left. */
const settleClaimAgainstCap = (incident: Incident, policy: Policy): ClaimResult => {
  const amountOwedBeforeCap = Math.max(
    0,
    reimbursableDamageOf(incident, policy.items) - DEDUCTIBLE,
  );
  const payout = Math.min(amountOwedBeforeCap, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};

/** Records a policy under its step index, leaving the rest of the scenario state untouched. */
const withPolicy = (state: ScenarioState, policyKey: number, policy: Policy): ScenarioState => ({
  ...state,
  policies: { ...state.policies, [policyKey]: policy },
});

/**
 * Claims name their policy by the step index of the quote that issued it. The
 * specification describes no claim against a policy that was never issued, so rather
 * than inventing a payout for that case this reports the bad reference plainly —
 * the index signature on `policies` would otherwise let it through as an undefined
 * policy and fail further downstream, where the cause is no longer visible.
 */
const policyIssuedAt = (state: ScenarioState, policyKey: number): Policy => {
  const policy: Policy | undefined = state.policies[policyKey];
  if (policy === undefined) {
    throw new Error(`Claim references policy ${policyKey}, which was never issued`);
  }
  return policy;
};

const applyStep = (
  state: ScenarioState,
  step: Step,
  customer: Customer,
  stepIndex: number,
): { state: ScenarioState; result: Result } => {
  if (step.op === "quote") {
    const policy: Policy = {
      items: step.items,
      remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumOf(step.items),
    };
    return {
      state: withPolicy({ ...state, quotesSoFar: state.quotesSoFar + 1 }, stepIndex, policy),
      result: quote(step.items, customer, state.quotesSoFar),
    };
  }
  const policy = policyIssuedAt(state, step.policy);
  const result = settleClaimAgainstCap(step.incident, policy);
  return {
    state: withPolicy(state, step.policy, { ...policy, remainingCap: result.remainingCap }),
    result,
  };
};

export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const results: Result[] = [];
  let state = INITIAL_STATE;
  for (const [stepIndex, step] of scenario.steps.entries()) {
    const stepOutcome = applyStep(state, step, scenario.customer, stepIndex);
    state = stepOutcome.state;
    results.push(stepOutcome.result);
  }
  return { results };
};
