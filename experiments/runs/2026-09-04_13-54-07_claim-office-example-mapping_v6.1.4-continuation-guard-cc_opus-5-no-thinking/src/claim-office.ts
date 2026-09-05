export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = {
  premium: number;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

// The MHPCO's price list. One row per insurable item type: what it costs to
// insure, and what it is insured for. Keeping both figures in a single table
// makes "insurable type" one fact rather than two lists that must agree.
const PRICE_LIST: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
const CAP_MULTIPLIER = 2;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// The MHPCO insures only what is on its price list. Every figure the office
// quotes or pays out is read through here, so an uninsurable type is rejected
// at the one point that knows the price list at all.
const priceListEntryForType = (
  type: string,
): { basePremium: number; insuranceValue: number } => {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`the MHPCO does not insure items of type ${type}`);
  }

  return entry;
};

const basePremiumForType = (type: string): number =>
  priceListEntryForType(type).basePremium;

const insuranceValueForType = (type: string): number =>
  priceListEntryForType(type).insuranceValue;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

// A block is exactly BLOCK_SIZE alike items, charged as one unit.
const formsBlock = (count: number): boolean => count === BLOCK_SIZE;

const groupBasePremium = (type: string, count: number): number =>
  formsBlock(count) ? BLOCK_BASE_PREMIUM : count * basePremiumForType(type);

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (total, [type, count]) => total + groupBasePremium(type, count),
    0,
  );

// The MHPCO rounds in its own favour, which cuts in opposite directions for
// the two quantities it settles: premiums up, payouts down.
const roundPremiumInMHPCOsFavour = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOsFavour = (amount: number): number => Math.floor(amount);

// Item-scoped surcharge clauses. Each applies, independently and additively,
// to the affected item's own base premium.
const ITEM_SURCHARGE_CLAUSES: {
  applies: (item: Item) => boolean;
  rate: number;
}[] = [
  {
    applies: (item) => item.cursed === true,
    rate: CURSE_SURCHARGE_RATE,
  },
  {
    applies: (item) =>
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemSurcharge = (item: Item): number => {
  const base = basePremiumForType(item.type);

  return ITEM_SURCHARGE_CLAUSES.filter((clause) => clause.applies(item)).reduce(
    (total, clause) => total + base * clause.rate,
    0,
  );
};

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

// Everything a quote-scoped clause may inspect. This is what the office is
// asked to price — not to be confused with IssuedPolicy below, which is what
// it hands back once priced and is the thing later claims draw on.
type QuoteRequest = {
  items: Item[];
  customer: Customer;
  isFollowUpContract: boolean;
};

// Quote-scoped modifier clauses. Each applies, independently and additively,
// to the policy base premium. A negative rate is a discount.
const QUOTE_MODIFIER_CLAUSES: {
  applies: (request: QuoteRequest) => boolean;
  rate: number;
}[] = [
  {
    applies: () => true,
    rate: FIRST_INSURANCE_SURCHARGE_RATE,
  },
  {
    applies: (request) =>
      request.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: -LOYALTY_DISCOUNT_RATE,
  },
  {
    applies: (request) => request.isFollowUpContract,
    rate: -FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  },
];

const quoteModifierAmount = (
  request: QuoteRequest,
  policyBase: number,
): number =>
  QUOTE_MODIFIER_CLAUSES.filter((clause) => clause.applies(request)).reduce(
    (total, clause) => total + policyBase * clause.rate,
    0,
  );

// A premium is the policy's base, plus the surcharges its individual items
// attract, plus the policy-wide modifiers, plus the flat fee — all kept as
// exact fractions so that only the final figure is rounded.
const quote = (request: QuoteRequest): QuoteResult => {
  const policyBase = policyBasePremium(request.items);
  const premiumBeforeRounding =
    policyBase +
    totalItemSurcharges(request.items) +
    quoteModifierAmount(request, policyBase) +
    PROCESSING_FEE;

  return { premium: roundPremiumInMHPCOsFavour(premiumBeforeRounding) };
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueForType(item.type), 0);

// A policy issued by a quote step, tracked so later claims can draw on its cap.
type IssuedPolicy = {
  items: Item[];
  remainingCap: number;
};

// The cap a fresh policy starts with: a multiple of the insured items' value,
// independent of any premium modifiers.
const issuePolicy = (items: Item[]): IssuedPolicy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSum(items),
});

// Item-scoped reimbursement clauses. Unlike the additive premium surcharges,
// these compete: the first applicable clause sets the rate outright, so list
// order is precedence. An item no clause applies to is reimbursed in full.
//
// The spec's dragon-material clause ("fully reimbursed") is deliberately not
// listed. Full reimbursement is already the default, and where it would
// collide with the high-enchantment clause the spec says the 50 % rule wins —
// which is what precedence gives. A dragon row would therefore be
// unreachable: no input distinguishes its presence from its absence.
const ITEM_REIMBURSEMENT_CLAUSES: {
  applies: (item: Item) => boolean;
  rate: number;
}[] = [
  {
    applies: (item) =>
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD,
    rate: HIGH_ENCHANTMENT_REIMBURSEMENT_RATE,
  },
];

const reimbursementRate = (item: Item): number =>
  ITEM_REIMBURSEMENT_CLAUSES.find((clause) => clause.applies(item))?.rate ??
  FULL_REIMBURSEMENT_RATE;

// Reimbursement clauses read the damaged item, so a claim resolves each
// damage entry back to the insured item it refers to.
const reimbursedAmount = (item: Item, amount: number): number =>
  amount * reimbursementRate(item);

