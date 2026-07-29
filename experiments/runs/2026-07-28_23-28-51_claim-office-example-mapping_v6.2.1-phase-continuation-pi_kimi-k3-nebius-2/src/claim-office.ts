export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface QuoteStep {
  op: "quote";
  items: QuoteItem[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: DamageEntry[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type StepResult = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

interface ItemInfo {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_CATALOG: Record<string, ItemInfo> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const UNKNOWN_ITEM: ItemInfo = { basePremium: 0, insuranceValue: 0 };

function itemInfo(type: string): ItemInfo {
  return ITEM_CATALOG[type] ?? UNKNOWN_ITEM;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

function unitBasePremium(type: string): number {
  return itemInfo(type).basePremium;
}

function isKnownItemType(type: string): boolean {
  return type in ITEM_CATALOG;
}

function assertKnownItemTypes(items: QuoteItem[]): void {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function isComponentBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;
}

function basePremiumForType(type: string, count: number): number {
  if (isComponentBlock(type, count)) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * unitBasePremium(type);
}

function basePremium(items: QuoteItem[]): number {
  const countByType = countBy(items, (item) => item.type);
  return sumBy([...countByType], ([type, count]) =>
    basePremiumForType(type, count),
  );
}

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const isCursed = (item: QuoteItem): boolean => Boolean(item.cursed);

const enchantmentOf = (item: QuoteItem): number => item.enchantment ?? 0;

const hasHighEnchantment = (item: QuoteItem): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD;

function sumBy<T>(
  elements: T[],
  contribution: (element: T) => number,
): number {
  return elements.reduce((total, element) => total + contribution(element), 0);
}

function countBy<T>(
  elements: T[],
  keyOf: (element: T) => string,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const element of elements) {
    const key = keyOf(element);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function surchargeFor(
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number {
  return sumBy(items, (item) =>
    applies(item) ? unitBasePremium(item.type) * rate : 0,
  );
}

function cursedSurcharge(items: QuoteItem[]): number {
  return surchargeFor(items, isCursed, CURSED_SURCHARGE_RATE);
}

function highEnchantmentSurcharge(items: QuoteItem[]): number {
  return surchargeFor(items, hasHighEnchantment, HIGH_ENCHANTMENT_RATE);
}

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? base * LOYALTY_DISCOUNT_RATE
    : 0;
}

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function followUpDiscount(base: number, isFollowUpContract: boolean): number {
  return isFollowUpContract ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function quotePremium(
  items: QuoteItem[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const base = basePremium(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_RATE;
  return Math.ceil(
    base +
      cursedSurcharge(items) +
      highEnchantmentSurcharge(items) +
      firstInsuranceSurcharge -
      loyaltyDiscount(base, yearsWithMHPCO) -
      followUpDiscount(base, isFollowUpContract) +
      PROCESSING_FEE,
  );
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

interface Policy {
  items: QuoteItem[];
  remainingCap: number;
}

function insuranceSumFor(items: QuoteItem[]): number {
  return sumBy(items, (item) => itemInfo(item.type).insuranceValue);
}

const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const qualifiesForHighEnchantmentClause = (item: QuoteItem): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD;

function payoutForDamage(damage: DamageEntry, items: QuoteItem[]): number {
  const policyItem = items.find((item) => item.type === damage.itemType);
  if (policyItem === undefined) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  const reimbursable = qualifiesForHighEnchantmentClause(policyItem)
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursable - DEDUCTIBLE;
}

function payoutForDamages(damages: DamageEntry[], items: QuoteItem[]): number {
  return sumBy(damages, (damage) => payoutForDamage(damage, items));
}

function assertDamageCountsCovered(
  damages: DamageEntry[],
  items: QuoteItem[],
): void {
  const damageCountByType = countBy(damages, (damage) => damage.itemType);
  const coveredCountByType = countBy(items, (item) => item.type);
  for (const [type, damageCount] of damageCountByType) {
    if (damageCount > (coveredCountByType.get(type) ?? 0)) {
      throw new Error(`More damage entries than covered items: ${type}`);
    }
  }
}

function assertNonNegativeAmounts(damages: DamageEntry[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function settleClaim(policies: Map<number, Policy>, step: ClaimStep): StepResult {
  const policy = policies.get(step.policy) as Policy;
  const damages = step.incident.damages;
  assertNonNegativeAmounts(damages);
  assertDamageCountsCovered(damages, policy.items);
  const uncappedPayout = payoutForDamages(damages, policy.items);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function issuePolicy(
  policies: Map<number, Policy>,
  step: QuoteStep,
  policyIndex: number,
  yearsWithMHPCO: number,
): StepResult {
  const items = step.items;
  assertKnownItemTypes(items);
  const isFollowUpContract = policies.size > 0;
  policies.set(policyIndex, {
    items,
    remainingCap: CAP_MULTIPLIER * insuranceSumFor(items),
  });
  return { premium: quotePremium(items, yearsWithMHPCO, isFollowUpContract) };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  return scenario.steps.map((step, stepIndex) =>
    step.op === "claim"
      ? settleClaim(policies, step)
      : issuePolicy(policies, step, stepIndex, scenario.customer.yearsWithMHPCO),
  );
}
