// MHPCO Claim Office - implementation

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type Result = QuoteResult | ClaimResult;

interface PolicyState {
  items: QuoteItem[];
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_OF_3_PREMIUM = 60;
const BLOCK_SIZE = 3;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export function basePremium(items: QuoteItem[]): number {
  const runePremium = componentBlockPremium(items, "rune");
  const moonstonePremium = componentBlockPremium(items, "moonstone");
  const others = items.filter((i) => i.type !== "rune" && i.type !== "moonstone");
  return runePremium + moonstonePremium + others.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
}

function componentBlockPremium(items: QuoteItem[], type: string): number {
  const count = items.filter((i) => i.type === type).length;
  return count === BLOCK_SIZE ? BLOCK_OF_3_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function mainItemBasePremium(item: QuoteItem): number {
  return MAIN_ITEM_BASE_PREMIUM[item.type] ?? 0;
}

function itemSurcharge(items: QuoteItem[], rate: number): number {
  return items.reduce((sum, item) => sum + mainItemBasePremium(item) * rate, 0);
}

function itemInsuranceValue(item: QuoteItem): number {
  return ITEM_INSURANCE_VALUE[item.type] ?? 0;
}

function claimReimbursementRate(item: QuoteItem): number {
  return (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANT_THRESHOLD
    ? CLAIM_HIGH_ENCHANT_RATE
    : 1;
}

function validateItemTypes(items: QuoteItem[]): void {
  for (const item of items) {
    if (!(item.type in ITEM_INSURANCE_VALUE)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function validateDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
}

function validateCoverage(damages: Damage[], items: QuoteItem[]): void {
  const insuredByType = new Map<string, number>();
  for (const item of items) {
    insuredByType.set(item.type, (insuredByType.get(item.type) ?? 0) + 1);
  }
  for (const damage of damages) {
    const remaining = (insuredByType.get(damage.itemType) ?? 0) - 1;
    if (remaining < 0) {
      throw new Error(`claim references more ${damage.itemType} damages than the policy covers`);
    }
    insuredByType.set(damage.itemType, remaining);
  }
}

function quotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): number {
  const base = basePremium(items);
  const curseSurcharge = itemSurcharge(
    items.filter((i) => i.cursed),
    CURSE_SURCHARGE_RATE,
  );
  const highEnchantSurcharge = itemSurcharge(
    items.filter((i) => (i.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD),
    HIGH_ENCHANT_SURCHARGE_RATE,
  );
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(
    base + curseSurcharge + highEnchantSurcharge - loyaltyDiscount -
      followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE,
  );
}

function createPolicy(items: QuoteItem[]): PolicyState {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, remainingCap: CAP_MULTIPLIER * insuranceSum };
}

function desiredPayout(damages: Damage[], items: QuoteItem[]): number {
  return damages.reduce((sum, damage) => {
    const item = items.find((i) => i.type === damage.itemType) as QuoteItem;
    return sum + damage.amount * claimReimbursementRate(item) - DEDUCTIBLE;
  }, 0);
}

export function processScenario(scenario: Scenario): Result[] {
  let seenQuote = false;
  const policies = new Map<number, PolicyState>();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = seenQuote;
      seenQuote = true;
      validateItemTypes(step.items);
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp);
      policies.set(index, createPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy) as PolicyState;
    validateDamageAmounts(step.incident.damages);
    validateCoverage(step.incident.damages, policy.items);
    const payoutRaw = Math.min(desiredPayout(step.incident.damages, policy.items), policy.remainingCap);
    policy.remainingCap -= payoutRaw;
    return { payout: Math.floor(payoutRaw), remainingCap: Math.floor(policy.remainingCap) };
  });
}
