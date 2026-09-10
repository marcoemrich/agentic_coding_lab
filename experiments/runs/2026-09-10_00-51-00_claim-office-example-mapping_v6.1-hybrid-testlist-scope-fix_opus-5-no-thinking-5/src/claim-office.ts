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

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

/** The two rates the office quotes an item from. */
interface ItemRates {
  basePremium: number;
  insuranceValue: number;
}

/**
 * The insurable item types, each with the two rates the office quotes from: the
 * per-item base premium and the insured value the payout cap derives from. One
 * table so a new item type cannot be added with only half its rates.
 */
const ITEM_RATES: Record<string, ItemRates> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

/** The office insures only the types in its price list; anything else is refused. */
const ratesFor = (type: string): ItemRates => {
  const rates = ITEM_RATES[type];
  if (!rates) throw new Error(`The MHPCO does not insure items of type "${type}"`);
  return rates;
};

/** Premiums round in the MHPCO's favour: always up. */
const roundPremium = (premium: number): number => Math.ceil(premium);

/**
 * Exactly this many items of one type form a "building block", priced at a flat
 * rate instead of per item. A larger group is NOT a block -- 4 runes pay 4x25 G.
 */
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** How many items of each type the policy covers -- the unit the block rule applies to. */
const countItemsPerType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const groupBasePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * ratesFor(type).basePremium;

const policyBasePremium = (items: Item[]): number =>
  [...countItemsPerType(items)].reduce(
    (total, [type, count]) => total + groupBasePremium(type, count),
    0,
  );

/** A customer with AT LEAST this many years of business is long-standing. */
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

/** Every contract after the customer's first in a scenario is a follow-up. */
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const CURSE_SURCHARGE_RATE = 0.5;

/**
 * The premium's enchantment threshold: an enchantment AT this level or above is
 * "high" and carries a surcharge -- level 4 does not. Distinct from the claim
 * side's HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL, which is a different rule at a
 * different level; the two thresholds move independently.
 */
const SURCHARGED_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

/**
 * An item with no recorded enchantment is unenchanted -- level 0. Both the
 * premium and the claim side compare against a threshold, so both need this
 * default; it lives here once so the two cannot drift apart.
 */
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

/** Item-scoped surcharges stack additively: a cursed, highly enchanted item pays both. */
const itemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (enchantmentLevel(item) >= SURCHARGED_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

/** Item-scoped surcharges apply to the affected item's own base premium. */
const itemSurchargeTotal = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + ratesFor(item.type).basePremium * itemSurchargeRate(item),
    0,
  );

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

/**
 * Policy-scoped modifiers apply to the policy base premium, never to item
 * surcharges. They stack additively, like the item-scoped ones: the
 * first-insurance surcharge adds, the loyalty and follow-up discounts
 * subtract, each computed against the untouched policy base.
 *
 * Returns the modifier AMOUNT, not a multiplier on the base. Folding this into
 * `policyBase * (1 + rate)` is algebraically identical but NOT identical in
 * floating point: 100 * 1.1 is 110.00000000000001, which `roundPremium` ceils
 * to 111 G. Keeping base and modifier as separate addends keeps the exact
 * values the spec's worked examples expect.
 */
const policyModifierTotal = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number =>
  policyBase * FIRST_INSURANCE_SURCHARGE_RATE -
  (isLongStanding(customer) ? policyBase * LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0);

const quote = (items: Item[], customer: Customer, isFollowUp: boolean): Result => {
  const policyBase = policyBasePremium(items);
  return {
    premium: roundPremium(
      policyBase +
        policyModifierTotal(policyBase, customer, isFollowUp) +
        itemSurchargeTotal(items) +
        PROCESSING_FEE,
    ),
  };
};

/**
 * A quote is a follow-up contract if any contract preceded it in the scenario.
 * Counting the quote steps that precede a step -- rather than reading the step
 * index -- keeps the rule correct once claims become steps too, since a claim
 * is not a contract and must not make the next quote a follow-up.
 */
const isFollowUpContract = (precedingSteps: Step[]): boolean =>
  precedingSteps.some((step) => step.op === "quote");

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

/**
 * The insured value of everything the policy covers -- the base the cap derives
 * from. Deliberately per item: the block discount and every other premium
 * modifier change what the customer PAYS, never what the office INSURES, so a
 * policy of a sword and a 3-rune block still sums 1000 + 3x250 = 1750 G.
 */
const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ratesFor(item.type).insuranceValue, 0);

