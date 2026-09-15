export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const CURSE_RATE = 0.5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const CAP_MULTIPLIER = 2;
const ITEM_CATALOG: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

function catalogEntry(type: string): { value: number; premium: number } {
  const entry = ITEM_CATALOG[type];
  if (!entry) throw new Error(`Unknown item type '${type}'`);
  return entry;
}

export function insuranceValue(type: string): number {
  return catalogEntry(type).value;
}

function premiumForType(type: string, count: number): number {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return catalogEntry(type).premium * count;
}

export function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValue(item.type), 0) * CAP_MULTIPLIER;
}

export function basePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce(
    (total, [type, count]) => total + premiumForType(type, count),
    0,
  );
}

function curseSurchargeFor(item: Item): number {
  return item.cursed ? catalogEntry(item.type).premium * CURSE_RATE : 0;
}

function enchantmentSurchargeFor(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? catalogEntry(item.type).premium * HIGH_ENCHANTMENT_RATE
    : 0;
}

export function adjustedItemSubtotal(items: Item[]): number {
  const surcharge = items.reduce(
    (total, item) => total + curseSurchargeFor(item) + enchantmentSurchargeFor(item),
    0,
  );
  return basePremium(items) + surcharge;
}

function customerHistoryAdjustment(policyBase: number, years: number, previousQuotes: number): number {
  const loyaltyDiscount = years >= LOYALTY_YEARS ? policyBase * LOYALTY_RATE : 0;
  const followUpDiscount = previousQuotes > 0 ? policyBase * FOLLOW_UP_RATE : 0;
  return policyBase * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount;
}

export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousQuotes: number): number {
  const policyBase = basePremium(items);
  return roundPremium(adjustedItemSubtotal(items)
    + customerHistoryAdjustment(policyBase, yearsWithMHPCO, previousQuotes) + PROCESSING_FEE);
}

function reimbursementRateFor(item: Item): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
}

function damagePayout(item: Item, amount: number): number {
  return Math.max(0, amount * reimbursementRateFor(item) - DEDUCTIBLE);
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error("Damage amount cannot be negative");
}

function matchedItemsFor(policy: Policy, step: ClaimStep): Item[] {
  const available = [...policy.items];
  return step.incident.damages.map((damage) => {
    validateDamageAmount(damage.amount);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item '${damage.itemType}' is not insured`);
    return available.splice(index, 1)[0];
  });
}

function desiredClaimPayout(policy: Policy, step: ClaimStep): number {
  const items = matchedItemsFor(policy, step);
  return step.incident.damages.reduce(
    (total, damage, index) => total + damagePayout(items[index], damage.amount),
    0,
  );
}

export function roundPayout(amount: number): number {
  return Math.floor(amount);
}

function processClaim(policy: Policy, step: ClaimStep): Result {
  const payout = roundPayout(Math.min(desiredClaimPayout(policy, step), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      results.push(processClaim(policies.get(step.policy)!, step));
      return;
    }
    policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
    results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount) });
    quoteCount += 1;
  });
  return { results };
}
