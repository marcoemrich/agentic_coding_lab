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

export type ScenarioResult = {
  results: unknown[];
};

const PROCESSING_FEE = 5;

type CatalogueEntry = {
  basePremium: number;
  insuranceValue: number;
};

const ITEM_CATALOGUE: Record<string, CatalogueEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

// Most money figures in a policy are "some value, totalled over the items".
const sumOver = (items: Item[], valueOf: (item: Item) => number): number =>
  items.reduce((total, item) => total + valueOf(item), 0);

const catalogueEntryFor = (item: Item): CatalogueEntry => {
  const entry = ITEM_CATALOGUE[item.type];

  if (entry === undefined) {
    throw new Error(`unknown item type: ${item.type}`);
  }

  return entry;
};

const basePremiumOf = (item: Item): number =>
  catalogueEntryFor(item).basePremium;

const insuranceValueOf = (item: Item): number =>
  catalogueEntryFor(item).insuranceValue;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const itemsGroupedByType = (items: Item[]): Item[][] => [
  ...items
    .reduce(
      (groupsByType, item) =>
        groupsByType.set(item.type, [
          ...(groupsByType.get(item.type) ?? []),
          item,
        ]),
      new Map<string, Item[]>(),
    )
    .values(),
];

const formsABlock = (itemsAlike: Item[]): boolean =>
  itemsAlike.length === BLOCK_SIZE;

const basePremiumOfItemsAlike = (itemsAlike: Item[]): number =>
  formsABlock(itemsAlike)
    ? BLOCK_BASE_PREMIUM
    : sumOver(itemsAlike, basePremiumOf);

const totalBasePremiumOf = (items: Item[]): number =>
  itemsGroupedByType(items).reduce(
    (total, itemsAlike) => total + basePremiumOfItemsAlike(itemsAlike),
    0,
  );

// The MHPCO rounds whichever way costs it least: premiums up, payouts down.
const roundedUpInMHPCOsFavour = (premium: number): number => Math.ceil(premium);

const roundedDownInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

type Rule<Subject> = {
  appliesTo: (subject: Subject) => boolean;
  rate: number;
};