// A damage entry resolved to the one insured item it is settled against.
type DamagedItem = {
  item: Item;
  amount: number;
};

// Each damage entry is settled against a *distinct* insured item, so a claim
// cannot draw on the same item twice. Pairing every entry up front — rather
// than resolving items one at a time while totalling — keeps the "each item is
// claimed at most once" rule in a single place, and leaves the payout
// arithmetic below free of the bookkeeping.
// The office settles losses, not gains: a negative damage would pay the MHPCO.
const rejectNegativeDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(
      `a damage amount cannot be negative, but ${damage.itemType} reports ${damage.amount}`,
    );
  }
};

// Removes and returns the first unclaimed item of the damaged type, so that
// each insured item can back at most one damage entry.
const takeInsuredItem = (unclaimed: Item[], itemType: string): Item => {
  const index = unclaimed.findIndex((item) => item.type === itemType);
  if (index === -1) {
    throw new Error(
      `the policy does not cover a further ${itemType} to claim against`,
    );
  }

  return unclaimed.splice(index, 1)[0];
};

const pairDamagesWithInsuredItems = (
  damages: Damage[],
  items: Item[],
): DamagedItem[] => {
  const unclaimed = [...items];

  return damages.map((damage) => {
    rejectNegativeDamage(damage);

    return {
      item: takeInsuredItem(unclaimed, damage.itemType),
      amount: damage.amount,
    };
  });
};

// Each damaged item carries its own deductible, and a damage smaller than the
// deductible contributes nothing rather than clawing money back off the claim.
const payoutFor = ({ item, amount }: DamagedItem): number =>
  Math.max(0, reimbursedAmount(item, amount) - DEDUCTIBLE_PER_DAMAGE);

// What the incident claims, before the policy's cap is applied.
const claimedAmount = (incident: Incident, items: Item[]): number =>
  pairDamagesWithInsuredItems(incident.damages, items).reduce(
    (total, damaged) => total + payoutFor(damaged),
    0,
  );

// A claim draws its payout down from the policy's remaining cap, so the
// policy carries less cover into any later claim against it.
const drawDownCap = (policy: IssuedPolicy, payout: number): IssuedPolicy => ({
  ...policy,
  remainingCap: policy.remainingCap - payout,
});

// A policy never pays out more cover than it has left.
const cappedBy = (amount: number, remainingCap: number): number =>
  Math.min(amount, remainingCap);

// Settling a claim pays out what the incident claims, capped by the cover the
// policy has left and rounded down. Only this final figure is rounded, so the
// cap draws down by the amount actually paid. Returns the payout alongside the
// drawn-down policy, leaving it to the caller to record.
const settleClaim = (
  incident: Incident,
  policy: IssuedPolicy,
): { result: ClaimResult; policy: IssuedPolicy } => {
  const claimed = claimedAmount(incident, policy.items);
  const covered = cappedBy(claimed, policy.remainingCap);
  const payout = roundPayoutInMHPCOsFavour(covered);
  const settled = drawDownCap(policy, payout);

  return {
    result: { payout, remainingCap: settled.remainingCap },
    policy: settled,
  };
};

// A claim names the quote step whose policy it draws on, so that step must
// already have issued one.
const policyIssuedBy = (
  policies: Map<number, IssuedPolicy>,
  step: number,
): IssuedPolicy => {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`no policy was issued by step ${step} to claim against`);
  }

  return policy;
};

// The office's ledger as it works down a scenario: which steps have issued
// policies (and how much cover each has left), and whether the customer has
// been sold anything yet — the latter being what makes the *next* quote a
// follow-up contract.
type Ledger = {
  policies: Map<number, IssuedPolicy>;
  hasIssuedContract: boolean;
};

// A quote both prices the items and issues the policy the step is remembered
// by. It is priced against the ledger as it stood *before* this step, which is
// why the follow-up flag is read here and only set in the returned ledger:
// the first contract is never a follow-up to itself.
const runQuoteStep = (
  step: QuoteStep,
  index: number,
  customer: Customer,
  ledger: Ledger,
): { result: StepResult; ledger: Ledger } => ({
  result: quote({
    items: step.items,
    customer,
    isFollowUpContract: ledger.hasIssuedContract,
  }),
  ledger: {
    policies: new Map(ledger.policies).set(index, issuePolicy(step.items)),
    hasIssuedContract: true,
  },
});

// A claim settles against the policy its step names and writes the drawn-down
// policy back, so a later claim on the same policy sees the reduced cover.
const runClaimStep = (
  step: ClaimStep,
  ledger: Ledger,
): { result: StepResult; ledger: Ledger } => {
  const { result, policy } = settleClaim(
    step.incident,
    policyIssuedBy(ledger.policies, step.policy),
  );

  return {
    result,
    ledger: {
      ...ledger,
      policies: new Map(ledger.policies).set(step.policy, policy),
    },
  };
};

const runStep = (
  step: Step,
  index: number,
  customer: Customer,
  ledger: Ledger,
): { result: StepResult; ledger: Ledger } =>
  step.op === "claim"
    ? runClaimStep(step, ledger)
    : runQuoteStep(step, index, customer, ledger);

// Steps are settled in order, each against the ledger the previous ones left
// behind.
export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results: StepResult[] = [];
  let ledger: Ledger = {
    policies: new Map<number, IssuedPolicy>(),
    hasIssuedContract: false,
  };

  scenario.steps.forEach((step, index) => {
    const settled = runStep(step, index, scenario.customer, ledger);
    results.push(settled.result);
    ledger = settled.ledger;
  });

  return { results };
};
