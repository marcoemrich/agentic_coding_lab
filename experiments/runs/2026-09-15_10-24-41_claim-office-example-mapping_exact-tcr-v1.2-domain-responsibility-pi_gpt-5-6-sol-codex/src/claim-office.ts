export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
interface Result { premium?: number; payout?: number; remainingCap?: number }
interface Policy { items: Item[]; remainingCap: number }

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_DIVISOR = 10;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const CURSE_SURCHARGE_DIVISOR = 2;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_DIVISOR = 5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE_TENTHS = 3;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const PERCENT = 100;
const CLAIM_CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HALF = 2;

function basePremium(items: Item[]): number {
  const ordinaryPremium = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const blockCount = COMPONENT_TYPES.filter(
    (type) => items.filter((item) => item.type === type).length === BLOCK_SIZE,
  ).length;
  return ordinaryPremium - blockCount * BLOCK_SAVING;
}

function quotePremium(items: Item[], years: number, previousQuotes: number): number {
  const base = basePremium(items);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] / CURSE_SURCHARGE_DIVISOR : 0), 0);
  const enchantment = items.reduce(
    (sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_RATE_TENTHS / INITIAL_ASSESSMENT_DIVISOR
      : 0),
    0,
  );
  const loyalty = years >= LOYALTY_YEARS ? base / LOYALTY_DISCOUNT_DIVISOR : 0;
  const followUp = previousQuotes > 0 ? base * FOLLOW_UP_DISCOUNT_PERCENT / PERCENT : 0;
  return Math.ceil(base + curse + enchantment + base / INITIAL_ASSESSMENT_DIVISOR - loyalty - followUp + PROCESSING_FEE);
}

function validateItems(items: Item[]): void {
  items.forEach((item) => {
    if (!(item.type in BASE_PREMIUM)) throw new Error(`unknown item type: ${item.type}`);
  });
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CLAIM_CAP_MULTIPLIER };
}

function desiredDamagePayout(damage: Damage, item: Item): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? damage.amount / HALF
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamageMultiplicity(damages: Damage[], items: Item[]): void {
  damages.forEach((damage) => {
    if (!(damage.itemType in INSURANCE_VALUE)) throw new Error(`unknown item type: ${damage.itemType}`);
    if (damage.amount < 0) throw new Error("damage amount must not be negative");
    const damageCount = damages.filter((entry) => entry.itemType === damage.itemType).length;
    const insuredCount = items.filter((item) => item.type === damage.itemType).length;
    if (damageCount > insuredCount) throw new Error(`damage count exceeds insured ${damage.itemType} count`);
  });
}

function payClaim(step: ClaimStep, policy: Policy): Result {
  validateDamageMultiplicity(step.incident.damages, policy.items);
  const desired = step.incident.damages.reduce((sum, damage) => {
    const item = policy.items.find((insuredItem) => insuredItem.type === damage.itemType)!;
    return sum + desiredDamagePayout(damage, item);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let previousQuotes = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      validateItems(step.items);
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousQuotes) });
      policies.set(stepIndex, createPolicy(step.items));
      previousQuotes += 1;
    } else {
      results.push(payClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
