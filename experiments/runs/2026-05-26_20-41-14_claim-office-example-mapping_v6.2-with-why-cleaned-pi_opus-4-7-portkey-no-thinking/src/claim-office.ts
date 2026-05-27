const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

type Customer = { yearsWithMHPCO: number };

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type ScenarioResult = { results: StepResult[] };

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const countBy = <T>(items: T[], key: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const k = key(item);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
};

const countItemsByType = (items: Item[]): Record<string, number> =>
  countBy(items, (item) => item.type);

const countDamagesByType = (damages: Damage[]): Record<string, number> =>
  countBy(damages, (damage) => damage.itemType);

// Premium for a stack of `count` items all of the same `type`, ignoring item modifiers.
// Component types (runes, moonstones) get a block discount when exactly 3 alike are bundled.
const stackBasePremium = (type: string, count: number): number => {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${type}`);
  }
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * BASE_PREMIUMS[type];
};

const sumBasePremiums = (items: Item[]): number => {
  const counts = countItemsByType(items);
  return Object.entries(counts).reduce(
    (total, [type, count]) => total + stackBasePremium(type, count),
    0,
  );
};

// Item-specific surcharges (curse, high enchantment) are based on the item's own base premium.
const itemSurcharges = (item: Item): number => {
  const itemBase = BASE_PREMIUMS[item.type];
  const curseSurcharge = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
  const enchantmentSurcharge = isHighlyEnchanted ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

// Net rate of policy-wide adjustments (first-insurance surcharge minus customer discounts),
// expressed as a fraction of base premium.
const policyAdjustmentRate = (customer: Customer, quoteIndex: number): number => {
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex > 0 ? FOLLOW_UP_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount;
};

const quotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  const basePremium = sumBasePremiums(items);
  const itemSurchargeTotal = sumItemSurcharges(items);
  const policyAdjustmentTotal = basePremium * policyAdjustmentRate(customer, quoteIndex);
  const premiumBeforeFee = Math.ceil(basePremium + itemSurchargeTotal + policyAdjustmentTotal);
  return premiumBeforeFee + PROCESSING_FEE;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

type Policy = { items: Item[]; remainingCap: number };

// Fraction of a damage amount that MHPCO reimburses before the deductible is applied.
// Highly-enchanted items (enchantment >= 8) only get 50% reimbursed; everything else is full.
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? HALF_REIMBURSEMENT_RATE
    : 1;

// Payout for a single damage entry: reimbursed portion minus the deductible, floored at 0.
const payoutForDamage = (damage: Damage, item: Item): number => {
  const reimbursed = damage.amount * reimbursementRate(item);
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

// Throws if any damage entry is malformed (negative amount).
const assertDamageAmountsValid = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

// Throws if the claim references more items of any type than the policy covers.
const assertDamageCountsFitPolicy = (policy: Policy, damages: Damage[]): void => {
  const policyCounts = countItemsByType(policy.items);
  const damageCounts = countDamagesByType(damages);
  for (const [type, count] of Object.entries(damageCounts)) {
    if ((policyCounts[type] ?? 0) < count) {
      throw new Error(`Claim references more ${type} items than the policy covers`);
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  assertDamageAmountsValid(incident.damages);
  assertDamageCountsFitPolicy(policy, incident.damages);
  const rawPayout = incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((i) => i.type === damage.itemType)!;
    return sum + payoutForDamage(damage, item);
  }, 0);
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  let quoteIndex = 0;
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, quoteIndex);
      quoteIndex += 1;
      const insuredValue = insuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: insuredValue * 2 });
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
