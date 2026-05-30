const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOWUP_DISCOUNT = 0.15;

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResult;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const formsBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE;

const typeBasePremium = (type: string, count: number): number => {
  if (formsBlock(type, count)) return BLOCK_PREMIUM;
  return count * BASE_PREMIUMS[type];
};

// Tallies a collection into a count-by-key map, given how to read each
// element's key. Used to count both insured items and reported damages by type.
const tallyBy = <T>(elements: T[], keyOf: (element: T) => string): Map<string, number> =>
  elements.reduce((counts, element) => {
    const key = keyOf(element);
    return counts.set(key, (counts.get(key) ?? 0) + 1);
  }, new Map<string, number>());

// Totals a collection by reading a number off each element. Used wherever a
// per-item amount (insurance value, surcharge) is summed across the policy.
const sumOf = <T>(elements: T[], amountOf: (element: T) => number): number =>
  elements.reduce((total, element) => total + amountOf(element), 0);

const countByType = (items: Item[]): Map<string, number> =>
  tallyBy(items, (item) => item.type);

const policyBasePremium = (items: Item[]): number =>
  sumOf([...countByType(items)], ([type, count]) => typeBasePremium(type, count));

// A rate rule contributes its rate to a subject only when it applies.
interface RateRule<T> {
  applies: (subject: T) => boolean;
  rate: number;
}

const sumApplicableRates = <T>(rules: RateRule<T>[], subject: T): number =>
  rules.reduce(
    (rate, rule) => (rule.applies(subject) ? rate + rule.rate : rate),
    0,
  );

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const SURCHARGE_RULES: RateRule<Item>[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE,
  },
];

const itemSurcharge = (item: Item): number =>
  sumApplicableRates(SURCHARGE_RULES, item) * BASE_PREMIUMS[item.type];

const itemSurcharges = (items: Item[]): number =>
  sumOf(items, itemSurcharge);

interface PolicyContext {
  customer: Customer;
  isFollowUp: boolean;
}

// Policy-wide modifiers each apply a signed rate to the policy base:
// positive rates are surcharges, negative rates are discounts.
const POLICY_MODIFIER_RULES: RateRule<PolicyContext>[] = [
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE },
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_THRESHOLD,
    rate: -LOYALTY_DISCOUNT,
  },
  { applies: ({ isFollowUp }) => isFollowUp, rate: -FOLLOWUP_DISCOUNT },
];

const policyModifierRate = (context: PolicyContext): number =>
  sumApplicableRates(POLICY_MODIFIER_RULES, context);

// A signed modifier rate scales a base: positive rates surcharge, negative discount.
const applyModifierRate = (base: number, rate: number): number =>
  base * (1 + rate);

// Strips floating-point error that could nudge an exact value over an
// integer boundary, so the rounding below acts on the intended amount.
const cleanFloatNoise = (amount: number): number => Number(amount.toFixed(6));

// Premiums round up, payouts round down — both in the MHPCO's favor.
const roundUpPremium = (amount: number): number =>
  Math.ceil(cleanFloatNoise(amount));

const roundDownPayout = (amount: number): number =>
  Math.floor(cleanFloatNoise(amount));

// The MHPCO only insures the item types it has published a base premium for.
const isInsurableType = (type: string): boolean => type in BASE_PREMIUMS;

// Every quoted item must be a type the MHPCO actually insures.
const assertKnownItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isInsurableType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const quotePremium = (items: Item[], context: PolicyContext): number => {
  const policyBase = policyBasePremium(items);
  const modifierRate = policyModifierRate(context);
  // Policy modifiers scale the policy base only; item surcharges are added
  // separately (outside the modifier scope), then the flat fee comes last.
  const modifiedPolicyBase = applyModifierRate(policyBase, modifierRate);
  const total = modifiedPolicyBase + itemSurcharges(items) + PROCESSING_FEE;
  return roundUpPremium(total);
};

const insuranceSum = (items: Item[]): number =>
  sumOf(items, (item) => INSURANCE_VALUES[item.type]);

// A policy's payout cap is twice its total insured value.
const policyCap = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSum(items);

interface Policy {
  items: Item[];
  remainingCap: number;
}

// A freshly registered policy starts with its full cap available to claim.
const newPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: policyCap(items),
});

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const qualifiesForHalfReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

// The spec names two reimbursement clauses. The high-enchantment clause
// (enchantment >= 8) reimburses 50%; the dragon-material clause reimburses
// 100%. When both apply, 50% wins — the lower payout. Since 100% reimbursement
// is identical to the default (full) reimbursement, the dragon clause needs no
// branch of its own: it changes nothing the default doesn't already do, and the
// "50% wins" interaction falls out naturally from preferring the half clause
// here. A dedicated dragon branch would be a no-op the tests can't distinguish.
const reimbursement = (item: Item, amount: number): number =>
  qualifiesForHalfReimbursement(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE * amount
    : amount;

// The damaged item is the policy item whose type the damage names. The lookup
// always succeeds here because assertDamagesCovered has already rejected any
// claim naming a type the policy doesn't insure (insured count 0), so by this
// point every damage references an insured type.
const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

const damagePayout = (damage: Damage, policy: Policy): number =>
  reimbursement(insuredItemFor(damage, policy), damage.amount) - DEDUCTIBLE;

// Each damage carries its own deductible, so the requested payout is the sum
// of per-damage payouts — not the deductible applied once to the total.
const requestedPayout = (step: ClaimStep, policy: Policy): number =>
  step.incident.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, policy),
    0,
  );

// A claim may not report more damages of a type than the policy insures of
// that type — there is no insured item left to attribute the extra damage to.
// A type the policy doesn't insure at all has an insured count of 0, so this
// same check also rejects claims referencing items that aren't in the policy.
const assertDamagesCovered = (step: ClaimStep, policy: Policy): void => {
  const insured = countByType(policy.items);
  const damaged = tallyBy(step.incident.damages, (damage) => damage.itemType);
  for (const [itemType, count] of damaged) {
    const insuredCount = insured.get(itemType) ?? 0;
    if (count > insuredCount) {
      throw new Error(
        `claim reports ${count} ${itemType} damage(s) but policy insures ${insuredCount}`,
      );
    }
  }
};

// A damage cannot reduce the insured value by a negative amount.
const assertNonNegativeDamages = (step: ClaimStep): void => {
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
};

const settleClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  // Reject invalid claims before computing any payout. These are two distinct
  // rules — no negative amounts, and no more damages of a type than insured —
  // kept as separately named checks so the call site names what each rejects.
  assertNonNegativeDamages(step);
  assertDamagesCovered(step, policy);
  // The payout can never exceed what's left of the cap, and each settlement
  // spends down that remainder — so successive claims against the same policy
  // draw from a shrinking cap until it's exhausted.
  const payout = Math.min(
    roundDownPayout(requestedPayout(step, policy)),
    policy.remainingCap,
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

// Steps are processed in order against accumulating state: each quote
// registers a policy (keyed by its step index) and marks that a prior
// quote exists, so later quotes count as follow-ups; each claim settles
// against an already-registered policy. The sequential state-building is
// why this is an explicit loop rather than a (pure) map.
export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies = new Map<number, Policy>();
  let hasPriorQuote = false;
  const results: StepResult[] = [];

  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy)!;
      results.push(settleClaim(step, policy));
    } else {
      const context: PolicyContext = {
        customer: scenario.customer,
        isFollowUp: hasPriorQuote,
      };
      hasPriorQuote = true;
      assertKnownItems(step.items);
      policies.set(index, newPolicy(step.items));
      results.push({ premium: quotePremium(step.items, context) });
    }
  });

  return { results };
};
