type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type ScenarioResult = {
  results: Array<Record<string, unknown>>;
};

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const groupBy = <T>(entries: T[], keyOf: (entry: T) => string): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  for (const entry of entries) {
    const key = keyOf(entry);
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }
  return groups;
};

const baseTotalForGroup = (group: Item[]): number => {
  const type = group[0].type;
  if (COMPONENT_TYPES.has(type) && group.length === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return group.reduce((sum, item) => sum + basePremiumFor(item), 0);
};

const baseTotalFor = (items: Item[]): number => {
  let total = 0;
  for (const group of groupBy(items, (item) => item.type).values()) {
    total += baseTotalForGroup(group);
  }
  return total;
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = -0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = -0.15;

type Customer = { yearsWithMHPCO: number };

type QuoteContext = {
  items: Item[];
  customer: Customer;
  isFollowUpContract: boolean;
};

type PolicyModifier = {
  applies: (ctx: QuoteContext) => boolean;
  rate: number;
};

const POLICY_MODIFIERS: PolicyModifier[] = [
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE_RATE },
  {
    applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: LOYALTY_DISCOUNT_RATE,
  },
  { applies: (ctx) => ctx.isFollowUpContract, rate: FOLLOWUP_CONTRACT_DISCOUNT_RATE },
];

const itemSurchargeRateFor = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
};

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumFor(item) * itemSurchargeRateFor(item), 0);

const policyModifiersTotal = (baseTotal: number, ctx: QuoteContext): number =>
  POLICY_MODIFIERS.reduce(
    (sum, mod) => (mod.applies(ctx) ? sum + baseTotal * mod.rate : sum),
    0,
  );

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const ctx: QuoteContext = { items, customer, isFollowUpContract };
  const baseTotal = baseTotalFor(items);
  return Math.ceil(
    baseTotal +
      itemSurchargesFor(items) +
      policyModifiersTotal(baseTotal, ctx) +
      PROCESSING_FEE,
  );
};

const insuranceValueFor = (item: Item): number =>
  basePremiumFor(item) * INSURANCE_VALUE_MULTIPLIER;

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item), 0);

const reimbursementFor = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damageAmount;
};

const payoutForDamage = (item: Item, damage: Damage): number => {
  return Math.max(0, reimbursementFor(item, damage.amount) - DEDUCTIBLE);
};

const findItemOfType = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((item) => item.type === itemType);

const assertDamageAmountNonNegative = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
};

const assertDamageItemInPolicy = (policy: Policy, damage: Damage): void => {
  if (!findItemOfType(policy, damage.itemType)) {
    throw new Error(`Damage references item not in policy: ${damage.itemType}`);
  }
};

const countBy = <T>(entries: T[], keyOf: (entry: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = keyOf(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const assertDamageCountsWithinPolicy = (policy: Policy, incident: Incident): void => {
  const insuredCounts = countBy(policy.items, (item) => item.type);
  const damageCounts = countBy(incident.damages, (damage) => damage.itemType);
  for (const [itemType, count] of damageCounts) {
    if (count > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(
        `Claim has more damages of type ${itemType} than policy covers`,
      );
    }
  }
};

const validateClaimDamages = (policy: Policy, incident: Incident): void => {
  for (const damage of incident.damages) {
    assertDamageAmountNonNegative(damage);
    assertDamageItemInPolicy(policy, damage);
  }
  assertDamageCountsWithinPolicy(policy, incident);
};

const grossPayoutFor = (policy: Policy, incident: Incident): number =>
  incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(findItemOfType(policy, damage.itemType)!, damage),
    0,
  );

const processClaim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  validateClaimDamages(policy, incident);
  const payout = Math.floor(Math.min(grossPayoutFor(policy, incident), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const newPolicy = (items: Item[]): Policy => {
  const insuranceSum = insuranceSumFor(items);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUMS));

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};

  const handleQuote = (quote: QuoteStep, index: number) => {
    validateQuoteItems(quote.items);
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    policies[index] = newPolicy(quote.items);
    return { premium: quotePremium(quote.items, scenario.customer, isFollowUp) };
  };

  const handleClaim = (claim: ClaimStep) =>
    processClaim(policies[claim.policy], claim.incident);

  const results = scenario.steps.map((step, index) =>
    step.op === "quote" ? handleQuote(step, index) : handleClaim(step),
  );
  return { results };
};
