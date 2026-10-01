type QuoteItem = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: QuoteItem[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ScenarioResult = { results: unknown[] };

const PROCESSING_FEE = 5;
// Percentages are expressed relative to this whole.
const HUNDRED_PERCENT = 100;
// MHPCO price list: an item's insurance value and its base premium.
type PriceListEntry = { insuranceValue: number; basePremium: number };
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};
const basePremiumOf = (type: string): number => PRICE_LIST[type].basePremium;
const insuranceValueOf = (type: string): number => PRICE_LIST[type].insuranceValue;
const COMPONENT_TYPES = ["rune", "moonstone"];
// Exactly this many alike components form a block with a flat base premium.
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

// A policy covers claims up to this multiple of its items' total insurance value.
const COVERAGE_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = HUNDRED_PERCENT;

// Integer arithmetic first, then divide: keeps results exact (100 * 1.1 !== 110).
const sumOf = <T>(values: T[], amountOf: (value: T) => number): number =>
  values.reduce((total, value) => total + amountOf(value), 0);

const percentOf = (amount: number, percent: number): number => (amount * percent) / HUNDRED_PERCENT;

// Only final amounts are rounded, always in MHPCO's favor; intermediate amounts stay exact.
const roundPremiumInMHPCOsFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOsFavor = (amount: number): number => Math.floor(amount);

const componentBasePremium = (items: QuoteItem[], type: string): number => {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE_PREMIUM : count * basePremiumOf(type);
};

const mainItemsBasePremium = (items: QuoteItem[]): number =>
  sumOf(
    items.filter((item) => !COMPONENT_TYPES.includes(item.type)),
    (item) => basePremiumOf(item.type),
  );

const totalBasePremium = (items: QuoteItem[]): number =>
  mainItemsBasePremium(items) +
  sumOf(COMPONENT_TYPES, (type) => componentBasePremium(items, type));

const enchantmentOf = (item: QuoteItem): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: QuoteItem): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

// Item-specific modifiers apply to the affected item's own base premium.
const itemSurchargePercent = (item: QuoteItem): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemSurcharges = (items: QuoteItem[]): number =>
  sumOf(items, (item) => percentOf(basePremiumOf(item.type), itemSurchargePercent(item)));

const isLoyalCustomer = (yearsWithMHPCO: number): boolean => yearsWithMHPCO >= LOYALTY_YEARS;

// Policy-wide modifiers (net percent) apply to the policy base premium.
const policyModifierPercent = (yearsWithMHPCO: number, isFollowUp: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT -
  (isLoyalCustomer(yearsWithMHPCO) ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const assertKnownItemTypes = (items: QuoteItem[]): void => {
  const unknownItem = items.find((item) => !(item.type in PRICE_LIST));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
};

const quotePremium = (items: QuoteItem[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  assertKnownItemTypes(items);
  const basePremium = totalBasePremium(items);
  const exactPremium =
    basePremium +
    itemSurcharges(items) +
    percentOf(basePremium, policyModifierPercent(yearsWithMHPCO, isFollowUp)) +
    PROCESSING_FEE;
  return roundPremiumInMHPCOsFavor(exactPremium);
};

// Every quote after the customer's first one is a follow-up quote.
const isFollowUpQuote = (stepIndex: number): boolean => stepIndex > 0;

const processQuote = (step: QuoteStep, customer: Customer, stepIndex: number) => ({
  premium: quotePremium(step.items, customer.yearsWithMHPCO, isFollowUpQuote(stepIndex)),
});

const coverageCap = (items: QuoteItem[]): number =>
  COVERAGE_CAP_MULTIPLIER * sumOf(items, (item) => insuranceValueOf(item.type));

// The high-enchantment reduction takes precedence over any material-based reimbursement.
const reimbursementPercent = (item: QuoteItem): number =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;

const damagePayout = (damage: Damage, item: QuoteItem): number =>
  percentOf(damage.amount, reimbursementPercent(item)) - DEDUCTIBLE;

// Removes and returns the first not-yet-damaged insured item matching the damage.
const takeInsuredItemFor = (undamagedItems: QuoteItem[], damage: Damage): QuoteItem => {
  const index = undamagedItems.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) throw new Error(`Damaged item is not insured by the policy: ${damage.itemType}`);
  return undamagedItems.splice(index, 1)[0];
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) throw new Error(`Damage amount must not be negative: ${negativeDamage.amount}`);
};

// Payout for all damages of one incident, before the coverage cap is applied.
const incidentPayout = (damages: Damage[], items: QuoteItem[]): number => {
  assertNonNegativeDamages(damages);
  const undamagedItems = [...items];
  return roundPayoutInMHPCOsFavor(
    sumOf(damages, (damage) => damagePayout(damage, takeInsuredItemFor(undamagedItems, damage))),
  );
};

// A claim's policy is referenced by the index of the quote step that created it.
const processClaim = (step: ClaimStep, steps: Step[], remainingCaps: Map<number, number>) => {
  const policy = steps[step.policy] as QuoteStep;
  const availableCoverage = remainingCaps.get(step.policy) ?? coverageCap(policy.items);
  const payout = Math.min(incidentPayout(step.incident.damages, policy.items), availableCoverage);
  const remainingCap = availableCoverage - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

// Dispatches each step to its handler by op.
const processStep = (step: Step, scenario: Scenario, stepIndex: number, remainingCaps: Map<number, number>) => {
  switch (step.op) {
    case "quote":
      return processQuote(step, scenario.customer, stepIndex);
    case "claim":
      return processClaim(step, scenario.steps, remainingCaps);
  }
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, stepIndex) => processStep(step, scenario, stepIndex, remainingCaps)),
  };
};
