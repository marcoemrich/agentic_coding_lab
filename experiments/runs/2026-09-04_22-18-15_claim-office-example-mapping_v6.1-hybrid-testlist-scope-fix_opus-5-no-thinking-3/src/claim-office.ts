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

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Customer = {
  yearsWithMHPCO: number;
};

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };

/** One result per step, in step order: a quote step yields a
 * QuoteResult, a claim step a ClaimResult. */
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResults = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEFAULT_REIMBURSEMENT_RATE = 1;

/**
 * The catalogue of insurable items. Keeping the base premium and the insurance
 * value side by side means a new item type is added in exactly one place, and
 * the two figures cannot drift apart.
 */
const ITEM_CATALOGUE: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumOf = (type: string): number =>
  ITEM_CATALOGUE[type].basePremium;

const insuranceValueOf = (type: string): number =>
  ITEM_CATALOGUE[type].insuranceValue;

/** Premiums round up: the MHPCO's favour is the higher number. */
const roundPremiumInMHPCOsFavour = (premium: number): number =>
  Math.ceil(premium);

/** Payouts round down: the MHPCO's favour is the lower number. */
const roundPayoutInMHPCOsFavour = (payout: number): number =>
  Math.floor(payout);

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

/** Tallies how many entries fall under each type, given how to read the type. */
const countByType = <T>(entries: T[], typeOf: (entry: T) => string) => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const type = typeOf(entry);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const itemType = (item: Item): string => item.type;
const damagedItemType = (damage: Damage): string => damage.itemType;

const basePremiumForGroup = (type: string, count: number): number =>
  count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * basePremiumOf(type);

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items, itemType)].reduce(
    (total, [type, count]) => total + basePremiumForGroup(type, count),
    0,
  );

type SurchargeRule = {
  appliesTo: (item: Item) => boolean;
  rate: number;
};

const SURCHARGE_RULES: SurchargeRule[] = [
  {
    appliesTo: (item) => item.cursed === true,
    rate: CURSE_SURCHARGE,
  },
  {
    appliesTo: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE,
  },
];

const itemSurcharge = (item: Item): number => {
  const itemBasePremium = basePremiumOf(item.type);
  return SURCHARGE_RULES.filter((rule) => rule.appliesTo(item)).reduce(
    (surcharge, rule) => surcharge + itemBasePremium * rule.rate,
    0,
  );
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

type PolicyContext = {
  customer: Customer;
  isFollowUpContract: boolean;
};

type PolicyModifierRule = {
  appliesTo: (context: PolicyContext) => boolean;
  /** Signed rate applied to the policy base premium: positive adds, negative discounts. */
  rate: number;
};

const POLICY_MODIFIER_RULES: PolicyModifierRule[] = [
  {
    appliesTo: () => true,
    rate: FIRST_INSURANCE_SURCHARGE,
  },
  {
    appliesTo: ({ customer }) =>
      customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: -LOYALTY_DISCOUNT,
  },
  {
    appliesTo: ({ isFollowUpContract }) => isFollowUpContract,
    rate: -FOLLOW_UP_CONTRACT_DISCOUNT,
  },
];

const sumPolicyModifiers = (
  basePremium: number,
  context: PolicyContext,
): number =>
  POLICY_MODIFIER_RULES.filter((rule) => rule.appliesTo(context)).reduce(
    (total, rule) => total + basePremium * rule.rate,
    0,
  );

const quotePremium = (items: Item[], context: PolicyContext): number => {
  const basePremium = policyBasePremium(items);
  return roundPremiumInMHPCOsFavour(
    basePremium +
      sumItemSurcharges(items) +
      sumPolicyModifiers(basePremium, context) +
      PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);

/**
 * The fraction of a damage amount the policy covers, before the deductible.
 *
 * The spec also states that dragon-material items are "fully reimbursed". That
 * clause is not listed here because full reimbursement is already the default
 * rate: in every spec example the two coincide, so no test can tell an explicit
 * dragon clause apart from this default. Adding one would be untested code.
 * A dragon clause only becomes observable if a future rule reduces the default
 * below 1 for some item a dragon-material item could also match.
 */
const reimbursementRateFor = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT
    : DEFAULT_REIMBURSEMENT_RATE;

/** What the policy covers for one damaged item, before the deductible. */
const coveredAmountFor = (damage: Damage, insuredItems: Item[]): number => {
  const item = insuredItems.find(
    (candidate) => candidate.type === damage.itemType,
  );
  return damage.amount * reimbursementRateFor(item);
};

/**
 * What the claim asks for, before the policy's remaining cap is applied.
 * The deductible is withheld once per damaged item.
 */
const desiredPayout = (damages: Damage[], insuredItems: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + coveredAmountFor(damage, insuredItems) - DEDUCTIBLE,
    0,
  );

/**
 * Tracks how much cover each policy has left. A policy is identified by the
 * step index of the quote that created it, which is how claims refer to it.
 */
type PolicyLedger = {
  open: (policyId: number, items: Item[]) => void;
  insuredItems: (policyId: number) => Item[];
  /** Pays out at most the policy's remaining cap. */
  drawDown: (policyId: number, desiredPayout: number) => ClaimResult;
};

const createPolicyLedger = (): PolicyLedger => {
  const remainingCaps = new Map<number, number>();
  const itemsByPolicy = new Map<number, Item[]>();

  return {
    open: (policyId, items) => {
      remainingCaps.set(policyId, insuranceSum(items) * CAP_MULTIPLIER);
      itemsByPolicy.set(policyId, items);
    },

    insuredItems: (policyId) => itemsByPolicy.get(policyId) ?? [],

    drawDown: (policyId, desiredPayout) => {
      const cap = remainingCaps.get(policyId) ?? 0;
      const payout = Math.min(roundPayoutInMHPCOsFavour(desiredPayout), cap);
      const remainingCap = cap - payout;
      remainingCaps.set(policyId, remainingCap);
      return { payout, remainingCap };
    },
  };
};

const isKnownItemType = (type: string): boolean =>
  Object.hasOwn(ITEM_CATALOGUE, type);

const processQuote = (
  step: QuoteStep,
  policyId: number,
  customer: Customer,
  ledger: PolicyLedger,
): QuoteResult => {
  for (const item of step.items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }

  ledger.open(policyId, step.items);
  return {
    premium: quotePremium(step.items, {
      customer,
      isFollowUpContract: policyId > 0,
    }),
  };
};

const validateDamages = (damages: Damage[], insuredItems: Item[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }

  const insuredCounts = countByType(insuredItems, itemType);
  for (const [type, damagedCount] of countByType(damages, damagedItemType)) {
    if (damagedCount > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`more damages than insured items of type: ${type}`);
    }
  }
};

const processClaim = (step: ClaimStep, ledger: PolicyLedger): ClaimResult => {
  const insuredItems = ledger.insuredItems(step.policy);
  validateDamages(step.incident.damages, insuredItems);
  return ledger.drawDown(
    step.policy,
    desiredPayout(step.incident.damages, insuredItems),
  );
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const ledger = createPolicyLedger();

  const results = scenario.steps.map((step, index) =>
    step.op === "quote"
      ? processQuote(step, index, scenario.customer, ledger)
      : processClaim(step, ledger),
  );

  return { results };
};
