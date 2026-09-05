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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  /** Zero-based index of the quote step that created the policy. */
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResults {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

/**
 * Amounts are held as fractions until the end, so the last digits can carry
 * binary-floating-point noise. Rounding a value like 115.00000000000001 up to
 * 116 would be wrong, so that noise is discarded first.
 */
const SIGNIFICANT_DIGITS = 6;

/** Premiums are rounded up (in the MHPCO's favour), ignoring float noise. */
const roundUp = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(SIGNIFICANT_DIGITS)));

/** The two rates the tariff sets for each item type. */
interface ItemTariff {
  basePremium: number;
  insuranceValue: number;
}

/** The item types the MHPCO insures. Any other type is unknown to the tariff. */
const TARIFF: Record<string, ItemTariff> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const STRONG_ENCHANTMENT_THRESHOLD = 8;
const STRONG_ENCHANTMENT_REIMBURSEMENT = 0.5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponent = (type: string): boolean => COMPONENT_TYPES.includes(type);

/** How often each type occurs, for pricing alike items and matching damages. */
const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();

  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return counts;
};

const itemTypes = (items: Item[]): string[] => items.map((item) => item.type);

const damagedTypes = (incident: Incident): string[] =>
  incident.damages.map((damage) => damage.itemType);

/** Exactly BLOCK_SIZE alike components form a building block. */
const formsBuildingBlock = (type: string, count: number): boolean =>
  isComponent(type) && count === BLOCK_SIZE;

const tariffFor = (type: string): ItemTariff => {
  const tariff = TARIFF[type];

  if (tariff === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }

  return tariff;
};

const itemBasePremium = (type: string): number => tariffFor(type).basePremium;

const itemInsuranceValue = (type: string): number => tariffFor(type).insuranceValue;

/** Alike items are priced together so a building block can be recognised. */
const groupBasePremium = (type: string, count: number): number =>
  formsBuildingBlock(type, count)
    ? BLOCK_BASE_PREMIUM
    : count * itemBasePremium(type);

/** The policy base premium is the sum of the base premiums of its items. */
const policyBasePremium = (items: Item[]): number =>
  [...countByType(itemTypes(items))].reduce(
    (total, [type, count]) => total + groupBasePremium(type, count),
    0,
  );

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

/**
 * Item-specific surcharges stack additively, as fractions of the item's base
 * premium.
 */
const itemSurchargeRate = (item: Item): number =>
  (isCursed(item) ? CURSE_SURCHARGE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);

/**
 * Item-specific modifiers apply to the base premium of the affected item,
 * not to the policy total.
 */
const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + itemBasePremium(item.type) * itemSurchargeRate(item),
    0,
  );

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

/**
 * Policy-wide modifiers, as fractions of the policy base premium. Each is an
 * amount added to (or, when negative, subtracted from) that base premium, so
 * modifiers stack additively rather than compounding.
 */
const policyModifierRates = (
  customer: Customer,
  isFollowUpContract: boolean,
): number[] => [
  FIRST_INSURANCE_SURCHARGE,
  isLoyalCustomer(customer) ? -LOYALTY_DISCOUNT : 0,
  isFollowUpContract ? -FOLLOW_UP_CONTRACT_DISCOUNT : 0,
];

const policyModifiers = (
  basePremium: number,
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  policyModifierRates(customer, isFollowUpContract).reduce(
    (total, rate) => total + basePremium * rate,
    0,
  );

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const basePremium = policyBasePremium(step.items);

  return roundUp(
    basePremium +
      itemSurcharges(step.items) +
      policyModifiers(basePremium, customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

/**
 * Every contract after the customer's first is a follow-up. Only quote steps
 * create contracts, so this counts preceding quotes rather than preceding steps.
 */
const isFollowUpContract = (precedingSteps: Step[]): boolean =>
  precedingSteps.some((step) => step.op === "quote");

/** Payouts are rounded down (in the MHPCO's favour), ignoring float noise. */
const roundDown = (amount: number): number =>
  Math.floor(Number(amount.toFixed(SIGNIFICANT_DIGITS)));

/** The insurance sum is the sum of the items' insurance values. */
const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + itemInsuranceValue(item.type), 0);

const isStronglyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= STRONG_ENCHANTMENT_THRESHOLD;

/**
 * The reimbursement clauses decide how much of the damage is reimbursed,
 * before the deductible is applied.
 */
const reimbursementRate = (item: Item): number =>
  isStronglyEnchanted(item) ? STRONG_ENCHANTMENT_REIMBURSEMENT : 1;

const damagePayout = (damage: Damage, item: Item): number => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }

  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
};

