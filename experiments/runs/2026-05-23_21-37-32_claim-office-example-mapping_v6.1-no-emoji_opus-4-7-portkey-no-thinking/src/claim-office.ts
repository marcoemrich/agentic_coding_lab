// ============================================================================
// Domain types
// ============================================================================

type Customer = { yearsWithMHPCO: number };
type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type Policy = { items: Item[]; capRemaining: number };

// ============================================================================
// Pricing tables and constants
// ============================================================================

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

const KNOWN_TYPES = new Set(Object.keys(BASE_PREMIUMS));

// Quote-side constants
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// Claim-side constants
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// ============================================================================
// Shared helpers
// ============================================================================

const basePremiumFor = (type: string): number => BASE_PREMIUMS[type] ?? 0;
const insuranceValueFor = (type: string): number => INSURANCE_VALUES[type] ?? 0;

const roundUp = (n: number): number => Math.ceil(Math.round(n * 1e6) / 1e6);

const countByType = <T extends { type?: string; itemType?: string }>(
  records: T[],
  key: "type" | "itemType",
): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const record of records) {
    const k = record[key] as string;
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
};

// ============================================================================
// Quote pricing
// ============================================================================

const groupBasePrice = (type: string, count: number): number => {
  const blockApplies = COMPONENT_TYPES.has(type) && count === 3;
  return blockApplies ? COMPONENT_BLOCK_BASE : basePremiumFor(type) * count;
};

const itemBaseTotal = (items: Item[]): number =>
  Object.entries(countByType(items, "type")).reduce(
    (sum, [type, count]) => sum + groupBasePrice(type, count),
    0,
  );

type SurchargeRule = { applies: (item: Item) => boolean; rate: number };
const ITEM_SURCHARGE_RULES: SurchargeRule[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE,
  },
];

const itemSurchargeRate = (item: Item): number =>
  ITEM_SURCHARGE_RULES.reduce(
    (rate, rule) => (rule.applies(item) ? rate + rule.rate : rate),
    0,
  );

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item.type) * itemSurchargeRate(item), 0);

type PolicyDiscountRule = { applies: (c: Customer, quoteIndex: number) => boolean; rate: number };
const POLICY_DISCOUNT_RULES: PolicyDiscountRule[] = [
  { applies: (c) => c.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS, rate: LOYALTY_DISCOUNT },
  { applies: (_c, quoteIndex) => quoteIndex > 0, rate: FOLLOWUP_DISCOUNT },
];

const policyDiscountRate = (customer: Customer, quoteIndex: number): number =>
  POLICY_DISCOUNT_RULES.reduce(
    (rate, rule) => (rule.applies(customer, quoteIndex) ? rate + rule.rate : rate),
    0,
  );

const assertKnownTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const quotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  assertKnownTypes(items);
  const baseTotal = itemBaseTotal(items);
  const firstInsuranceSurcharge = baseTotal * FIRST_INSURANCE_SURCHARGE;
  const policyDiscount = baseTotal * policyDiscountRate(customer, quoteIndex);
  const subtotal = baseTotal + firstInsuranceSurcharge + itemSurcharges(items) - policyDiscount;
  return roundUp(subtotal + PROCESSING_FEE);
};

// ============================================================================
// Claim settlement
// ============================================================================

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

const newPolicy = (items: Item[]): Policy => ({
  items,
  capRemaining: 2 * insuranceSum(items),
});

const reimbursableAmount = (item: Item, damage: Damage): number => {
  const isHighEnchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  return isHighEnchantment ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE : damage.amount;
};

const damagePayoutAmount = (item: Item, damage: Damage): number =>
  Math.max(0, reimbursableAmount(item, damage) - DEDUCTIBLE);

const validateIncident = (policy: Policy, incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative, got ${damage.amount}`);
    }
  }
  const insuredCounts = countByType(policy.items, "type");
  const damageCounts = countByType(incident.damages, "itemType");
  for (const [type, count] of Object.entries(damageCounts)) {
    const insured = insuredCounts[type] ?? 0;
    if (count > insured) {
      throw new Error(`claim damages ${count} ${type}(s) but policy insures ${insured}`);
    }
  }
};

const findInsuredItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) throw new Error(`policy does not insure item of type ${itemType}`);
  return item;
};

const uncappedPayout = (policy: Policy, incident: Incident): number =>
  incident.damages.reduce(
    (sum, damage) => sum + damagePayoutAmount(findInsuredItem(policy, damage.itemType), damage),
    0,
  );

const settleClaim = (
  policy: Policy,
  incident: Incident,
): { result: ClaimResult; policy: Policy } => {
  validateIncident(policy, incident);
  const payout = Math.floor(Math.min(uncappedPayout(policy, incident), policy.capRemaining));
  const capRemaining = policy.capRemaining - payout;
  return { result: { payout, remainingCap: capRemaining }, policy: { ...policy, capRemaining } };
};

// ============================================================================
// Scenario runner
// ============================================================================

export const run = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer, policies.length) });
      policies.push(newPolicy(step.items));
    } else {
      const { result, policy } = settleClaim(policies[step.policy], step.incident);
      policies[step.policy] = policy;
      results.push(result);
    }
  }
  return { results };
};
