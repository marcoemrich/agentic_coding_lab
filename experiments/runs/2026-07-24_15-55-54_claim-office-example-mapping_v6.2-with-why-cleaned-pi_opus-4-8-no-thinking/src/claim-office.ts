export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
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

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface ScenarioResult {
  results: unknown[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// Absorbs floating-point noise so that mathematically-whole totals are not
// pushed across an integer boundary by rounding.
const ROUNDING_EPSILON = 1e-9;

// Premiums are rounded up in MHPCO's favor. The epsilon absorbs floating-point
// noise so that mathematically-whole totals are not pushed to the next integer.
const roundUpInFavorOfMHPCO = (amount: number): number =>
  Math.ceil(amount - ROUNDING_EPSILON);

// Payouts are rounded down in MHPCO's favor. The epsilon absorbs floating-point
// noise so that mathematically-whole amounts are not pushed to the lower integer.
const roundDownInFavorOfMHPCO = (amount: number): number =>
  Math.floor(amount + ROUNDING_EPSILON);

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

// Every quoted item must have a type MHPCO recognises; an unknown type is a
// rejected quote.
const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];

const sumBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

// A building block is offered only when there are EXACTLY BLOCK_SIZE alike
// (same-type) components; otherwise items are priced individually at their own
// base premiums. "Alike" means the same component type. Grouping all items by
// type in a single pass keeps the block rule in one place: a group qualifies
// for the block price only when it is a component type of exactly BLOCK_SIZE.
const qualifiesForBlock = (group: Item[]): boolean =>
  group.length === BLOCK_SIZE && isComponent(group[0]);

const groupBasePremium = (group: Item[]): number =>
  qualifiesForBlock(group) ? BLOCK_BASE_PREMIUM : sumBasePremiums(group);

const baseTotalForItems = (items: Item[]): number =>
  groupByType(items).reduce(
    (total, group) => total + groupBasePremium(group),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Each risk modifier is a rate applied to the item's base premium, gated by a
// condition. Modelling them as a list keeps every surcharge rule in one place
// and makes the total an additive sum of the applicable rates.
const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const SURCHARGE_RULES: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: isCursed, rate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_RATE },
];

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  return SURCHARGE_RULES.filter((rule) => rule.applies(item)).reduce(
    (surcharge, rule) => surcharge + base * rule.rate,
    0,
  );
};

// Item-level surcharges are risk modifiers charged per item (e.g. the curse
// surcharge). Summing them here mirrors baseTotalForItems so quotePremium can
// read as a set of independently-named, additive policy components.
const surchargeTotalForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

// Everything needed to evaluate policy-wide modifiers for one quote: the
// customer plus whether this is a follow-up (any quote after the customer's
// first in the scenario).
interface QuoteContext {
  customer: Customer;
  isFollowUp: boolean;
}

// Policy-wide modifiers are rates applied to the whole policy's base total,
// gated by a condition on the quote context. A positive rate is a surcharge, a
// negative rate a discount. Modelling them as a list (mirroring
// SURCHARGE_RULES) keeps every policy-level rule in one place and makes the
// total an additive sum of the applicable rates.
const POLICY_MODIFIER_RULES: {
  applies: (context: QuoteContext) => boolean;
  rate: number;
}[] = [
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE },
  { applies: (c) => isLongStanding(c.customer), rate: -LOYALTY_DISCOUNT_RATE },
  { applies: (c) => c.isFollowUp, rate: -FOLLOW_UP_DISCOUNT_RATE },
];

const policyModifierTotal = (baseTotal: number, context: QuoteContext): number =>
  POLICY_MODIFIER_RULES.filter((rule) => rule.applies(context)).reduce(
    (total, rule) => total + baseTotal * rule.rate,
    0,
  );

