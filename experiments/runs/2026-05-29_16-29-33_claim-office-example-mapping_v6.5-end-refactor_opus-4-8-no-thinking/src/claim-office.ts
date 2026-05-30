interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const FIRST_INSURANCE_SURCHARGE = 1.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownType = (type: string): boolean => type in BASE_PREMIUM || COMPONENT_TYPES.has(type);

const sum = (values: number[]): number => values.reduce((acc, value) => acc + value, 0);

// Base premium of a single item (main item or one component).
const itemBase = (item: Item): number =>
  isComponent(item) ? COMPONENT_PREMIUM : (BASE_PREMIUM[item.type] ?? 0);

// A surcharge adds `rate` of the base premium for each affected item.
const surchargeFor = (items: Item[], affects: (item: Item) => boolean, rate: number): number =>
  sum(items.filter(affects).map((item) => rate * itemBase(item)));

// Curse adds 50% of the affected item's base premium.
const curseSurcharge = (items: Item[]): number =>
  surchargeFor(items, (item) => item.cursed === true, CURSE_SURCHARGE_RATE);

// High enchantment (level >= 5) adds 30% of the affected item's base premium.
const enchantmentSurcharge = (items: Item[]): number =>
  surchargeFor(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );

// Base premium for `count` alike components: a group of exactly 3 forms a
// block at COMPONENT_BLOCK_PREMIUM; otherwise each component costs
// COMPONENT_PREMIUM.
const componentGroupPremium = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

// Count how many alike components of each type appear (e.g. { rune: 2 }).
const countByType = (items: Item[]): Map<string, number> =>
  items.reduce((counts, item) => {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

const mainItemsPremium = (items: Item[]): number =>
  sum(items.filter((item) => !isComponent(item)).map(itemBase));

const componentsPremium = (items: Item[]): number =>
  sum([...countByType(items.filter(isComponent)).values()].map(componentGroupPremium));

const basePremium = (items: Item[]): number =>
  mainItemsPremium(items) + componentsPremium(items);

// Insurance value of a single item (main item or one component).
const insuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : (INSURANCE_VALUE[item.type] ?? 0);

// Snap away floating-point noise (e.g. 197.5000000001) by rounding to 6
// decimal places, so a subsequent ceil/floor lands on the intended whole G.
const FLOAT_GUARD_PRECISION = 1e6;
const snapFloat = (value: number): number =>
  Math.round(value * FLOAT_GUARD_PRECISION) / FLOAT_GUARD_PRECISION;

// Round up to a whole number in MHPCO's favour.
const roundUpToWhole = (value: number): number => Math.ceil(snapFloat(value));

// Round a payout down to whole G, in MHPCO's favour.
const roundDownToWhole = (value: number): number => Math.floor(snapFloat(value));

// A policy-wide discount takes `rate` of the policy base when it applies.
const discount = (applies: boolean, rate: number, base: number): number =>
  applies ? rate * base : 0;

// Long-standing customers (>= 2 years) receive 20% off the policy base.
const loyaltyDiscount = (base: number, yearsWithMHPCO: number): number =>
  discount(yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, LOYALTY_DISCOUNT_RATE, base);

// Every quote after the customer's first receives 15% off the policy base.
const followUpDiscount = (base: number, isFollowUp: boolean): number =>
  discount(isFollowUp, FOLLOWUP_DISCOUNT_RATE, base);

// Reject a quote that includes any item MHPCO does not insure.
const assertKnownTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownType(item.type));
  if (unknown) {
    throw new Error(`unknown item type: ${unknown.type}`);
  }
};

// Premium for one quote: base premium plus the first-insurance surcharge,
// item-specific curse/enchantment surcharges, less the policy-wide loyalty
// and follow-up discounts, and the flat processing fee.
const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  assertKnownTypes(items);
  const base = basePremium(items);
  return (
    base * FIRST_INSURANCE_SURCHARGE +
    curseSurcharge(items) +
    enchantmentSurcharge(items) -
    loyaltyDiscount(base, yearsWithMHPCO) -
    followUpDiscount(base, isFollowUp) +
    PROCESSING_FEE
  );
};

// Reimbursable amount for damage to one item: halved for highly enchanted
// items (>= 8), otherwise the full damage amount.
const reimbursement = (item: Item, amount: number): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT
    ? HALF_REIMBURSEMENT_RATE * amount
    : amount;

// Payout for one damage event: reimbursement less the per-event deductible.
// A negative damage amount is invalid and rejected.
const damagePayout = (item: Item, damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
  return Math.max(0, reimbursement(item, damage.amount) - DEDUCTIBLE);
};

// Pair each damage with a distinct policy item of the same type, consuming that
// item so it can back only one damage. A damage with no remaining matching item
// (not insured, or more damages of a type than the policy covers) is rejected.
const pairDamagesWithItems = (policy: Item[], damages: Damage[]): [Item, Damage][] => {
  const available = [...policy];
  return damages.map((damage): [Item, Damage] => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`damaged item not in policy: ${damage.itemType}`);
    }
    const [item] = available.splice(index, 1);
    return [item, damage];
  });
};

// Total cap for a policy: twice the sum of its items' insurance values.
const policyCap = (policy: Item[]): number => CAP_MULTIPLIER * sum(policy.map(insuranceValue));

// Payout for a claim against a policy with `remainingCap` left: the desired
// reimbursement (per-damage, deductible applied) limited to the remaining cap.
const claimResult = (
  policy: Item[],
  incident: Incident,
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  const pairs = pairDamagesWithItems(policy, incident.damages);
  const desired = roundDownToWhole(
    sum(pairs.map(([item, damage]) => damagePayout(item, damage))),
  );
  const payout = Math.min(desired, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

// What MHPCO remembers about each policy it has quoted: the insured items and
// how much of the claim cap is still available.
interface Policy {
  items: Item[];
  remainingCap: number;
}

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const { yearsWithMHPCO } = scenario.customer;
  const policiesByStep: Record<number, Policy> = {};
  let quotesSeen = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policiesByStep[step.policy];
      const result = claimResult(policy.items, step.incident, policy.remainingCap);
      policy.remainingCap = result.remainingCap;
      return result;
    }
    const isFollowUp = quotesSeen > 0;
    quotesSeen += 1;
    policiesByStep[index] = { items: step.items, remainingCap: policyCap(step.items) };
    return { premium: roundUpToWhole(quotePremium(step.items, yearsWithMHPCO, isFollowUp)) };
  });
  return { results };
};
