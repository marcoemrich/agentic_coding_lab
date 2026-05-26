const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;
// Insurance value (used for cap) is consistently 10x the base price across
// every item type in the spec, so we derive it instead of duplicating the table.
const INSURANCE_VALUE_TO_BASE_PRICE_RATIO = 10;

const BASE_PRICE_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PRICE_BY_TYPE));

type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };

type Policy = { items: Item[]; cap: number };
type ClaimLedger = {
  policies: Map<number, Policy>;
  paidOut: Map<number, number>;
};

const newLedger = (): ClaimLedger => ({
  policies: new Map(),
  paidOut: new Map(),
});

const registerPolicy = (
  ledger: ClaimLedger,
  index: number,
  policy: Policy,
): void => {
  ledger.policies.set(index, policy);
  ledger.paidOut.set(index, 0);
};

const getPolicy = (ledger: ClaimLedger, policyIndex: number): Policy => {
  const policy = ledger.policies.get(policyIndex);
  if (policy === undefined) {
    throw new Error(`Claim references unknown policy: ${policyIndex}`);
  }
  return policy;
};

const paidOutSoFar = (ledger: ClaimLedger, policyIndex: number): number =>
  ledger.paidOut.get(policyIndex) ?? 0;

const recordPayout = (
  ledger: ClaimLedger,
  policyIndex: number,
  amount: number,
): void => {
  ledger.paidOut.set(policyIndex, paidOutSoFar(ledger, policyIndex) + amount);
};

const basePriceFor = (type: string): number => BASE_PRICE_BY_TYPE[type] ?? 0;

// MHPCO always rounds in its own favor: premiums (customer pays) round up,
// payouts (MHPCO pays) round down. Naming the direction at the call site
// surfaces the business rule instead of leaving Math.ceil/Math.floor to be
// re-derived by the reader.
const roundPremiumInMHPCOFavor = (amount: number): number => Math.ceil(amount);
const roundPayoutInMHPCOFavor = (amount: number): number => Math.floor(amount);

const tally = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  tally(items, (item) => item.type);

// Only called with component types (callers filter first), so a block of
// COMPONENT_BLOCK_SIZE is enough to qualify for the block price.
const priceForComponentGroup = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : count * basePriceFor(type);

const enchantmentAtLeast = (item: Item, threshold: number): boolean =>
  (item.enchantment ?? 0) >= threshold;

const curseSurchargeFor = (item: Item, base: number): number =>
  item.cursed ? base * CURSE_SURCHARGE_RATE : 0;

const highEnchantmentSurchargeFor = (item: Item, base: number): number =>
  enchantmentAtLeast(item, HIGH_ENCHANTMENT_THRESHOLD)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

// Per-item surcharges (curse, high enchantment) applied on top of base price.
// All item-specific quote modifiers in the spec are surcharges; discounts
// (loyalty, follow-up) are policy-wide, not per-item.
const itemSurchargesFor = (item: Item): number => {
  const base = basePriceFor(item.type);
  return curseSurchargeFor(item, base) + highEnchantmentSurchargeFor(item, base);
};

const sumBy = <T>(items: T[], f: (item: T) => number): number =>
  items.reduce((total, item) => total + f(item), 0);

const componentsBaseSum = (components: Item[]): number =>
  sumBy(
    Array.from(countByType(components)),
    ([type, count]) => priceForComponentGroup(type, count),
  );

const mainItemsBaseSum = (mainItems: Item[]): number =>
  sumBy(mainItems, (item) => basePriceFor(item.type));

// Returns base prices (block-aware for components) and per-item surcharges
// (curse, high enchantment). Components contribute 0 to itemSurchargeSum
// since they don't carry the relevant fields.
const priceItems = (items: Item[]): { baseSum: number; itemSurchargeSum: number } => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((i) => !isComponent(i));
  return {
    baseSum: mainItemsBaseSum(mainItems) + componentsBaseSum(components),
    itemSurchargeSum: sumBy(items, itemSurchargesFor),
  };
};

const loyaltyDiscountFor = (customer: Customer, baseSum: number): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? baseSum * LOYALTY_DISCOUNT_RATE
    : 0;

// First-insurance surcharge is policy-wide: applied once on the sum of base
// prices. Equivalent to per-item since it is linear, but expressing it at the
// policy level matches the spec's categorization of policy-wide modifiers.
const firstInsuranceSurchargeFor = (baseSum: number): number =>
  baseSum * FIRST_INSURANCE_SURCHARGE_RATE;

const followUpDiscountFor = (isFollowUp: boolean, baseSum: number): number =>
  isFollowUp ? baseSum * FOLLOW_UP_DISCOUNT_RATE : 0;

