export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: 'quote'; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

type Policy = { items: Item[]; remainingCap: number };

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = 15;
const CURSE_DIVISOR = 2;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const PERCENT_DENOMINATOR = 100;
const HIGH_ENCHANTMENT_PERCENT = 30;
const LOYALTY_PERCENT = 20;
const INITIAL_ASSESSMENT_PERCENT = 10;
const FOLLOW_UP_PERCENT = 15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const LOYALTY_YEARS = 2;

const VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function quotePremium(items: Item[], loyal: boolean, followUp: boolean): number {
  const componentCounts = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
  const base = items.reduce((total, item) => total + PREMIUMS[item.type], 0)
    - (componentCounts.rune === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_SAVING : 0)
    - (componentCounts.moonstone === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_SAVING : 0);
  const riskSurcharges = items.reduce((total, item) => {
    const itemBase = PREMIUMS[item.type];
    return total + (item.cursed ? itemBase / CURSE_DIVISOR : 0)
      + ((item.enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD
        ? itemBase * HIGH_ENCHANTMENT_PERCENT / PERCENT_DENOMINATOR : 0);
  }, 0);
  const loyaltyDiscount = loyal ? base * LOYALTY_PERCENT / PERCENT_DENOMINATOR : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_PERCENT / PERCENT_DENOMINATOR : 0;
  const initialAssessment = base * INITIAL_ASSESSMENT_PERCENT / PERCENT_DENOMINATOR;
  return Math.ceil(base + riskSurcharges + initialAssessment
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function processClaim(policy: Policy, step: ClaimStep): Result {
  const remainingItems = [...policy.items];
  const desired = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error('Negative damage amount');
    const itemIndex = remainingItems.findIndex(item => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Item is not covered: ${damage.itemType}`);
    const item = remainingItems.splice(itemIndex, 1)[0];
    const reimbursable = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount / CURSE_DIVISOR : damage.amount;
    return sum + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quotes = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map<Result>((step, stepIndex) => {
    if (step.op === 'quote') {
      for (const item of step.items) {
        if (!(item.type in PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const result = {
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO >= LOYALTY_YEARS, quotes > 0),
      };
      quotes += 1;
      const insuranceSum = step.items.reduce((sum, item) => sum + VALUES[item.type], 0);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      return result;
    }
    const policy = policies.get(step.policy);
    if (!policy) throw new Error('Claim requires a policy');
    return processClaim(policy, step);
  });
  return { results };
}