/** A policy remembers the items it covers and how much of its cap is available. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

/**
 * A claim names its policy by the index of the quote step that created it, so
 * the office keeps quoted policies under that same index.
 */
type PolicyRegister = Map<number, Policy>;

const openPolicy = (register: PolicyRegister, quoteStepIndex: number, items: Item[]): void => {
  register.set(quoteStepIndex, {
    items,
    remainingCap: insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
  });
};

const policyFor = (register: PolicyRegister, quoteStepIndex: number): Policy => {
  const policy = register.get(quoteStepIndex);
  if (!policy) throw new Error(`No policy created by step ${quoteStepIndex}`);
  return policy;
};

/** Payouts round in the MHPCO's favour: always down. */
const roundPayout = (payout: number): number => Math.floor(payout);

/**
 * The claim's enchantment threshold: damage to an item AT this level or above is
 * only half reimbursed. Distinct from the premium side's
 * SURCHARGED_ENCHANTMENT_LEVEL -- a different rule at a different level.
 */
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

/** How much of a damage the policy reimburses, before the deductible. */
const reimbursementRate = (item: Item): number =>
  enchantmentLevel(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

/**
 * Claims one insured item of the type a damage entry names, REMOVING it from the
 * pool so no later entry can claim it again. A damage entry names only a type,
 * never which item of that type it hit, so any unclaimed item of the type will
 * do -- every item of a type shares the rates a reimbursement depends on, so the
 * choice among them cannot change a payout. What matters is only that each entry
 * consumes one, which is what makes "more damage entries of a type than the
 * policy covers" run the pool dry and be refused.
 *
 * An entry naming a type with no unclaimed item left is refused: the office pays
 * only for what it insured, once each. This one guard also refuses an entry of a
 * type the office does not insure at all -- an uninsurable type can never be
 * among a policy's items, so "not covered" is already the whole truth about it
 * and needs no separate check against ITEM_RATES.
 */
const takeInsuredItemFor = (unclaimed: Item[], damage: Damage): Item => {
  const at = unclaimed.findIndex((item) => item.type === damage.itemType);
  if (at < 0) {
    throw new Error(`The policy does not cover another item of type "${damage.itemType}"`);
  }
  return unclaimed.splice(at, 1)[0];
};

/**
 * An incident reports what a damage COST, so a negative amount is not a small
 * claim -- it is a malformed entry, and the office refuses the whole claim
 * rather than reading it as a reversal or silently treating it as zero.
 */
const requireReportableAmount = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
  }
  return damage.amount;
};

/**
 * What one damage entry earns: the insured item it hit sets the reimbursement
 * rate, and each entry carries its own deductible. A deductible larger than the
 * reimbursed damage earns nothing -- it never turns into a charge.
 */
const reimbursementForDamage = (damage: Damage, insuredItem: Item): number =>
  Math.max(
    requireReportableAmount(damage) * reimbursementRate(insuredItem) - DEDUCTIBLE_PER_DAMAGE,
    0,
  );

/**
 * What an incident earns against the items a policy covers, before the cap:
 * every damage entry it lists, reimbursed and summed.
 *
 * The entries share one pool of unclaimed items, so each entry is matched to a
 * DISTINCT insured item. The pool is a copy taken per incident, never the
 * policy's own list: claiming an item exhausts it for this incident only, and a
 * later claim against the same policy starts from every item again.
 */
const reimbursementForIncident = (incident: Incident, insuredItems: Item[]): number => {
  const unclaimed = [...insuredItems];
  return incident.damages.reduce((total, damage) => {
    const insuredItem = takeInsuredItemFor(unclaimed, damage);
    return total + reimbursementForDamage(damage, insuredItem);
  }, 0);
};

/**
 * Pays what the incident earns, drawn from the policy's remaining cap: a claim
 * may exhaust that cap but never overdraw it. This is the single point where a
 * policy's remaining cap changes.
 */
const claim = (incident: Incident, policy: Policy): Result => {
  const claimed = reimbursementForIncident(incident, policy.items);
  const payout = roundPayout(Math.min(claimed, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

/** Every step produces exactly one result: a quote opens a policy, a claim draws on one. */
export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const policies: PolicyRegister = new Map();

  const runStep = (step: Step, stepIndex: number): Result => {
    if (step.op === "claim") return claim(step.incident, policyFor(policies, step.policy));
    openPolicy(policies, stepIndex, step.items);
    return quote(
      step.items,
      scenario.customer,
      isFollowUpContract(scenario.steps.slice(0, stepIndex)),
    );
  };

  return { results: scenario.steps.map(runStep) };
};
