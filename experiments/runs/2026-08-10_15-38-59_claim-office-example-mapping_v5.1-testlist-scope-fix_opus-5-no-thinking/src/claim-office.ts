export interface Scenario {
  customer: { yearsWithMHPCO: number };
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

export interface ScenarioOutput {
  results: Result[];
}

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE = 0.1;

/** Every component is insured and priced alike, whatever its kind. */
const COMPONENT = { insuranceValue: 250, basePremium: 25 };

/** The MHPCO price list: insurance value and base premium per item type. */
const PRICE_LIST: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

/** Premiums round up: the MHPCO's favour is the larger amount. */
const roundPremium = Math.ceil;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function priceOf(type: string): { insuranceValue: number; basePremium: number } {
  const price = PRICE_LIST[type];
  if (price === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return price;
}

function basePremiumOf(type: string): number {
  return priceOf(type).basePremium;
}

/**
 * Base premium for all items of one type, honouring the block discount.
 * The type is validated first so that unknown types are rejected even when
 * they would take the flat-rate block branch.
 */
function typeBasePremium(type: string, count: number): number {
  const itemBase = basePremiumOf(type);
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * itemBase;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

/**
 * Item-specific risk surcharges, each a share of the affected item's own base
 * premium. Both apply when an item is cursed and highly enchanted.
 */
function itemSurcharges(item: Item): number {
  const itemBase = basePremiumOf(item.type);
  const curse = item.cursed ? itemBase * CURSE_SURCHARGE : 0;
  const highEnchantment = isHighlyEnchanted(item) ? itemBase * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + highEnchantment;
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

/**
 * Net rate of the policy-wide modifiers, all applied to the policy base
 * premium. Every quote counts as a first insurance, whatever the customer's
 * history.
 */
function policyModifierRate(customer: Scenario["customer"], previousQuotes: number): number {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? -LOYALTY_DISCOUNT : 0;
  const followUp = previousQuotes > 0 ? -FOLLOW_UP_DISCOUNT : 0;
  return FIRST_INSURANCE_SURCHARGE + loyalty + followUp;
}

function quotePremium(
  items: Item[],
  customer: Scenario["customer"],
  previousQuotes: number,
): number {
  const policyBasePremium = [...countByType(items)].reduce(
    (sum, [type, count]) => sum + typeBasePremium(type, count),
    0,
  );
  const surcharges = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  // Policy-wide modifiers apply to the policy base premium — the sum of the
  // item base premiums, before any item-specific surcharges.
  const policyModifiers = policyModifierRate(customer, previousQuotes) * policyBasePremium;
  return roundPremium(policyBasePremium + surcharges + policyModifiers + PROCESSING_FEE);
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

/** Payouts round down: the MHPCO's favour is the smaller amount. */
const roundPayout = Math.floor;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceOf(item.type).insuranceValue, 0);
}

const HALF_PAYOUT_ENCHANTMENT = 8;
const HALF_PAYOUT_RATE = 0.5;

/** Share of a damage amount the MHPCO reimburses before the deductible. */
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= HALF_PAYOUT_ENCHANTMENT ? HALF_PAYOUT_RATE : 1;
}

function damagePayout(item: Item, amount: number): number {
  return Math.max(0, amount * reimbursementRate(item) - DEDUCTIBLE);
}

/**
 * Validates each damage and pairs it with a distinct insured item: a policy
 * covering one sword cannot pay out twice for "the sword". Throws on a
 * negative amount or a damage with no insured item left to match.
 */
function resolveDamages(policy: Policy, damages: Damage[]): { item: Item; amount: number }[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must not be negative: ${damage.amount}`);
    }
    const index = unclaimed.findIndex((insured) => insured.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Policy does not insure a damaged ${damage.itemType}`);
    }
    return { item: unclaimed.splice(index, 1)[0], amount: damage.amount };
  });
}

function settleClaim(policy: Policy, incident: Incident): Result {
  // Resolved up front: an unmatched damage rejects the whole claim, unpaid.
  const matched = resolveDamages(policy, incident.damages);
  const desired = matched.reduce((sum, { item, amount }) => sum + damagePayout(item, amount), 0);
  // The policy pays out at most twice the insurance sum over its lifetime.
  // The cap is reduced by what is actually paid, so both figures stay integral.
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function policyFrom(policies: Map<number, Policy>, step: ClaimStep): Policy {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Claim refers to step ${step.policy}, which is not a policy`);
  }
  return policy;
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  // The follow-up discount counts earlier quotes, not earlier steps, so this
  // cannot be replaced by the step index once claim steps exist.
  let quotesSoFar = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(settleClaim(policyFrom(policies, step), step.incident));
    } else {
      results.push({ premium: quotePremium(step.items, scenario.customer, quotesSoFar) });
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLE,
      });
      quotesSoFar += 1;
    }
  });

  return { results };
}
