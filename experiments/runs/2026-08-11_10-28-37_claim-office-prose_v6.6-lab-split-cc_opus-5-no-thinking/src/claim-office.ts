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

// What MHPCO insures each item for, as distinct from what it charges to do so.
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Percentages are applied as integer arithmetic (× percent ÷ 100) rather than
// as a float rate (× 1.1): this keeps intermediate values integral and avoids
// binary floating-point error — 100 * 1.1 is 110.00000000000001, but
// (100 * 110) / 100 is exact.
const ONE_HUNDRED_PERCENT = 100;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const ADMIN_FEE = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT = 15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
const NO_PAYOUT = 0;
const PERILOUS_ENCHANTMENT = 8;
const PERILOUS_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;
const DRAGON_MATERIAL = "dragon";

const applyPercent = (amount: number, percent: number): number =>
  (amount * percent) / ONE_HUNDRED_PERCENT;

const addSurcharge = (amount: number, surchargePercent: number): number =>
  applyPercent(amount, ONE_HUNDRED_PERCENT + surchargePercent);

const applyDiscount = (amount: number, discountPercent: number): number =>
  applyPercent(amount, ONE_HUNDRED_PERCENT - discountPercent);

const COMPONENT_TYPES = ["rune", "moonstone"];
const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_BASE_PREMIUM = 60;
const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

// An item type MHPCO has no rate card for cannot be priced or insured, and
// silently reading `undefined` out of the rate card would propagate NaN through
// every total downstream. Both rate cards are read through this one lookup so
// the failure is named once, at the point the unknown type is first seen.
const rateFor = (rates: Record<string, number>, item: Item): number => {
  const rate = rates[item.type];
  if (rate === undefined) {
    throw new Error(`Unknown item type ${item.type}`);
  }
  return rate;
};

const basePremiumOf = (item: Item): number => rateFor(BASE_PREMIUMS, item);

// Both the per-item risk surcharges and the contract-level modifiers are lists
// of the same kind of thing: an adjustment to an amount, guarded by a condition
// on some subject. They stack multiplicatively — each adjustment applies to the
// result of the one before — so both are applied by the same fold, and the two
// lists cannot drift apart in how they combine.
interface Adjustment<Subject> {
  appliesTo: (subject: Subject) => boolean;
  adjust: (amount: number) => number;
}

const adjusted = <Subject,>(
  amount: number,
  subject: Subject,
  adjustments: Adjustment<Subject>[],
): number =>
  adjustments.reduce(
    (running, adjustment) =>
      adjustment.appliesTo(subject) ? adjustment.adjust(running) : running,
    amount,
  );

// Risk surcharges are per-item properties of the insured object, each raising
// that item's premium by a percentage.
const HIGH_ENCHANTMENT = 5;
const NO_ENCHANTMENT = 0;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const RISK_SURCHARGES: Adjustment<Item>[] = [
  {
    appliesTo: (item) => item.cursed === true,
    adjust: (premium) => addSurcharge(premium, CURSED_SURCHARGE_PERCENT),
  },
  {
    appliesTo: (item) => (item.enchantment ?? NO_ENCHANTMENT) >= HIGH_ENCHANTMENT,
    adjust: (premium) =>
      addSurcharge(premium, HIGH_ENCHANTMENT_SURCHARGE_PERCENT),
  },
];

const riskAdjustedPremiumOf = (item: Item): number =>
  adjusted(basePremiumOf(item), item, RISK_SURCHARGES);

const sumRiskAdjustedPremiums = (items: Item[]): number =>
  items.reduce((total, item) => total + riskAdjustedPremiumOf(item), 0);

// Alike components are grouped into building blocks of 3, which carry a
// special base premium; the remaining components are priced individually,
// risk surcharges and all.
// Total over the empty group: no components means no blocks and no remainder.
const alikeComponentsPremium = (components: Item[]): number => {
  const blockCount = Math.floor(components.length / BUILDING_BLOCK_SIZE);
  const remainingComponents = components.slice(blockCount * BUILDING_BLOCK_SIZE);
  return (
    blockCount * BUILDING_BLOCK_BASE_PREMIUM +
    sumRiskAdjustedPremiums(remainingComponents)
  );
};

// Splits items into those matching the predicate and those not, in one pass,
// so the rule dividing them is written exactly once.
const partition = (
  items: Item[],
  matches: (item: Item) => boolean,
): [Item[], Item[]] =>
  items.reduce<[Item[], Item[]]>(
    ([matching, rest], item) =>
      matches(item) ? [[...matching, item], rest] : [matching, [...rest, item]],
    [[], []],
  );

const groupByType = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groups, item) =>
        groups.set(item.type, [...(groups.get(item.type) ?? []), item]),
      new Map<string, Item[]>(),
    )
    .values(),
];

