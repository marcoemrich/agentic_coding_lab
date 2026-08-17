type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Array<{ itemType: string; amount: number }> } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Array<QuoteStep | ClaimStep> };

const MAIN_ITEM_BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DAMAGE_DEDUCTIBLE = 100;
const COMPONENT_BLOCK_SIZE = 3;
const BLOCK_COMPONENT_PRICE = 20;
const STANDARD_COMPONENT_PRICE = 25;
const CURSE_SURCHARGE_RATE = 0.5;
const PREMIUM_ENCHANTMENT_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const PREMIUM_TAX_RATE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_INSURED_VALUE = 250;
const MAIN_ITEM_INSURED_VALUE_MULTIPLIER = 10;
const COVERAGE_CAP_MULTIPLIER = 2;
const ADMINISTRATION_FEE = 5;

type Damage = ClaimStep["incident"]["damages"][number];
type Policy = { items: Item[]; remainingCap: number };
type PriceTotals = { base: number; total: number };

function isComponent(item: Item): boolean {
  return item.type === "rune" || item.type === "moonstone";
}

function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!isComponent(item) && MAIN_ITEM_BASE_PRICES[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function getBasePrice(item: Item, quoteItems: Item[]): number {
  if (!isComponent(item)) return MAIN_ITEM_BASE_PRICES[item.type];
  const sameTypeCount = quoteItems.filter(({ type }) => type === item.type).length;
  return sameTypeCount === COMPONENT_BLOCK_SIZE ? BLOCK_COMPONENT_PRICE : STANDARD_COMPONENT_PRICE;
}

function calculatePriceTotals(items: Item[]): PriceTotals {
  return items.reduce((totals, item) => {
    const basePrice = getBasePrice(item, items);
    const curseSurcharge = item.cursed ? basePrice * CURSE_SURCHARGE_RATE : 0;
    const enchantmentSurcharge = (item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT_THRESHOLD
      ? basePrice * ENCHANTMENT_SURCHARGE_RATE
      : 0;
    totals.base += basePrice;
    totals.total += basePrice + basePrice * PREMIUM_TAX_RATE + curseSurcharge + enchantmentSurcharge;
    return totals;
  }, { base: 0, total: 0 });
}

function calculatePremium(items: Item[], customerYears: number, isFollowUp: boolean): number {
  const priceTotals = calculatePriceTotals(items);
  const loyaltyDiscount = customerYears >= LOYALTY_YEARS_THRESHOLD
    ? priceTotals.base * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp ? priceTotals.base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(priceTotals.total - loyaltyDiscount - followUpDiscount + ADMINISTRATION_FEE);
}

function calculateCoverageCap(items: Item[]): number {
  const insuredValue = items.reduce((sum, item) => sum + (isComponent(item)
    ? COMPONENT_INSURED_VALUE
    : MAIN_ITEM_BASE_PRICES[item.type] * MAIN_ITEM_INSURED_VALUE_MULTIPLIER), 0);
  return insuredValue * COVERAGE_CAP_MULTIPLIER;
}

function calculateDamagePayout(damage: Damage, insuredItem: Item): number {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  const reimbursableDamage = (insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursableDamage - DAMAGE_DEDUCTIBLE);
}

function settleClaim(policy: Policy, damages: Damage[]) {
  const matchedDamageCounts = new Map<string, number>();
  const payoutAfterDeductibles = damages.reduce((sum, damage) => {
    const matchIndex = matchedDamageCounts.get(damage.itemType) ?? 0;
    const insuredItem = policy.items.filter(({ type }) => type === damage.itemType)[matchIndex];
    if (!insuredItem) throw new Error(`Damage item ${damage.itemType} is not insured by this policy`);
    matchedDamageCounts.set(damage.itemType, matchIndex + 1);
    return sum + calculateDamagePayout(damage, insuredItem);
  }, 0);
  const payout = Math.min(Math.floor(payoutAfterDeductibles), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown) {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") {
      return settleClaim(policies.get(step.policy)!, step.incident.damages);
    }
    validateQuoteItems(step.items);
    const policy = { items: step.items, remainingCap: calculateCoverageCap(step.items) };
    policies.set(stepIndex, policy);
    const premium = calculatePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