const quotePremium = (items: Item[], context: QuoteContext): number => {
  const baseTotal = baseTotalForItems(items);
  const itemSurcharges = surchargeTotalForItems(items);
  const policyModifiers = policyModifierTotal(baseTotal, context);
  return roundUpInFavorOfMHPCO(
    baseTotal + itemSurcharges + policyModifiers + PROCESSING_FEE,
  );
};

// A quote both prices the policy and records its claim cap (twice the
// insurance sum) keyed by the step's position, so later claims can draw down
// against it. The insured items are stored so claims can look up per-item
// reimbursement clauses (enchantment level, material).
interface Policy {
  remainingCap: number;
  items: Item[];
}

const processQuote = (
  step: QuoteStep,
  index: number,
  scenario: Scenario,
  policies: Policy[],
): unknown => {
  validateItemTypes(step.items);
  policies[index] = {
    remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
    items: step.items,
  };
  return {
    premium: quotePremium(step.items, {
      customer: scenario.customer,
      isFollowUp: index > 0,
    }),
  };
};

// Damage to a highly-enchanted item (level >= 8) is reimbursed at half.
// Named as a predicate to mirror isHighlyEnchanted / isCursed and keep the
// payout clause readable in one place.
const qualifiesForHalfPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

// The reimbursement for a single damage: the half-payout clause (if it
// applies) is charged first, then the deductible applies once per damage.
const damagePayout = (damage: Damage, insuredItem: Item): number => {
  const reimbursed = qualifiesForHalfPayout(insuredItem)
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;
  return reimbursed - DEDUCTIBLE;
};

// The insured item a damage refers to, matched by type. The non-null
// assertion is a known gap: a future error-handling test (claim references an
// item not in the policy) will replace it with a real check. Isolating the
// lookup here keeps that gap in one findable place.
const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

// Counts how many elements fall under each type key. Shared by the claim
// validity check so the insured-items tally and the damages tally are built
// the same way from a single, named place.
const countByType = <T>(elements: T[], typeOf: (element: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const element of elements) {
    const type = typeOf(element);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

// A damage amount is money owed to the customer; a negative amount is nonsense
// and rejects the claim.
const validateDamageAmounts = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount ${damage.amount} must not be negative`);
    }
  }
};

// For every item type, a claim must not report more damages than the policy
// actually covers of that type. Each damage entry is a separate event against a
// distinct insured item.
const validateDamageCounts = (incident: Incident, policy: Policy): void => {
  const insuredCountByType = countByType(policy.items, (item) => item.type);
  const damagedCountByType = countByType(
    incident.damages,
    (damage) => damage.itemType,
  );
  for (const [type, damaged] of damagedCountByType) {
    const insured = insuredCountByType.get(type) ?? 0;
    if (damaged > insured) {
      throw new Error(
        `claim reports ${damaged} damage(s) of type "${type}" but the policy covers ${insured}`,
      );
    }
  }
};

// A claim is valid only when every damage amount is sane and no item type is
// over-claimed against the policy's coverage.
const validateClaim = (incident: Incident, policy: Policy): void => {
  validateDamageAmounts(incident);
  validateDamageCounts(incident, policy);
};

// Each damage is reimbursed against its matching insured item; the payout is
// their sum, rounded down in MHPCO's favor.
const claimPayout = (incident: Incident, policy: Policy): number =>
  roundDownInFavorOfMHPCO(
    incident.damages.reduce(
      (sum, damage) => sum + damagePayout(damage, insuredItemFor(damage, policy)),
      0,
    ),
  );

// A claim draws its payout down from the referenced policy's remaining cap and
// reports both figures.
const processClaim = (step: ClaimStep, policies: Policy[]): unknown => {
  const policy = policies[step.policy];
  validateClaim(step.incident, policy);
  const desiredPayout = claimPayout(step.incident, policy);
  // The total payout per policy is capped at the remaining cap; the desired
  // payout is reduced to whatever cap is left.
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index): unknown =>
    step.op === "quote"
      ? processQuote(step, index, scenario, policies)
      : processClaim(step, policies),
  );
  return { results };
};