// Components and main items are priced by different rules, so each group is
// totalled separately: components by building block, main items item by item.
const componentsPremium = (components: Item[]): number =>
  groupByType(components).reduce(
    (total, alike) => total + alikeComponentsPremium(alike),
    0,
  );

// What the items alone cost to insure, before any modifier that depends on the
// customer or the contract they sit in. This is a premium, not a sum insured:
// what MHPCO *charges* for the cover, not what it will *pay out* — an amulet
// costs 60 here and is insured for 600 (see insuranceSumOf). Every item is
// either a component or a main item — the split is stated once, as a partition,
// so the two halves cannot drift apart — and each half is priced by its own
// rules.
const itemsPremiumOf = (items: Item[]): number => {
  const [components, mainItems] = partition(items, isComponent);
  return sumRiskAdjustedPremiums(mainItems) + componentsPremium(components);
};

// Contract-level modifiers adjust the premium by the terms of the deal rather
// than the nature of the items.
interface Contract {
  customer: Customer;
  isFirstContract: boolean;
}

// Every contract is priced on one of two standings: a first insurance is
// assessed a surcharge, a later one rewarded with a discount. This is a choice,
// not two independent rules, so it is written as one — there is no way to
// express a contract that gets both or neither.
const standingAdjustedPremiumOf = (
  amount: number,
  { isFirstContract }: Contract,
): number =>
  isFirstContract
    ? addSurcharge(amount, FIRST_INSURANCE_SURCHARGE_PERCENT)
    : applyDiscount(amount, SUBSEQUENT_CONTRACT_DISCOUNT_PERCENT);

// Modifiers that a contract may or may not earn, on top of its standing.
const CONTRACT_MODIFIERS: Adjustment<Contract>[] = [
  {
    appliesTo: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS,
    adjust: (amount) => applyDiscount(amount, LOYALTY_DISCOUNT_PERCENT),
  },
];

const contractAdjustedPremiumOf = (
  itemsPremium: number,
  contract: Contract,
): number =>
  adjusted(
    standingAdjustedPremiumOf(itemsPremium, contract),
    contract,
    CONTRACT_MODIFIERS,
  );

// Premiums round up in MHPCO's favour, and the flat admin fee is added last
// so that no percentage ever applies to it.
const billedPremiumOf = (premium: number): number =>
  Math.ceil(premium) + ADMIN_FEE;

const quote = (step: QuoteStep, contract: Contract): QuoteResult => ({
  premium: billedPremiumOf(
    contractAdjustedPremiumOf(itemsPremiumOf(step.items), contract),
  ),
});

// The insurance sum is what the items are covered for, and it is the basis of
// the payout cap — unrelated to the premium charged for that cover.
const insuranceSumOf = (items: Item[]): number =>
  items.reduce((total, item) => total + rateFor(INSURANCE_VALUES, item), 0);

// A quote creates a policy, which then absorbs claims: every payout draws down
// a cap of twice the insurance sum, so the policy carries state between steps.
// The policy keeps the items it covers: a claim is settled by the nature of the
// damaged item, so the cover has to be able to look back at what it insured.
interface Policy {
  remainingCap: number;
  items: Item[];
}

const policyFor = (items: Item[]): Policy => ({
  remainingCap: insuranceSumOf(items) * CAP_MULTIPLE,
  items,
});

// How much of a damage MHPCO shoulders depends on what was damaged: an item so
// heavily enchanted that its own magic invites disaster is met halfway. Unlike
// the risk surcharges, these rules select rather than stack — an item is
// settled on one footing, so the first matching rule decides and the rest are
// not consulted. Precedence is therefore the order of this list.
interface ReimbursementRule {
  appliesTo: (item: Item) => boolean;
  percent: number;
}

const REIMBURSEMENT_RULES: ReimbursementRule[] = [
  // Dragon stuff is made whole however perilously enchanted it also is, so this
  // rule is listed first and the perilous-enchantment rule never gets to speak.
  {
    appliesTo: (item) => item.material === DRAGON_MATERIAL,
    percent: FULL_REIMBURSEMENT_PERCENT,
  },
  {
    appliesTo: (item) =>
      (item.enchantment ?? NO_ENCHANTMENT) >= PERILOUS_ENCHANTMENT,
    percent: PERILOUS_ENCHANTMENT_REIMBURSEMENT_PERCENT,
  },
];

// A damage names a type, and a policy may insure several items of that type, so
// a rule speaks for the damage if it applies to any of them.
const governs = (rule: ReimbursementRule, damagedItems: Item[]): boolean =>
  damagedItems.some(rule.appliesTo);

