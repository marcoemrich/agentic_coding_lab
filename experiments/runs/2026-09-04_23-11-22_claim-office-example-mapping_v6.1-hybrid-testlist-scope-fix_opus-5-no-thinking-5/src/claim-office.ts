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

export interface ScenarioOutput {
  results: unknown[];
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

/** The MHPCO insures exactly these item types; anything else is unknown. */
interface ItemTypeTerms {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_TYPES: Record<string, ItemTypeTerms | undefined> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const termsOfType = (type: string): ItemTypeTerms => {
  const terms = ITEM_TYPES[type];
  if (terms === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return terms;
};

const basePremiumOfType = (type: string): number => termsOfType(type).basePremium;

const CURSE_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;

/** An item without an enchantment counts as enchantment 0. */
const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isCursed = (item: Item): boolean => item.cursed === true;

const qualifiesForEnchantmentSurcharge = (item: Item): boolean =>
  enchantmentOf(item) >= ENCHANTMENT_SURCHARGE_LEVEL;

/** Item-specific modifiers apply to the base premium of the affected item only. */
const itemSurchargesOf = (item: Item): number => {
  const basePremium = basePremiumOfType(item.type);
  const curseSurcharge = isCursed(item) ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = qualifiesForEnchantmentSurcharge(item)
    ? basePremium * ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (type: string): boolean => COMPONENT_TYPES.has(type);

/** Tallies anything identified by a type — insured items or damage entries alike. */
const countByType = <T>(values: T[], typeOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const type = typeOf(value);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const typeOfItem = (item: Item): string => item.type;
const typeOfDamage = (damage: Damage): string => damage.itemType;

/**
 * Items of one type are normally priced individually. The exception is
 * components: exactly 3 alike ones form a "building block" priced as a unit.
 */
const typeGroupPremium = (type: string, count: number): number =>
  isComponent(type) && count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * basePremiumOfType(type);

const policyBasePremiumOf = (items: Item[]): number =>
  [...countByType(items, typeOfItem)].reduce(
    (sum, [type, count]) => sum + typeGroupPremium(type, count),
    0,
  );

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

/** What the policy-wide modifiers are judged against, beyond the items themselves. */
interface QuoteContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

/**
 * Policy-wide modifiers are signed rates charged against the policy base
 * premium: surcharges positive, discounts negative.
 */
const policyModifierRateFor = (context: QuoteContext): number =>
  INITIAL_ASSESSMENT_SURCHARGE_RATE -
  (isLongStanding(context.customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (context.isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

const itemSurchargesOfAll = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargesOf(item), 0);

/**
 * Intermediate amounts are kept as exact fractions; only the total is rounded,
 * up, in the MHPCO's favour.
 */
const premiumFor = (items: Item[], context: QuoteContext): number => {
  const policyBasePremium = policyBasePremiumOf(items);
  const policyModifiers = policyBasePremium * policyModifierRateFor(context);
  return Math.ceil(
    policyBasePremium + itemSurchargesOfAll(items) + policyModifiers + PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + termsOfType(item.type).insuranceValue, 0);

/** A policy created by a quote step, tracked so later claims can draw on it. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

/** The most a policy will ever pay out, across all claims against it. */
const capFor = (items: Item[]): number => insuranceSumOf(items) * CAP_MULTIPLIER;

const openPolicyFor = (items: Item[]): Policy => ({ items, remainingCap: capFor(items) });

const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

/** Judged against its own threshold, higher than ENCHANTMENT_SURCHARGE_LEVEL. */
const qualifiesForReducedReimbursement = (insuredItem: Item): boolean =>
  enchantmentOf(insuredItem) >= REDUCED_REIMBURSEMENT_LEVEL;

/** The share of the damage the MHPCO reimburses, before the deductible. */
const reimbursementRateFor = (insuredItem: Item): number =>
  qualifiesForReducedReimbursement(insuredItem) ? REDUCED_REIMBURSEMENT_RATE : 1;

const payoutForDamage = (damage: Damage, insuredItem: Item): number => {
  if (damage.amount < 0) {
    throw new Error(`damage amount must not be negative: ${String(damage.amount)}`);
  }
  return damage.amount * reimbursementRateFor(insuredItem) - DEDUCTIBLE;
};

/**
 * The insured item a damage entry draws on. Callers must have cleared the
 * damages through rejectDamagesBeyondInsuredCount first, which guarantees a
 * match exists; the guard here only discharges that promise for the compiler.
 */
const insuredItemFor = (damage: Damage, policy: Policy): Item => {
  const insuredItem = policy.items.find((item) => item.type === damage.itemType);
  if (insuredItem === undefined) {
    throw new Error(`claim references uninsured item type ${damage.itemType}`);
  }
  return insuredItem;
};

interface Settlement {
  payout: number;
  remainingCap: number;
}

/**
 * A policy covering N items of a type answers for at most N damage entries of
 * it — a second broken sword is not covered by a policy insuring only one.
 * This also rejects types the policy does not cover at all (0 insured).
 */
const rejectDamagesBeyondInsuredCount = (damages: Damage[], policy: Policy): void => {
  const insuredCounts = countByType(policy.items, typeOfItem);
  const damagedCounts = countByType(damages, typeOfDamage);

  for (const [type, damaged] of damagedCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (damaged > insured) {
      throw new Error(
        `claim damages ${String(damaged)} ${type}(s) but only ${String(insured)} insured`,
      );
    }
  }
};

/**
 * Draws against the policy's remaining cap, which it depletes.
 * Rounded down, in the MHPCO's favour.
 */
const settleClaim = (step: ClaimStep, policy: Policy): Settlement => {
  rejectDamagesBeyondInsuredCount(step.incident.damages, policy);

  const claimed = step.incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, insuredItemFor(damage, policy)),
    0,
  );
  const payout = Math.floor(Math.min(claimed, policy.remainingCap));

  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const policyReferencedBy = (step: ClaimStep, policies: Map<number, Policy>): Policy => {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`claim references unknown policy at step ${String(step.policy)}`);
  }
  return policy;
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const policies = new Map<number, Policy>();

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return settleClaim(step, policyReferencedBy(step, policies));
    }

    // Every quote but the first is a follow-up contract for this customer.
    const isFollowUpContract = policies.size > 0;
    policies.set(stepIndex, openPolicyFor(step.items));

    return {
      premium: premiumFor(step.items, { customer: scenario.customer, isFollowUpContract }),
    };
  });

  return { results };
};