const quoteItems = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => {
  const { baseSum, itemSurchargeSum } = priceItems(items);
  const surcharges = itemSurchargeSum + firstInsuranceSurchargeFor(baseSum);
  const discounts = loyaltyDiscountFor(customer, baseSum) + followUpDiscountFor(isFollowUp, baseSum);
  return {
    premium: roundPremiumInMHPCOFavor(baseSum + surcharges - discounts + PROCESSING_FEE),
  };
};

const insuranceValueFor = (type: string): number =>
  basePriceFor(type) * INSURANCE_VALUE_TO_BASE_PRICE_RATIO;

const insuranceSumFor = (items: Item[]): number =>
  sumBy(items, (item) => insuranceValueFor(item.type));

// Reimbursement covers the full damage amount, except highly-enchanted items
// (enchantment >= 8) which only get 50%. The flat per-damage deductible is
// then subtracted, and the payout cannot go negative.
const payoutForDamage = (damage: Damage, item: Item): number => {
  const isHighEnchantment = enchantmentAtLeast(item, HIGH_ENCHANTMENT_CLAIM_THRESHOLD);
  const rate = isHighEnchantment ? HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE_PER_DAMAGE);
};

const findItemByType = (items: Item[], type: string): Item | undefined =>
  items.find((item) => item.type === type);

// Uncapped sum of per-damage payouts for the incident, assuming each
// damaged item is covered by the policy. Cap enforcement happens at the
// orchestrator level.
const rawPayoutForIncident = (incident: Incident, items: Item[]): number =>
  sumBy(incident.damages, (damage) => {
    const item = findItemByType(items, damage.itemType)!;
    return payoutForDamage(damage, item);
  });

const validateDamagesNonNegative = (incident: Incident): void => {
  const negative = incident.damages.find((damage) => damage.amount < 0);
  if (negative !== undefined) {
    throw new Error(
      `Damage amount must be non-negative (got ${negative.amount} for '${negative.itemType}')`,
    );
  }
};

const validateDamagesCoveredByPolicy = (
  incident: Incident,
  items: Item[],
): void => {
  const itemCounts = countByType(items);
  const damageCounts = tally(incident.damages, (damage) => damage.itemType);
  for (const [type, damageCount] of damageCounts) {
    const itemCount = itemCounts.get(type) ?? 0;
    if (damageCount > itemCount) {
      throw new Error(
        `Claim references more '${type}' items than the policy covers ` +
          `(${damageCount} damaged, ${itemCount} insured)`,
      );
    }
  }
};

// All claim-incident invariants checked together: non-negative amounts
// (intrinsic damage validity) and policy coverage (cross-reference against
// the insured items). Grouped so processClaim reads as
// "validate -> compute -> record" and new invariants land in one place.
const validateIncident = (incident: Incident, items: Item[]): void => {
  validateDamagesNonNegative(incident);
  validateDamagesCoveredByPolicy(incident, items);
};

const processClaim = (
  step: ClaimStep,
  ledger: ClaimLedger,
): ClaimResult => {
  const policy = getPolicy(ledger, step.policy);
  validateIncident(step.incident, policy.items);
  const availableCap = policy.cap - paidOutSoFar(ledger, step.policy);
  const rawPayout = rawPayoutForIncident(step.incident, policy.items);
  const payout = roundPayoutInMHPCOFavor(Math.min(rawPayout, availableCap));
  recordPayout(ledger, step.policy, payout);
  return { payout, remainingCap: availableCap - payout };
};

const validateItemsKnown = (items: Item[]): void => {
  const unknown = items.find((item) => !KNOWN_ITEM_TYPES.has(item.type));
  if (unknown !== undefined) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const processQuote = (
  step: QuoteStep,
  ledger: ClaimLedger,
  customer: Customer,
  policyIndex: number,
): QuoteResult => {
  validateItemsKnown(step.items);
  // A quote is a "follow-up" iff some prior quote already registered a
  // policy. Since policies are only ever registered on quote steps,
  // the ledger's policy count is the running quote count.
  const isFollowUp = ledger.policies.size > 0;
  registerPolicy(ledger, policyIndex, {
    items: step.items,
    cap: insuranceSumFor(step.items) * CAP_MULTIPLIER,
  });
  return quoteItems(step.items, customer, isFollowUp);
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const ledger = newLedger();
  const results = scenario.steps.map((step, index): StepResult =>
    step.op === "quote"
      ? processQuote(step, ledger, scenario.customer, index)
      : processClaim(step, ledger),
  );
  return { results };
};
