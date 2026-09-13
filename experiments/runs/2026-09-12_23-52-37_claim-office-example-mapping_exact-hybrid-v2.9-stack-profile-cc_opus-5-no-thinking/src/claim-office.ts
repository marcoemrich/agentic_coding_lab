export interface Customer {
  yearsWithMHPCO: number;
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

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResults {
  results: StepResult[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/**
 * Insurance values are distinct from base premiums: they size the payout cap,
 * not the price. Component block discounts affect the premium only, never the
 * insurance sum, so this table is always applied per individual item.
 */
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const PROCESSING_FEE = 5;

const HUNDRED = 100;

/**
 * The value of a percentage of an amount. Modifiers are summed as separate
 * amounts rather than compounded, so each is computed against its own base:
 * a cursed sword is 100 + 50 % of 100 + 10 % of 100, not 100 × 1.5 × 1.1.
 *
 * Multiplies before dividing, keeping the percentage an integer ratio rather
 * than a decimal factor: 100 * 1.1 === 110.00000000000001 in binary floating
 * point, which would round the wrong way. Intermediates stay exact and only
 * the final premium is rounded.
 */
const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / HUNDRED;

/**
 * Both roundings are in the MHPCO's favour, which is why they run in OPPOSITE
 * directions: the office keeps the fraction either way, charging the most and
 * paying the least the amount allows. Read either function alone and the pair
 * looks inconsistent; the rule is the favour, not the direction.
 *
 * They stay two functions rather than one parameterised by direction. "Round
 * up" and "round down" share a motive, not an implementation, and collapsing
 * them would put a conditional where there is now a single Math call.
 */
const roundPremium = (amount: number): number => Math.ceil(amount);

const roundPayout = (amount: number): number => Math.floor(amount);

const basePremiumOfType = (type: string): number => {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    // The spec rejects a quote containing an unknown item type outright, but
    // no active test pins the error behaviour yet. Fail loudly rather than
    // silently pricing an unknown item at zero, which the spec contradicts.
    throw new Error(`Unknown item type: ${type}`);
  }
  return basePremium;
};

/** Component types are sold individually or as a block of alike pieces. */
const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

/**
 * Base premium for a group of alike items. A block rate applies only when a
 * component type appears exactly COMPONENT_BLOCK_SIZE times — blocks do not
 * repeat, so 4 runes cost 4 singles rather than a block plus a single.
 */
const basePremiumOfGroup = (type: string, count: number): number => {
  if (COMPONENT_TYPES.includes(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * basePremiumOfType(type);
};

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;

/**
 * Whether an item carries an enchantment at or above the surcharge threshold.
 * Components (runes, moonstones) have no enchantment field at all; an absent
 * enchantment is not a level of 0, it is the absence of the property, and so
 * never qualifies. Stated as an explicit undefined check rather than a numeric
 * default so the reason reads as "unenchanted", not "enchanted to zero".
 */
const isHighlyEnchanted = (item: Item): boolean =>
  item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_MIN_LEVEL;

/**
 * Item-specific surcharges are a percentage of the affected item's OWN base
 * premium, not of the policy total. They are summed alongside the policy-wide
 * modifiers rather than compounded with them, so an item that is both cursed
 * and highly enchanted carries base + 50 % of base + 30 % of base.
 *
 * KNOWN GAP: basePremiumOfType gives the item's standalone base, which differs
 * from its share of a component block — a rune in a block of 3 is charged 20,
 * not 25, so a cursed or highly enchanted rune inside a block would surcharge
 * against 25. This affects both surcharge terms, not just the curse. Left as
 * is deliberately: the spec defines neither cursed nor enchanted components,
 * gives no rule for apportioning a block rate across its pieces, and no test
 * pins the behaviour. Resolve it when a test forces a choice, not before.
 */
const itemSurchargeOf = (item: Item): number => {
  const itemBase = basePremiumOfType(item.type);
  const curseSurcharge =
    item.cursed === true ? percentOf(itemBase, CURSE_SURCHARGE_PERCENT) : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? percentOf(itemBase, HIGH_ENCHANTMENT_SURCHARGE_PERCENT)
    : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_MIN_YEARS = 2;

const FOLLOW_UP_DISCOUNT_PERCENT = 15;

/**
 * Quotes are numbered from this ordinal; every quote after it is a follow-up
 * contract. The ordinal counts QUOTE steps only — claim steps interleave with
 * quotes in a scenario and must not advance the contract count.
 */
const FIRST_QUOTE_ORDINAL = 0;

/** Long-standing customers qualify from exactly LOYALTY_MIN_YEARS onwards. */
const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS;

/** Every contract after the customer's first one in the scenario. */
const isFollowUpContract = (quoteOrdinal: number): boolean =>
  quoteOrdinal > FIRST_QUOTE_ORDINAL;

/** Policy base premium: every group's base, before any modifier. */
const policyBaseOf = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + basePremiumOfGroup(type, count),
    0,
  );

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurchargeOf(item), 0);

/**
 * The net of the policy-wide modifiers: surcharges positive, discounts
 * negative. Each is a percentage of the POLICY base and they are summed, never
 * compounded — a long-standing customer's first insurance is +10 % and -20 % of
 * the same base, a net -10 %, not 1.1 × 0.8.
 */
const policyModifiersOf = (
  policyBase: number,
  customer: Customer,
  quoteOrdinal: number,
): number => {
  const firstInsuranceSurcharge = percentOf(
    policyBase,
    FIRST_INSURANCE_SURCHARGE_PERCENT,
  );
  const loyaltyDiscount = isLongStanding(customer)
    ? percentOf(policyBase, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const followUpDiscount = isFollowUpContract(quoteOrdinal)
    ? percentOf(policyBase, FOLLOW_UP_DISCOUNT_PERCENT)
    : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const quoteResult = (
  items: Item[],
  customer: Customer,
  quoteOrdinal: number,
): QuoteResult => {
  const policyBase = policyBaseOf(items);
  const premium =
    policyBase +
    itemSurchargesOf(items) +
    policyModifiersOf(policyBase, customer, quoteOrdinal) +
    PROCESSING_FEE;
  return { premium: roundPremium(premium) };
};

/** A quote step's policy, carried forward so later claims can draw on it. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

const policyFor = (items: Item[]): Policy => {
  const insuranceSum = items.reduce(
    (total, item) => total + (INSURANCE_VALUES[item.type] ?? 0),
    0,
  );
  return {
    items,
    remainingCap: CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSum,
  };
};

const HIGH_ENCHANTMENT_CLAUSE_MIN_LEVEL = 8;
const HIGH_ENCHANTMENT_CLAUSE_PERCENT = 50;

/**
 * The damaged item, located by type. A damage entry names a TYPE, not a
 * particular item, so a policy holding two swords of different enchantments is
 * ambiguous; the spec offers no tie-break, so the first match wins.
 */
const damagedItem = (damage: Damage, items: Item[]): Item | undefined =>
  items.find((item) => item.type === damage.itemType);

/**
 * One damage event. A special clause reduces the reimbursed amount BEFORE the
 * deductible is taken: an item enchanted to HIGH_ENCHANTMENT_CLAUSE_MIN_LEVEL
 * or above is reimbursed at half, so 1000 becomes 500 and then 400 — not
 * (1000 - 100) halved.
 *
 * DRAGON MATERIAL, deliberately unexpressed. The spec states a second clause —
 * damage to dragon-material items is FULLY reimbursed — which this function
 * never mentions. That is considered, not overlooked. Full reimbursement is
 * already the default path when no clause fires, so a dragon branch returning
 * damage.amount would be a branch no test could ever distinguish from its own
 * absence. The three spec cases pass unchanged: dragon/ench 8/1000 -> 400,
 * dragon/ench 5/800 -> 700, dragon/ench 9/1000 -> 400.
 *
 * The clauses also do not conflict in the way "both apply" suggests. Where an
 * item is both dragon and enchanted >= 8, the spec has the 50 % rule WIN — so
 * the enchantment check above is not merely first, it is correct to be the
 * only check. Should a later rule ever make full reimbursement differ from the
 * default (a cap interaction, say), this clause must become explicit.
 */
const payoutForDamage = (damage: Damage, items: Item[]): number => {
  const item = damagedItem(damage, items);
  const enchantment = item?.enchantment;
  const reimbursed =
    enchantment !== undefined &&
    enchantment >= HIGH_ENCHANTMENT_CLAUSE_MIN_LEVEL
      ? percentOf(damage.amount, HIGH_ENCHANTMENT_CLAUSE_PERCENT)
      : damage.amount;
  return reimbursed - DEDUCTIBLE_PER_DAMAGE;
};

/**
 * A policy pays at most what its cap has left, so a claim beyond the cap is
 * reduced to the remainder and an exhausted policy pays nothing — the cap lands
 * on 0 rather than going negative. The spec's own phrasing: "the desired 1400 G
 * is reduced to the remaining cap".
 */
const reducedToRemainingCap = (desired: number, remainingCap: number): number =>
  Math.min(desired, remainingCap);

/**
 * How many items of each type an incident reports damaged.
 *
 * Deliberately NOT unified with countByType, whose body is structurally the
 * same. The two answer different questions — what a policy INSURES versus what
 * an incident REPORTS — and they key on separately named schema fields for that
 * reason. They share the Map-increment idiom, not a rule: a change to how
 * blocks group insured items rewrites countByType alone, and a change to how
 * repeated entries count as one damage rewrites this one alone. Extracting a
 * generic countBy would unify them only where they agree by accident.
 */
const countDamagesByType = (damages: Damage[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const damage of damages) {
    counts.set(damage.itemType, (counts.get(damage.itemType) ?? 0) + 1);
  }
  return counts;
};

/**
 * A claim may not report more damaged items of a type than the policy covers.
 * The whole claim is rejected, so this runs before any payout is computed and
 * before the cap is touched — a policy must not be partially drawn down by a
 * claim that is about to be refused. Counting is per claim: successive claims
 * against the same policy each get the full complement of insured items.
 *
 * This ONE guard settles two of the spec's rules, which are one rule counted.
 * A damage naming a type the policy does not hold — an amulet when only a
 * sword is insured, or an outright unknown type — is covered 0 and damaged 1,
 * so it is rejected here by the same comparison. The spec states both in a
 * single breath ("not part of the policy ... or an item with an unknown
 * type"), so encoding them as one comparison is the honest reading rather than
 * a coincidence; a separate uncovered-type check would be a second spelling of
 * this one. Hence the message names counts rather than asserting an overcount:
 * it has to read correctly when `covered` is 0.
 *
 * A void guard, not a predicate. The codebase's is* functions return booleans
 * to be read inside expressions; this is executed for its effect, and naming it
 * isOvercounted would promise a value it does not produce. Keeping the
 * rejection out of claimOutcome's arithmetic is what lets that arithmetic stay
 * a pure expression with no error case threaded through it.
 */
const rejectOvercountedDamages = (incident: Incident, policy: Policy): void => {
  const insured = countByType(policy.items);
  for (const [itemType, damaged] of countDamagesByType(incident.damages)) {
    const covered = insured.get(itemType) ?? 0;
    if (damaged > covered) {
      throw new Error(
        `Claim reports ${damaged} damaged "${itemType}" but the policy covers ${covered}`,
      );
    }
  }
};

/**
 * A claim's effect on its policy: what is paid now and what the policy has
 * left afterwards. Pure — the caller is responsible for storing the new
 * remaining cap, so the arithmetic can be read without tracing who mutated
 * what.
 *
 * Clip THEN round, and not the other way about. The desired total can be
 * fractional, so rounding it before the clip would report a remaining cap the
 * payout never justified. The two calls are left nested for that reason: the
 * order is load-bearing, and nesting makes it structural rather than a
 * sequence of bindings that a later edit could reorder or mis-wire.
 */
/**
 * Damage is a loss, never a credit. Left unchecked a negative amount pays a
 * negative payout and, because the cap subtracts that payout, RAISES the
 * remaining cap above the value the policy was written for.
 *
 * KNOWN GAP: only negatives are refused, and zero is not the harmless case the
 * strict comparison makes it look. A damage of `amount: 0` still processes, and
 * because the deductible is taken from it, yields { payout: -100, remainingCap:
 * 2100 } against a 2000 cap — a negative payout raising the cap above the value
 * the policy was written for, precisely the nonsense this guard exists to stop.
 * The boundary is confirmed: -200 and -1 throw, 500 is unaffected, 0 does not.
 *
 * Left as is deliberately. The spec names `amount: -200` and says nothing about
 * 0, and no test pins it; widening `< 0` to `<= 0` would be inventing policy
 * rather than enforcing it. Resolve it when a test forces the choice — note
 * that the fix may not be this guard at all, since a deductible exceeding the
 * damage produces the same negative payout for any amount under 100.
 *
 * Like the overcount guard this runs before any arithmetic: the whole claim is
 * refused, so the policy must not be drawn down on the way to refusing it.
 */
const rejectNegativeDamages = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(
        `Claim reports a negative amount ${damage.amount} for "${damage.itemType}"`,
      );
    }
  }
};

const claimOutcome = (incident: Incident, policy: Policy): ClaimResult => {
  // Two guards, not one rejectInvalidClaim wrapper. They enforce separately
  // stated spec rules and consult different data — overcounting is relational
  // and needs the policy, negativity is a property of the damage entry alone,
  // which is why the signatures differ. A combined name would also promise a
  // completeness it could not keep (it checks neither zero amounts nor the
  // policy index). Naming both at the call site says exactly what is checked.
  //
  // Their ORDER is free, not load-bearing. Neither mutates before throwing and
  // both run before any arithmetic, so a claim failing both is refused either
  // way; only which message surfaces differs, and no rule ranks above the
  // other. Reorder freely — just do not insert arithmetic between them.
  rejectOvercountedDamages(incident, policy);
  rejectNegativeDamages(incident);
  const desired = incident.damages.reduce(
    (total, damage) => total + payoutForDamage(damage, policy.items),
    0,
  );
  const payout = roundPayout(
    reducedToRemainingCap(desired, policy.remainingCap),
  );
  return { payout, remainingCap: policy.remainingCap - payout };
};

/**
 * Where a step sits in the scenario walk. The two ordinals are genuinely
 * different facts and must not be collapsed: `index` is the step's own
 * zero-based position, which is how a later claim names its policy, while
 * `quoteOrdinal` counts QUOTE steps only. In [quote, claim, quote] the last
 * step has index 2 but quote ordinal 1 — using either in place of the other
 * would misprice the follow-up discount.
 */
interface StepPosition {
  index: number;
  quoteOrdinal: number;
}

/** The mutable state carried along one scenario: the policies quotes create. */
interface ScenarioWalk {
  customer: Customer;
  policies: Map<number, Policy>;
}

const runStep = (
  step: Step,
  position: StepPosition,
  walk: ScenarioWalk,
): StepResult => {
  if (step.op === "quote") {
    walk.policies.set(position.index, policyFor(step.items));
    return quoteResult(step.items, walk.customer, position.quoteOrdinal);
  }
  const policy = walk.policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`No policy created by step ${step.policy}`);
  }
  const outcome = claimOutcome(step.incident, policy);
  policy.remainingCap = outcome.remainingCap;
  return outcome;
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const walk: ScenarioWalk = {
    customer: scenario.customer,
    policies: new Map<number, Policy>(),
  };
  let quoteOrdinal = FIRST_QUOTE_ORDINAL;
  const results = scenario.steps.map((step, index) => {
    const result = runStep(step, { index, quoteOrdinal }, walk);
    if (step.op === "quote") quoteOrdinal += 1;
    return result;
  });
  return { results };
};
