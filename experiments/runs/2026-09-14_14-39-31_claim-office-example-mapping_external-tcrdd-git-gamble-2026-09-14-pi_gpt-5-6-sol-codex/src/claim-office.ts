export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep { op: 'quote'; items: Item[] }
export interface Damage { itemType: string; amount: number }
export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export type Step = QuoteStep | ClaimStep;
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PREMIUMS: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BLOCK_SIZE = 3;
const BLOCK_ITEM_PREMIUM = 20;
const ENCHANTED_PREMIUM_THRESHOLD = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const LOYALTY_YEARS = 2;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const FRACTION_SCALE = 20;
const CURSE_UNITS = 10;
const ENCHANTMENT_UNITS = 6;
const INITIAL_UNITS = 2;
const LOYALTY_UNITS = 4;
const FOLLOW_UP_UNITS = 3;
const PROCESSING_FEE_UNITS = 100;

function itemPremiums(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return items.map(item => COMPONENT_TYPES.has(item.type) && counts.get(item.type) === BLOCK_SIZE
    ? BLOCK_ITEM_PREMIUM
    : PREMIUMS[item.type]);
}

function quotePremium(items: Item[], years: number, quoteNumber: number): number {
  const premiums = itemPremiums(items);
  const base = premiums.reduce((sum, premium) => sum + premium, 0);
  let units = base * FRACTION_SCALE + base * INITIAL_UNITS;
  items.forEach((item, index) => {
    if (item.cursed) units += premiums[index] * CURSE_UNITS;
    if ((item.enchantment ?? 0) >= ENCHANTED_PREMIUM_THRESHOLD) {
      units += premiums[index] * ENCHANTMENT_UNITS;
    }
  });
  if (years >= LOYALTY_YEARS) units -= base * LOYALTY_UNITS;
  if (quoteNumber > 0) units -= base * FOLLOW_UP_UNITS;
  return Math.ceil((units + PROCESSING_FEE_UNITS) / FRACTION_SCALE);
}

interface Policy { items: Item[]; remainingCap: number }

function createPolicy(items: Item[]): Policy {
  for (const item of items) {
    if (!(item.type in VALUES)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const insuranceSum = items.reduce((sum, item) => sum + VALUES[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function calculateClaim(policy: Policy, step: ClaimStep): Result {
  const available = [...policy.items];
  let desired = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error('Negative damage amount');
    const index = available.findIndex(item => item.type === damage.itemType);
    if (index < 0) throw new Error(`Item is not covered by policy: ${damage.itemType}`);
    const [item] = available.splice(index, 1);
    const fraction = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? CAP_MULTIPLIER : 1;
    desired += Math.max(0, damage.amount / fraction - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteNumber = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === 'quote') {
      const policy = createPolicy(step.items);
      policies.set(stepIndex, policy);
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteNumber++) });
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Policy does not refer to an earlier quote: ${step.policy}`);
      results.push(calculateClaim(policy, step));
    }
  });
  return { results };
}
