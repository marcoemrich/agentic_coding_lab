const PROCESSING_FEE = 5;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const basePremiumFor = (type: string): number => BASE_PREMIUM[type] ?? 0;

// An item's insurance value is always 10× its base premium.
const INSURANCE_VALUE_MULTIPLIER = 10;

const insuranceValueFor = (type: string): number =>
  basePremiumFor(type) * INSURANCE_VALUE_MULTIPLIER;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const FIRST_INSURANCE_RATE = 0.1;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const groupBase = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * basePremiumFor(type);

const policyBase = (items: Item[]): number =>
  Array.from(countByType(items)).reduce(
    (total, [type, count]) => total + groupBase(type, count),
    0,
  );

const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;

type PolicyContext = { customer: Customer; isFollowUp: boolean };

type PolicyModifier = {
  applies: (ctx: PolicyContext) => boolean;
  rate: number;
  sign: 1 | -1;
};

const POLICY_MODIFIERS: PolicyModifier[] = [
  { applies: () => true, rate: FIRST_INSURANCE_RATE, sign: +1 },
  {
    applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS,
    rate: LOYALTY_RATE,
    sign: -1,
  },
  { applies: (ctx) => ctx.isFollowUp, rate: FOLLOW_UP_RATE, sign: -1 },
];

const policyAdjustments = (base: number, ctx: PolicyContext): number =>
  POLICY_MODIFIERS.reduce(
    (total, mod) => total + (mod.applies(ctx) ? mod.sign * base * mod.rate : 0),
    0,
  );

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const enchantmentLevel = (item: Item | undefined): number =>
  item?.enchantment ?? 0;

const surchargeWhen = (item: Item, applies: boolean, rate: number): number =>
  applies ? basePremiumFor(item.type) * rate : 0;

const curseSurcharge = (item: Item): number =>
  surchargeWhen(item, item.cursed === true, CURSE_RATE);

const highEnchantmentSurcharge = (item: Item): number =>
  surchargeWhen(
    item,
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_RATE,
  );

const itemSurcharges = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + curseSurcharge(item) + highEnchantmentSurcharge(item),
    0,
  );

// MHPCO always rounds money in its own favor: premiums up, payouts down.
const roundPremiumInFavorOfMHPCO = Math.ceil;
const roundPayoutInFavorOfMHPCO = Math.floor;

const quotePremium = (items: Item[], ctx: PolicyContext): number => {
  const base = policyBase(items);
  return roundPremiumInFavorOfMHPCO(
    base + itemSurcharges(items) + policyAdjustments(base, ctx) + PROCESSING_FEE,
  );
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

const capFor = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);

const reimbursableAmount = (amount: number, item: Item | undefined): number => {
  const isHighEnchantment =
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  return isHighEnchantment ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE : amount;
};

const damagePayout = (damage: Damage, item: Item | undefined): number =>
  reimbursableAmount(damage.amount, item) - DEDUCTIBLE;

const itemByType = (items: Item[], type: string): Item | undefined =>
  items.find((item) => item.type === type);

const totalPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + damagePayout(damage, itemByType(items, damage.itemType)),
    0,
  );

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };

type PolicyLedger = {
  registerQuote: (index: number, items: Item[]) => void;
  isFollowUp: () => boolean;
  itemsFor: (policy: number) => Item[];
  recordClaim: (policy: number, desiredPayout: number) => ClaimResult;
};

const createPolicyLedger = (): PolicyLedger => {
  const remainingCaps = new Map<number, number>();
  const policyItems = new Map<number, Item[]>();
  return {
    registerQuote: (index, items) => {
      remainingCaps.set(index, capFor(items));
      policyItems.set(index, items);
    },
    isFollowUp: () => remainingCaps.size > 0,
    itemsFor: (policy) => policyItems.get(policy) ?? [],
    recordClaim: (policy, desiredPayout) => {
      const cap = remainingCaps.get(policy) ?? 0;
      const payout = Math.min(desiredPayout, cap);
      const remainingCap = cap - payout;
      remainingCaps.set(policy, remainingCap);
      return { payout, remainingCap };
    },
  };
};

const handleQuote = (
  step: QuoteStep,
  index: number,
  customer: Customer,
  ledger: PolicyLedger,
): QuoteResult => {
  const ctx: PolicyContext = { customer, isFollowUp: ledger.isFollowUp() };
  ledger.registerQuote(index, step.items);
  return { premium: quotePremium(step.items, ctx) };
};

const handleClaim = (step: ClaimStep, ledger: PolicyLedger): ClaimResult => {
  const items = ledger.itemsFor(step.policy);
  const desired = totalPayout(step.incident.damages, items);
  return ledger.recordClaim(step.policy, roundPayoutInFavorOfMHPCO(desired));
};

const quoteSteps = (steps: Step[]): QuoteStep[] =>
  steps.filter((step): step is QuoteStep => step.op === "quote");

const claimSteps = (steps: Step[]): ClaimStep[] =>
  steps.filter((step): step is ClaimStep => step.op === "claim");

const policyQuoteFor = (
  steps: Step[],
  claim: ClaimStep,
): QuoteStep | undefined => {
  const referenced = steps[claim.policy];
  return referenced?.op === "quote" ? referenced : undefined;
};

const allQuotedItems = (steps: Step[]): Item[] =>
  quoteSteps(steps).flatMap((quote) => quote.items);

const allClaimedDamages = (steps: Step[]): Damage[] =>
  claimSteps(steps).flatMap((claim) => claim.incident.damages);

const assertKnownItemTypes = (steps: Step[]): void => {
  for (const item of allQuotedItems(steps)) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const countDamagesByType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

const assertClaimItemsInsured = (steps: Step[]): void => {
  for (const claim of claimSteps(steps)) {
    const insuredCounts = countByType(policyQuoteFor(steps, claim)?.items ?? []);
    for (const [type, damageCount] of countDamagesByType(claim.incident.damages)) {
      if ((insuredCounts.get(type) ?? 0) < damageCount) {
        throw new Error(
          `damage references ${type} not insured by policy ${claim.policy}`,
        );
      }
    }
  }
};

const assertNonNegativeDamages = (steps: Step[]): void => {
  for (const damage of allClaimedDamages(steps)) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
};

const assertScenarioValid = (steps: Step[]): void => {
  assertKnownItemTypes(steps);
  assertClaimItemsInsured(steps);
  assertNonNegativeDamages(steps);
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  assertScenarioValid(scenario.steps);
  const ledger = createPolicyLedger();
  const results = scenario.steps.map((step, index) =>
    step.op === "quote"
      ? handleQuote(step, index, scenario.customer, ledger)
      : handleClaim(step, ledger),
  );
  return { results };
};