const totalRateOf = <Subject,>(
  rules: Rule<Subject>[],
  subject: Subject,
): number =>
  rules.reduce(
    (rate, rule) => (rule.appliesTo(subject) ? rate + rule.rate : rate),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

// An item carrying no enchantment is enchanted to level zero.
const UNENCHANTED = 0;

const enchantmentOf = (item: Item): number => item.enchantment ?? UNENCHANTED;

const ITEM_SURCHARGE_RULES: Rule<Item>[] = [
  { appliesTo: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    appliesTo: (item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemSurchargeOf = (item: Item): number =>
  basePremiumOf(item) * totalRateOf(ITEM_SURCHARGE_RULES, item);

const totalItemSurchargeOf = (items: Item[]): number =>
  sumOver(items, itemSurchargeOf);

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = -0.2;

// Levied on every policy, follow-ups included — not only on a customer's first.
const INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = -0.15;

type PolicyContext = {
  customer: Customer;
  previousContracts: number;
};

const POLICY_MODIFIER_RULES: Rule<PolicyContext>[] = [
  {
    appliesTo: ({ customer }) =>
      customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: LOYALTY_DISCOUNT_RATE,
  },
  {
    appliesTo: ({ previousContracts }) => previousContracts > 0,
    rate: FOLLOW_UP_DISCOUNT_RATE,
  },
];

const totalPolicyModifierRateOf = (policy: PolicyContext): number =>
  INSURANCE_SURCHARGE_RATE + totalRateOf(POLICY_MODIFIER_RULES, policy);

const quotePremium = (items: Item[], policy: PolicyContext): number => {
  const basePremium = totalBasePremiumOf(items);

  return roundedUpInMHPCOsFavour(
    basePremium +
      totalItemSurchargeOf(items) +
      basePremium * totalPolicyModifierRateOf(policy) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const insuranceSumOf = (items: Item[]): number =>
  sumOver(items, insuranceValueOf);

const payoutCapOf = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSumOf(items);

const HALVED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALVED_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRateFor = (item: Item): number =>
  enchantmentOf(item) >= HALVED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HALVED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

const payoutForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;

const isQuote = (step: Step): step is QuoteStep => step.op === "quote";

type ClaimResult = {
  payout: number;
  remainingCap: number;
};

// Each damage entry is settled against a distinct insured item, so a policy
// covering one sword cannot pay out for two damaged swords.
type Settlement = {
  total: number;
  unclaimedItems: Item[];
};

const NOT_FOUND = -1;

// A loss of negative value is not a loss; the MHPCO will not be talked into
// treating one as a claim.
const refuseNonLoss = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
};

// The policy must still have an unclaimed item of the damaged type to settle
// against. Answers with that item's position, so the caller can both pay for
// it and strike it off.
const claimedItemIndexFor = (
  damage: Damage,
  unclaimedItems: Item[],
): number => {
  const claimedAgainst = unclaimedItems.findIndex(
    (item) => item.type === damage.itemType,
  );

  if (claimedAgainst === NOT_FOUND) {
    throw new Error(`damaged item not insured: ${damage.itemType}`);
  }

  return claimedAgainst;
};

const settleDamage = (
  { total, unclaimedItems }: Settlement,
  damage: Damage,
): Settlement => {
  refuseNonLoss(damage);

  const claimedAgainst = claimedItemIndexFor(damage, unclaimedItems);

  return {
    total: total + payoutForDamage(damage, unclaimedItems[claimedAgainst]),
    unclaimedItems: unclaimedItems.filter(
      (_, index) => index !== claimedAgainst,
    ),
  };
};

const totalPayoutFor = (damages: Damage[], insuredItems: Item[]): number =>
  damages.reduce(settleDamage, { total: 0, unclaimedItems: insuredItems })
    .total;

// A claim never pays out more than the policy has left; whatever it does pay
// depletes the cap by exactly that much.
const drawnAgainstCap = (
  desiredPayout: number,
  remainingCap: number,
): ClaimResult => {
  const payout = roundedDownInMHPCOsFavour(
    Math.min(desiredPayout, remainingCap),
  );

  return { payout, remainingCap: remainingCap - payout };
};

const settleClaim = (incident: Incident, policy: IssuedPolicy): ClaimResult =>
  drawnAgainstCap(
    totalPayoutFor(incident.damages, policy.insuredItems),
    policy.remainingCap,
  );

// A policy, once quoted, is referred to by later claim steps via its step index.
// Its cap depletes as claims are paid out against it.
type IssuedPolicy = {
  insuredItems: Item[];
  remainingCap: number;
};

// Everything a step needs to know about the steps that came before it.
// Policies are keyed by the index of the quote step that issued them, which is
// how a claim step refers to them.
type ScenarioHistory = {
  issuedPolicies: Map<number, IssuedPolicy>;
  results: unknown[];
};

const EMPTY_HISTORY: ScenarioHistory = {
  issuedPolicies: new Map(),
  results: [],
};

// Every step both records a result and leaves exactly one policy changed:
// a quote issues one, a claim depletes the cap of the one it draws against.
type StepOutcome = {
  policyIndex: number;
  policy: IssuedPolicy;
  result: unknown;
};

const withStepRecorded = (
  history: ScenarioHistory,
  { policyIndex, policy, result }: StepOutcome,
): ScenarioHistory => ({
  issuedPolicies: new Map(history.issuedPolicies).set(policyIndex, policy),
  results: [...history.results, result],
});

const takeQuoteStep = (
  step: QuoteStep,
  stepIndex: number,
  history: ScenarioHistory,
  customer: Customer,
): ScenarioHistory =>
  withStepRecorded(history, {
    policyIndex: stepIndex,
    policy: {
      insuredItems: step.items,
      remainingCap: payoutCapOf(step.items),
    },
    result: {
      premium: quotePremium(step.items, {
        customer,
        previousContracts: history.issuedPolicies.size,
      }),
    },
  });

const issuedPolicyFor = (
  step: ClaimStep,
  issuedPolicies: Map<number, IssuedPolicy>,
): IssuedPolicy => {
  const policy = issuedPolicies.get(step.policy);

  if (policy === undefined) {
    throw new Error(`claim against unknown policy: ${step.policy}`);
  }

  return policy;
};

const takeClaimStep = (
  step: ClaimStep,
  history: ScenarioHistory,
): ScenarioHistory => {
  const policy = issuedPolicyFor(step, history.issuedPolicies);
  const { payout, remainingCap } = settleClaim(step.incident, policy);

  return withStepRecorded(history, {
    policyIndex: step.policy,
    policy: { ...policy, remainingCap },
    result: { payout, remainingCap },
  });
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const history = scenario.steps.reduce(
    (soFar, step, stepIndex) =>
      isQuote(step)
        ? takeQuoteStep(step, stepIndex, soFar, scenario.customer)
        : takeClaimStep(step, soFar),
    EMPTY_HISTORY,
  );

  return { results: history.results };
};