/** A policy pays out at most CAP_MULTIPLIER times its insurance sum. */
const policyCap = (policy: QuoteStep): number =>
  insuranceSum(policy.items) * CAP_MULTIPLIER;

/** The insured item a damage entry refers to, matched by item type. */
const damagedItem = (damage: Damage, items: Item[]): Item => {
  const item = items.find((insured) => insured.type === damage.itemType);

  if (item === undefined) {
    throw new Error(`item not covered by the policy: ${damage.itemType}`);
  }

  return item;
};

/**
 * A damage entry stands for one damaged item, so a type cannot be damaged more
 * often than the policy covers it. The whole claim is rejected if it is.
 */
const rejectExcessDamages = (incident: Incident, items: Item[]): void => {
  const insured = countByType(itemTypes(items));

  for (const [type, damaged] of countByType(damagedTypes(incident))) {
    if (damaged > (insured.get(type) ?? 0)) {
      throw new Error(`more ${type} damages than the policy covers`);
    }
  }
};

const incidentPayout = (incident: Incident, items: Item[]): number =>
  roundDown(
    incident.damages.reduce(
      (total, damage) => total + damagePayout(damage, damagedItem(damage, items)),
      0,
    ),
  );

/** The payout is limited to what remains of the policy's cap. */
const claimResult = (
  incident: Incident,
  policy: QuoteStep,
  remainingCap: number,
): ClaimResult => {
  rejectExcessDamages(incident, policy.items);

  const payout = Math.min(incidentPayout(incident, policy.items), remainingCap);

  return { payout, remainingCap: remainingCap - payout };
};

/**
 * A scenario is walked step by step, because a claim draws on what earlier
 * claims left of its policy's cap. The caps of the policies quoted so far are
 * the only state carried from one step to the next.
 */
type RemainingCaps = Map<number, number>;

const quoteStepResult = (
  step: QuoteStep,
  index: number,
  scenario: Scenario,
  remainingCaps: RemainingCaps,
): QuoteResult => {
  remainingCaps.set(index, policyCap(step));

  return {
    premium: quotePremium(
      step,
      scenario.customer,
      isFollowUpContract(scenario.steps.slice(0, index)),
    ),
  };
};

/** A claim draws on a policy, so its step index must name an earlier quote. */
const policyFor = (step: ClaimStep, scenario: Scenario): QuoteStep => {
  const quoted = scenario.steps[step.policy];

  if (quoted === undefined || quoted.op !== "quote") {
    throw new Error(`claim does not refer to a policy: step ${step.policy}`);
  }

  return quoted;
};

const claimStepResult = (
  step: ClaimStep,
  scenario: Scenario,
  remainingCaps: RemainingCaps,
): ClaimResult => {
  const policy = policyFor(step, scenario);
  const result = claimResult(
    step.incident,
    policy,
    remainingCaps.get(step.policy) ?? policyCap(policy),
  );

  remainingCaps.set(step.policy, result.remainingCap);

  return result;
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const remainingCaps: RemainingCaps = new Map();

  return {
    results: scenario.steps.map((step, index) =>
      step.op === "quote"
        ? quoteStepResult(step, index, scenario, remainingCaps)
        : claimStepResult(step, scenario, remainingCaps),
    ),
  };
};
