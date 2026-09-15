const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const CURSE_PERCENT = 50;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const PREMIUM_ENCHANTMENT = 5;
const ENCHANTMENT_PERCENT = 30;
const FOLLOW_UP_PERCENT = 15;
const CLAIM_ENCHANTMENT = 8;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const COMPONENT_TYPES = ["rune", "moonstone"];

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: string; items?: Item[]; policy?: number; incident?: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: QuoteStep[] };
type Result = { premium: number } | { payout: number; remainingCap: number };
type Policy = { items: Item[]; remainingCap: number };

function basePremium(items: Item[]): number {
  const regular = items.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
  const savings = COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter((item) => item.type === type).length;
    return total + (count === BLOCK_SIZE ? count * BASE_PREMIUM[type] - BLOCK_PREMIUM : 0);
  }, 0);
  return regular - savings;
}

function quotePremium(items: Item[], years: number, previousContracts: number): number {
  const base = basePremium(items);
  const assessment = base * FIRST_INSURANCE_PERCENT / PERCENT;
  const curse = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] * CURSE_PERCENT / PERCENT : 0), 0);
  const enchantment = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT ? BASE_PREMIUM[item.type] * ENCHANTMENT_PERCENT / PERCENT : 0), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_PERCENT / PERCENT : 0;
  const followUp = previousContracts > 0 ? base * FOLLOW_UP_PERCENT / PERCENT : 0;
  return Math.ceil(base + assessment + curse + enchantment - loyalty - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const unknown = items.find((item) => !(item.type in INSURANCE_VALUE));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  if (damages.some(({ amount }) => amount < 0)) throw new Error("Damage amount cannot be negative");
  const used: Record<string, number> = {};
  return damages.reduce((total, damage) => {
    const occurrence = used[damage.itemType] ?? 0;
    const item = policy.items.filter(({ type }) => type === damage.itemType)[occurrence];
    if (!item) throw new Error(`Damage item is not covered by policy: ${damage.itemType}`);
    used[damage.itemType] = occurrence + 1;
    const reimbursable = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? damage.amount / CAP_MULTIPLIER : damage.amount;
    return total + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
}

function settleClaim(policy: Policy, damages: Damage[]): Result {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      policies.set(index, createPolicy(items));
      const premium = quotePremium(items, scenario.customer.yearsWithMHPCO, quoteCount);
      quoteCount += 1;
      return { premium };
    }
    const policy = policies.get(step.policy ?? -1);
    if (!policy) throw new Error("Claim references an unknown policy");
    return settleClaim(policy, step.incident?.damages ?? []);
  });
  return { results };
}
