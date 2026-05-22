const PROCESSING_FEE = 5;
const BLOCK_OF_THREE_DISCOUNT = 15;
const BLOCK_SIZE = 3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const CURSED_RATE = 0.5;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CLAIM_DEDUCTIBLE = 100;
const HALF_PAYMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_PAYMENT_RATE = 0.5;

const ITEM_BASE_PRICES: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

type Item = { type: string; enchantment?: number; cursed?: boolean; material?: string };
type Customer = { yearsWithMHPCO?: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = {
  customer?: Customer;
  steps: Step[];
};

function countByKey<T>(values: T[], keyOf: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function countItemsByType(items: Item[]): Map<string, number> {
  return countByKey(items, (item) => item.type);
}

function blockDiscountFor(type: string, count: number): number {
  const isComponent = COMPONENT_TYPES.has(type);
  const formsBlock = count === BLOCK_SIZE;
  return isComponent && formsBlock ? BLOCK_OF_THREE_DISCOUNT : 0;
}

function basePremiumForGroup(type: string, count: number): number {
  return count * ITEM_BASE_PRICES[type] - blockDiscountFor(type, count);
}

function assertItemTypesAreKnown(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in ITEM_BASE_PRICES)) {
      throw new Error(`Unknown item type: "${item.type}"`);
    }
  }
}

function computePolicyBase(items: Item[]): number {
  const itemCountsByType = countItemsByType(items);
  let basePremium = 0;
  for (const [type, count] of itemCountsByType.entries()) {
    basePremium += basePremiumForGroup(type, count);
  }
  return basePremium;
}

function sumItemSurcharge(
  items: Item[],
  rate: number,
  applies: (item: Item) => boolean,
): number {
  return items
    .filter(applies)
    .reduce((sum, item) => sum + ITEM_BASE_PRICES[item.type] * rate, 0);
}

function computeFirstInsuranceSurcharge(policyBase: number): number {
  return policyBase * FIRST_INSURANCE_RATE;
}

function computeHighEnchantmentSurcharge(items: Item[]): number {
  return sumItemSurcharge(
    items,
    HIGH_ENCHANTMENT_RATE,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
  );
}

function computeCursedSurcharge(items: Item[]): number {
  return sumItemSurcharge(items, CURSED_RATE, (item) => item.cursed === true);
}

function computeLoyaltyDiscount(policyBase: number, customer: Customer): number {
  const years = customer.yearsWithMHPCO ?? 0;
  if (years >= LOYALTY_YEARS_THRESHOLD) {
    return policyBase * LOYALTY_DISCOUNT_RATE;
  }
  return 0;
}

function computeFollowUpDiscount(policyBase: number, isFollowUpQuote: boolean): number {
  return isFollowUpQuote ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function computeQuotePremium(
  items: Item[],
  customer: Customer,
  isFollowUpQuote: boolean,
): number {
  assertItemTypesAreKnown(items);
  const policyBase = computePolicyBase(items);
  const premium =
    policyBase +
    computeHighEnchantmentSurcharge(items) +
    computeCursedSurcharge(items) +
    computeFirstInsuranceSurcharge(policyBase) -
    computeLoyaltyDiscount(policyBase, customer) -
    computeFollowUpDiscount(policyBase, isFollowUpQuote) +
    PROCESSING_FEE;
  return Math.ceil(premium);
}

function reimbursementFor(item: Item, damageAmount: number): number {
  const qualifiesForHalfPayment =
    (item.enchantment ?? 0) >= HALF_PAYMENT_ENCHANTMENT_THRESHOLD;
  const grossReimbursement = qualifiesForHalfPayment
    ? damageAmount * HALF_PAYMENT_RATE
    : damageAmount;
  return grossReimbursement - CLAIM_DEDUCTIBLE;
}

type Damage = { itemType: string; amount: number };

function countDamagesByType(damages: Damage[]): Map<string, number> {
  return countByKey(damages, (damage) => damage.itemType);
}

function assertDamagesCoveredByPolicy(damages: Damage[], items: Item[]): void {
  const insuredCounts = countItemsByType(items);
  const damageCounts = countDamagesByType(damages);
  for (const [type, count] of damageCounts.entries()) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`Claim has more damages of type "${type}" than the policy covers`);
    }
  }
}

function assertDamageAmountsAreNonNegative(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
}

function computeClaimPayout(claim: ClaimStep, quote: QuoteStep): number {
  assertDamageAmountsAreNonNegative(claim.incident.damages);
  assertDamagesCoveredByPolicy(claim.incident.damages, quote.items);
  const total = claim.incident.damages.reduce((sum, damage) => {
    const item = quote.items.find((i) => i.type === damage.itemType)!;
    return sum + reimbursementFor(item, damage.amount);
  }, 0);
  return Math.floor(total);
}

export function runScenario(scenario: unknown): unknown {
  const s = scenario as Scenario;
  const customer = s.customer ?? { yearsWithMHPCO: 0 };

  const results = s.steps.map((step, index) => {
    if (step.op === "quote") {
      return { premium: computeQuotePremium(step.items, customer, index > 0) };
    }
    const quote = s.steps[step.policy] as QuoteStep;
    return { payout: computeClaimPayout(step, quote) };
  });
  return { results };
}
