export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage { itemType: string; amount: number }
interface QuoteStep { op: 'quote'; items: Item[] }
interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
type Result = { premium: number } | { payout: number; remainingCap: number };

const PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = ['rune', 'moonstone'];
const PROCESSING_FEE = 5;
const HUNDRED = 100;
const BLOCK_SIZE = 3;
const BLOCK_SAVINGS = 15;
const CURSE_DIVISOR = 2;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DIVISOR = 5;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const INITIAL_ASSESSMENT_DIVISOR = 10;
const CAP_MULTIPLIER = 2;
const ENCHANTMENT_CLAIM_THRESHOLD = 8;
const ENCHANTMENT_REIMBURSEMENT_DIVISOR = 2;

function basePremium(items: Item[]): number {
  const regular = items.reduce((sum, item) => sum + PREMIUMS[item.type], 0);
  const blocks = COMPONENT_TYPES.filter(
    (type) => items.filter((item) => item.type === type).length === BLOCK_SIZE,
  ).length;
  return regular - blocks * BLOCK_SAVINGS;
}

function quote(items: Item[], years: number, quoteNumber: number): number {
  const base = basePremium(items);
  const curse = items.filter((item) => item.cursed)
    .reduce((sum, item) => sum + PREMIUMS[item.type] / CURSE_DIVISOR, 0);
  const enchantment = items.filter(
    (item) => (item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD,
  ).reduce(
    (sum, item) => sum + PREMIUMS[item.type] * ENCHANTMENT_SURCHARGE_PERCENT / HUNDRED, 0,
  );
  const loyalty = years >= LOYALTY_YEARS_THRESHOLD ? base / LOYALTY_DIVISOR : 0;
  const followUp = quoteNumber > 0 ? base * FOLLOW_UP_DISCOUNT_PERCENT / HUNDRED : 0;
  return Math.ceil(base + curse + enchantment + base / INITIAL_ASSESSMENT_DIVISOR
    - loyalty - followUp + PROCESSING_FEE);
}

interface Policy { items: Item[]; remainingCap: number }

function createPolicy(items: Item[]): Policy {
  items.forEach((item) => {
    if (!(item.type in VALUES)) throw new Error(`Unknown item type: ${item.type}`);
  });
  const insuranceSum = items.reduce((sum, item) => sum + VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const available = new Map<string, Item[]>();
  policy.items.forEach((item) => {
    const matching = available.get(item.type) ?? [];
    matching.push(item);
    available.set(item.type, matching);
  });
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Damage amount must not be negative');
    const item = available.get(damage.itemType)?.shift();
    if (!item) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    const reimbursable = (item.enchantment ?? 0) >= ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount / ENCHANTMENT_REIMBURSEMENT_DIVISOR
      : damage.amount;
    return sum + Math.max(0, reimbursable - HUNDRED);
  }, 0);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteNumber = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      policies.set(index, createPolicy(step.items));
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, quoteNumber++) });
      return;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy does not reference an earlier quote: ${step.policy}`);
    const desired = desiredPayout(policy, step.incident.damages);
    const payout = Math.floor(Math.min(desired, policy.remainingCap));
    policy.remainingCap -= payout;
    results.push({ payout, remainingCap: policy.remainingCap });
  });
  return { results };
}
