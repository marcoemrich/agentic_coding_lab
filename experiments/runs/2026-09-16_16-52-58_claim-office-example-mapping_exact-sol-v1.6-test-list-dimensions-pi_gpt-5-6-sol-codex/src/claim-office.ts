export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage { itemType: string; amount: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const ITEM_TERMS: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function assertKnownItemType(type: string): void {
  if (!ITEM_TERMS[type]) throw new Error(`Unknown item type: ${type}`);
}

function itemTerms(item: Item): { premium: number; value: number } {
  assertKnownItemType(item.type);
  return ITEM_TERMS[item.type];
}

function isComponent(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

function groupPremium(items: Item[]): number {
  if (items.length === BLOCK_SIZE && isComponent(items[0].type)) return BLOCK_PREMIUM;
  return items.reduce((sum, item) => sum + itemTerms(item).premium, 0);
}

function basePremium(items: Item[]): number {
  const types = [...new Set(items.map((item) => item.type))];
  return types.reduce((sum, type) => sum + groupPremium(items.filter((item) => item.type === type)), 0);
}

function insuranceValue(item: Item): number {
  return itemTerms(item).value;
}

function initialPolicyCap(policy: QuoteStep): number {
  return policy.items.reduce((sum, item) => sum + insuranceValue(item), 0) * CAP_MULTIPLIER;
}

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT ? HALF_REIMBURSEMENT_RATE : 1;
}

function damagePayout(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function validateDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Negative damage amount is invalid");
}

function validateDamageCounts(policy: QuoteStep, damages: Damage[]): void {
  const types = new Set(damages.map((damage) => damage.itemType));
  for (const type of types) {
    assertKnownItemType(type);
    const covered = policy.items.filter((item) => item.type === type).length;
    const reported = damages.filter((damage) => damage.itemType === type).length;
    if (reported > covered) throw new Error(`Damage entries exceed insured ${type} items`);
  }
}

function curseSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + (item.cursed ? itemTerms(item).premium * CURSE_RATE : 0), 0);
}

function enchantmentSurcharge(items: Item[]): number {
  return items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? itemTerms(item).premium * ENCHANTMENT_RATE : 0), 0);
}

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}

function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function roundPayout(amount: number): number {
  return Math.floor(amount);
}

function followUpDiscount(base: number, isFollowUp: boolean): number {
  return isFollowUp ? base * FOLLOW_UP_RATE : 0;
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): { premium: number } {
  const base = basePremium(items);
  const total = base + curseSurcharge(items) + enchantmentSurcharge(items) + base * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount(base, yearsWithMHPCO) - followUpDiscount(base, isFollowUp) + PROCESSING_FEE;
  return { premium: roundPremium(total) };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const remainingCaps = new Map<number, number>();
  const results = scenario.steps.map((step, index): Result => {
    const hasPriorQuote = scenario.steps.slice(0, index).some((prior) => prior.op === "quote");
    if (step.op === "quote") return quote(step.items, scenario.customer.yearsWithMHPCO, hasPriorQuote);
    const policy = scenario.steps[step.policy] as QuoteStep;
    validateDamageAmounts(step.incident.damages);
    validateDamageCounts(policy, step.incident.damages);
    const cap = remainingCaps.get(step.policy) ?? initialPolicyCap(policy);
    const desired = step.incident.damages.reduce((sum, damage) => {
      const item = policy.items.find((covered) => covered.type === damage.itemType) as Item;
      return sum + damagePayout(damage, item);
    }, 0);
    const payout = roundPayout(Math.min(cap, desired));
    const remainingCap = cap - payout;
    remainingCaps.set(step.policy, remainingCap);
    return { payout, remainingCap };
  });
  return { results };
}
