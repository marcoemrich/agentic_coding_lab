type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number };
type Result = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const sum = (numbers: number[]): number => numbers.reduce((a, b) => a + b, 0);

const baseForItem = (item: Item): number => BASE_PREMIUM[item.type];

const baseForComponentGroup = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUM.rune;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const totalBaseForItems = (items: Item[]): number => {
  const mainItems = items.filter((i) => !COMPONENT_TYPES.has(i.type));
  const componentItems = items.filter((i) => COMPONENT_TYPES.has(i.type));
  const mainBase = sum(mainItems.map(baseForItem));
  const componentCounts = countBy(componentItems, (i) => i.type);
  const componentBase = sum(
    Array.from(componentCounts.values()).map(baseForComponentGroup),
  );
  return mainBase + componentBase;
};

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const itemSurcharges = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return surcharge;
};

const computePremium = (items: Item[], isLoyal: boolean, isFollowUp: boolean): number => {
  validateItemTypes(items);
  const baseTotal = totalBaseForItems(items);
  const surchargesTotal = sum(items.map(itemSurcharges));
  const firstInsuranceTotal = baseTotal * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = isLoyal ? baseTotal * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? baseTotal * FOLLOW_UP_DISCOUNT_RATE : 0;
  const total = baseTotal + surchargesTotal + firstInsuranceTotal - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return Math.ceil(total);
};

const payoutForDamage = (damage: Damage, item: Item): number => {
  const isHighEnchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;
  const reimbursable = isHighEnchantment
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;
  return reimbursable - DEDUCTIBLE_PER_DAMAGE;
};

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${d.amount}`);
    }
  }
  const damageCounts = countBy(damages, (d) => d.itemType);
  const policyCounts = countBy(policyItems, (i) => i.type);
  for (const [type, count] of damageCounts) {
    if (count > (policyCounts.get(type) ?? 0)) {
      throw new Error(`Claim has more ${type} damages than insured`);
    }
  }
};

const computePayout = (damages: Damage[], policyItems: Item[]): number => {
  validateDamages(damages, policyItems);
  const total = sum(
    damages.map((d) => {
      const item = policyItems.find((i) => i.type === d.itemType);
      return payoutForDamage(d, item ?? { type: d.itemType });
    }),
  );
  return Math.floor(total);
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const isLoyal = scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  let quoteCount = 0;
  const results: Result[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      return { premium: computePremium(step.items, isLoyal, isFollowUp) };
    }
    const policyStep = scenario.steps[step.policy];
    const policyItems = policyStep.op === "quote" ? policyStep.items : [];
    return { payout: computePayout(step.incident.damages, policyItems) };
  });
  return { results };
};
