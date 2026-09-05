export interface Customer {
  yearsWithMHPCO: number;
}

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
  /** Zero-based index of the quote step that opened the policy being claimed against. */
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

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE = 0.1;

const CURSE_SURCHARGE = 0.5;

const HIGH_ENCHANTMENT_LEVEL = 5;

const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

const LOYALTY_YEARS = 2;

const LOYALTY_DISCOUNT = 0.2;

const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

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

const HALVED_PAYOUT_ENCHANTMENT = 8;

const HALVED_PAYOUT_RATE = 0.5;

const CAP_MULTIPLIER = 2;

const BLOCK_SIZE = 3;

const BLOCK_BASE_PREMIUM = 60;

const countByType = <T>(values: T[], typeOf: (value: T) => string) =>
  values.reduce((counts, value) => {
    const type = typeOf(value);

    return counts.set(type, (counts.get(type) ?? 0) + 1);
  }, new Map<string, number>());

const itemCounts = (items: Item[]): Map<string, number> =>
  countByType(items, (item) => item.type);

const typeBasePremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const policyBasePremium = (items: Item[]): number =>
  [...itemCounts(items)].reduce(
    (total, [type, count]) => total + typeBasePremium(type, count),
    0,
  );

// Modifiers below all express a rate applied to some base. Keep every one of
// them in the form `base + base * RATE`. The algebraically equivalent
// `base * (1 + RATE)` is NOT safe here: 100 * 1.1 === 110.00000000000001 in
// IEEE-754, and Math.ceil turns that into 116 instead of 115. Ceil amplifies
// upward float error rather than absorbing it.

// Item-specific modifiers: each is computed on the affected item's OWN base
// premium, then summed across items. Note this is the item's UNIT base premium
// — never the block-adjusted one. A rune inside a block of 3 is still
// surcharged on its own 25 G, not on its 20 G share of the block.
const unitBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);

const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (total, item) => total + unitBasePremium(item) * itemSurchargeRate(item),
    0,
  );

// Policy-wide modifiers: each is computed on the policy base premium (the sum
// of all item base premiums), independent of which items make it up.
const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const policyModifierRate = (
  customer: Customer,
  isFollowUpContract: boolean,
): number =>
  FIRST_INSURANCE_SURCHARGE -
  (isLoyal(customer) ? LOYALTY_DISCOUNT : 0) -
  (isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT : 0);

// The MHPCO catalogue. A type outside it is not an item the office can price
// or insure, so both quotes and claims reject it up front — before any
// counting rule gets a chance to describe it as merely under-insured.
const rejectUnknownTypes = (types: string[]): void => {
  for (const type of types) {
    if (!(type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${type}`);
    }
  }
};

const quote = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): QuoteResult => {
  rejectUnknownTypes(items.map((item) => item.type));

  const policyBase = policyBasePremium(items);
  const policyModifiers =
    policyBase * policyModifierRate(customer, isFollowUpContract);

  return {
    premium: Math.ceil(
      policyBase + itemSurcharges(items) + policyModifiers + PROCESSING_FEE,
    ),
  };
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

// Note this enchantment threshold (8) is the CLAIM rule and is distinct from
// HIGH_ENCHANTMENT_LEVEL (5), which is the premium rule.
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HALVED_PAYOUT_ENCHANTMENT ? HALVED_PAYOUT_RATE : 1;

// The rate comes from the insured item of the damaged type. Both validations
// in `claim` have already run by the time this is reached, so a matching item
// is guaranteed to exist: unknown types are rejected outright, and a type with
// more damages than insured items is rejected as over-claiming.
const insuredItemOfType = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType)!;

// Each damage entry carries its own deductible: an incident that harms three
// insured items subtracts the deductible three times, not once. The deductible
// can reduce a damage to zero but never below — a damage smaller than the
// deductible simply pays nothing, it does not refund the policy's cap.
const reimbursement = (damage: Damage, item: Item): number =>
  Math.max(damage.amount * reimbursementRate(item) - DEDUCTIBLE, 0);

// What the incident would pay out if the policy had unlimited cap.
// Payouts round DOWN where premiums round UP — both in the MHPCO's favour.
// Round once, here, so the figure reported to the customer and the figure
// charged against the cap can never drift apart.
const desiredPayout = (policy: Policy, incident: Incident): number =>
  Math.floor(
    incident.damages.reduce(
      (total, damage) =>
        total +
        reimbursement(damage, insuredItemOfType(policy, damage.itemType)),
      0,
    ),
  );

// A policy covers a fixed set of items, so an incident cannot damage more
// items of a type than the policy insures. Over-claiming rejects the whole
// claim rather than paying out the covered part.
const rejectOverClaiming = (policy: Policy, incident: Incident): void => {
  const insured = itemCounts(policy.items);
  const damaged = countByType(incident.damages, (damage) => damage.itemType);

  for (const [type, count] of damaged) {
    if (count > (insured.get(type) ?? 0)) {
      throw new Error(
        `Claim covers more ${type} damages than the policy insures`,
      );
    }
  }
};

const rejectNegativeDamages = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

// The cap is the ceiling on everything the policy will ever pay: each claim
// takes what it can from the remainder, and once drained the policy pays 0.
const claim = (policy: Policy, incident: Incident): ClaimResult => {
  rejectNegativeDamages(incident);
  rejectUnknownTypes(incident.damages.map((damage) => damage.itemType));
  rejectOverClaiming(policy, incident);

  const payout = Math.min(desiredPayout(policy, incident), policy.remainingCap);

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  // Keyed by the index of the quote step that opened the policy — that index is
  // exactly what a later claim step names in its `policy` field.
  const policiesByQuoteStep = new Map<number, Policy>();

  // Every quote after the first in a scenario is a follow-up contract, so the
  // presence of an earlier policy is exactly the follow-up condition.
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const isFollowUpContract = policiesByQuoteStep.size > 0;

      results.push(quote(step.items, scenario.customer, isFollowUpContract));
      policiesByQuoteStep.set(stepIndex, openPolicy(step.items));

      return;
    }

    results.push(claim(policiesByQuoteStep.get(step.policy)!, step.incident));
  });

  return { results };
};