// No rule matching means nothing about the item argues for paying less than in
// full. An item MHPCO has no record of insuring matches no rule either, and so
// is reimbursed in full by the same default.
const reimbursementPercentFor = (damagedItems: Item[]): number =>
  REIMBURSEMENT_RULES.find((rule) => governs(rule, damagedItems))?.percent ??
  FULL_REIMBURSEMENT_PERCENT;

// A damage names an item type; the policy knows what it insured under that
// name, and the item's nature decides how much of the loss is met.
const insuredItemsOfType = (policy: Policy, itemType: string): Item[] =>
  policy.items.filter((item) => item.type === itemType);

const reimbursementFor = (damage: Damage, policy: Policy): number =>
  applyPercent(
    damage.amount,
    reimbursementPercentFor(insuredItemsOfType(policy, damage.itemType)),
  );

// An incident's damages are reimbursed one by one, then totalled before the
// deductible is taken, so the deductible falls once on the event rather than
// once per damaged item.
const reimbursementTotalOf = (incident: Incident, policy: Policy): number =>
  incident.damages.reduce(
    (total, damage) => total + reimbursementFor(damage, policy),
    0,
  );

// The deductible reduces the payout, it never turns it into a charge: a loss
// smaller than the deductible is simply not paid, rather than billed back.
const netOfDeductible = (reimbursement: number): number =>
  Math.max(reimbursement - DEDUCTIBLE, NO_PAYOUT);

// However great the loss, a policy pays out only what it has left to give, and
// a payout draws the cap down by exactly what was paid.
const payableUnder = (policy: Policy, reimbursement: number): number =>
  Math.min(netOfDeductible(reimbursement), policy.remainingCap);

const claim = (step: ClaimStep, policy: Policy): ClaimResult => {
  const payout = payableUnder(
    policy,
    reimbursementTotalOf(step.incident, policy),
  );
  return { payout, remainingCap: policy.remainingCap - payout };
};

// Steps are processed in order because each one depends on what came before: a
// quote's standing depends on how many contracts precede it, and a claim draws
// down the cap its policy has left. Both are carried explicitly as the policies
// map rather than mutated in place, so a step's effect on later steps is
// visible in what it returns.
// Policies are numbered by how many quotes precede them, not by the position of
// the step that opened them: a scenario may interleave claims among its quotes,
// and a claim must not advance the numbering of the next policy. The count of
// policies opened so far is therefore carried in its own right — it is also what
// tells a quote whether it is the customer's first contract.
interface Ledger {
  policies: Map<number, Policy>;
  results: StepResult[];
}

const withPolicy = (
  policies: Map<number, Policy>,
  policyNumber: number,
  policy: Policy,
): Map<number, Policy> => new Map(policies).set(policyNumber, policy);

// Every step settles the same way: it produces one result, and it leaves the
// policies it touched in whatever state that result implies. Saying so once
// keeps the two kinds of step from drifting apart in how they are recorded.
interface Settlement {
  policies: Map<number, Policy>;
  result: StepResult;
}

// A quote opens a policy, numbered by its own position in the scenario — that
// number is what a later claim names to draw on this cover.
const settleQuote = (
  policies: Map<number, Policy>,
  step: QuoteStep,
  policyNumber: number,
  customer: Customer,
): Settlement => ({
  policies: withPolicy(policies, policyNumber, policyFor(step.items)),
  result: quote(step, { customer, isFirstContract: policyNumber === 0 }),
});

const policyNamedBy = (
  policies: Map<number, Policy>,
  step: ClaimStep,
): Policy => {
  const policy = policies.get(step.policy);
  if (policy === undefined) {
    throw new Error(`Claim refers to unknown policy ${step.policy}`);
  }
  return policy;
};

// A claim draws the named policy's cap down by what it paid, and writes the
// drawn-down policy back so the next claim on it sees the smaller cap.
const settleClaim = (
  policies: Map<number, Policy>,
  step: ClaimStep,
): Settlement => {
  const policy = policyNamedBy(policies, step);
  const result = claim(step, policy);
  return {
    policies: withPolicy(policies, step.policy, {
      ...policy,
      remainingCap: result.remainingCap,
    }),
    result,
  };
};

const applyStep = (
  { policies, results }: Ledger,
  step: Step,
  customer: Customer,
): Ledger => {
  const settlement =
    step.op === "quote"
      ? settleQuote(policies, step, policies.size, customer)
      : settleClaim(policies, step);
  return {
    policies: settlement.policies,
    results: [...results, settlement.result],
  };
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const { results } = steps.reduce<Ledger>(
    (ledger, step) => applyStep(ledger, step, customer),
    { policies: new Map(), results: [] },
  );
  return { results };
};
